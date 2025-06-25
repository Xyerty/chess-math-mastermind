let networkDelayEnabled = false;
let networkDelayDuration = 0;

const enableNetworkDelay = (duration: number) => {
  networkDelayEnabled = true;
  networkDelayDuration = duration;
};

const disableNetworkDelay = () => {
  networkDelayEnabled = false;
  networkDelayDuration = 0;
};

jest.mock('src/lib/authenticatedFetch', () => {
  const originalModule = jest.requireActual('src/lib/authenticatedFetch');
  return {
    ...originalModule,
    authenticatedFetch: jest.fn(async (...args: unknown[]) => {
      if (networkDelayEnabled) {
        await new Promise(resolve => setTimeout(resolve, networkDelayDuration));
      }
      return originalModule.authenticatedFetch(...args);
    }),
  };
});

import '@testing-library/jest-dom';

// Expose helper functions to the global scope
(global as unknown as { enableNetworkDelay: (duration: number) => void }).enableNetworkDelay = enableNetworkDelay;
(global as unknown as { disableNetworkDelay: () => void }).disableNetworkDelay = disableNetworkDelay;
