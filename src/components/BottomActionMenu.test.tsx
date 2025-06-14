
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BottomActionMenu from './BottomActionMenu';

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

describe('BottomActionMenu', () => {
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
});
