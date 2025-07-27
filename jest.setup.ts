let networkDelayEnabled = false;
let networkDelayDuration = 0;

const enableNetworkDelay = (duration) => {
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
    authenticatedFetch: jest.fn(async (..._args) => {
      if (networkDelayEnabled) {
        await new Promise(resolve => setTimeout(resolve, networkDelayDuration));
      }
      // Return a successful response for all calls in tests
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    }),
  };
});

import '@testing-library/jest-dom';

// Expose helper functions to the global scope
global.enableNetworkDelay = enableNetworkDelay;
global.disableNetworkDelay = disableNetworkDelay;
