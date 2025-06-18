
import { render, waitFor } from '@testing-library/react';
import { screen, fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
import BottomActionMenu from './BottomActionMenu';
import { authenticatedFetch } from '../lib/authenticatedFetch';

// Mock the useLanguage hook
jest.mock('../contexts/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        'controls.newGame': 'New Game',
        'controls.getHint': 'Get Hint',
        'controls.resign': 'Resign',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock authenticatedFetch if it's not already mocked by jest.setup.ts
// This is a safeguard; the primary mock is in jest.setup.ts
jest.mock('../lib/authenticatedFetch', () => ({
  authenticatedFetch: jest.fn(async () => ({ ok: true, json: async () => ({}) })),
}));


describe('BottomActionMenu', () => {
  jest.useFakeTimers(); // Enable Jest's fake timers

  // Helper to access global delay functions in a type-safe way
  const globalWithDelay = global as typeof global & {
    enableNetworkDelay: (duration: number) => void;
    disableNetworkDelay: () => void;
  };

  afterEach(() => {
    // Ensure network delay is disabled after each test
    if (globalWithDelay.disableNetworkDelay) {
      globalWithDelay.disableNetworkDelay();
    }
    jest.clearAllMocks();
  });

  it('renders all buttons', () => {
    render(
      <BottomActionMenu
        onNewGame={() => {}}
        onResign={() => {}}
        onHint={() => {}}
      />
    );

    expect(screen.getByText('New Game')).toBeInTheDocument();
    expect(screen.getByText('Get Hint')).toBeInTheDocument();
    expect(screen.getByText('Resign')).toBeInTheDocument();
  });

  it('calls the correct handlers on click', () => {
    const handleNewGame = jest.fn();
    const handleResign = jest.fn();
    const handleHint = jest.fn();

    render(
      <BottomActionMenu
        onNewGame={handleNewGame}
        onResign={handleResign}
        onHint={handleHint}
      />
    );

    fireEvent.click(screen.getByText('New Game'));
    expect(handleNewGame).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Get Hint'));
    expect(handleHint).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Resign'));
    expect(handleResign).toHaveBeenCalledTimes(1);
  });

  it('uses network delay helpers for hint action', async () => {
    const mockHintData = { hint: 'Try moving your queen.' };
    // Ensure the mock for authenticatedFetch is set up for this test
    (authenticatedFetch as jest.Mock).mockImplementation(async () => {
      // The actual delay is handled by the global mock in jest.setup.ts
      return { ok: true, json: async () => mockHintData };
    });

    const handleHint = jest.fn(async () => {
      try {
        const response = await authenticatedFetch('/api/hint', { method: 'POST' });
        if (response.ok) {
          return await response.json();
        }
        return null;
      } catch (error) {
        return null;
      }
    });

    render(
      <BottomActionMenu
        onNewGame={() => {}}
        onResign={() => {}}
        onHint={handleHint}
      />
    );

    const delayDuration = 1000;
    if (globalWithDelay.enableNetworkDelay) {
      globalWithDelay.enableNetworkDelay(delayDuration);
    }

    const hintButton = screen.getByText('Get Hint');
    fireEvent.click(hintButton);

    expect(handleHint).toHaveBeenCalledTimes(1);
    // Expect authenticatedFetch to be called as part of handleHint
    expect(authenticatedFetch).toHaveBeenCalledTimes(1);

    // At this point, due to the delay, the hint data should not be available yet.
    // We can't directly test for a loading state in BottomActionMenu as it doesn't have one.
    // Instead, we verify that the handleHint function (and thus authenticatedFetch) was called,
    // and then we can wait for its expected delayed completion.

    // To confirm the delay, we check that the promise from handleHint is not yet resolved.
    const hintPromise = handleHint.mock.results[0].value;
    let resolved = false;
    hintPromise.then(() => { resolved = true; });

    // Advance timers by less than the delayDuration
    jest.advanceTimersByTime(delayDuration / 2);
    await Promise.resolve(); // Allow microtasks to process
    expect(resolved).toBe(false); // The promise should not have resolved yet

    // Now, advance timers past the delayDuration
    jest.advanceTimersByTime(delayDuration);
    await waitFor(() => expect(resolved).toBe(true));

    const result = await hintPromise;
    expect(result).toEqual(mockHintData);

    if (globalWithDelay.disableNetworkDelay) {
      globalWithDelay.disableNetworkDelay();
    }
  });
});
