
import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';
import { NETWORKS } from './infura';

// Initialize Magic instance with your publishable key
// Using Sepolia testnet for development - switch to mainnet for production
export const magic = new Magic('pk_live_1337BF61BAC7CF09', {
  network: {
    rpcUrl: NETWORKS.sepolia.rpcUrl,
    chainId: NETWORKS.sepolia.chainId,
  },
  extensions: [new OAuthExtension()],
});

export const isLoggedIn = async (): Promise<boolean> => {
  try {
    return await magic.user.isLoggedIn();
  } catch (error) {
    console.error('Error checking Magic login status:', error);
    return false;
  }
};

export const getUserInfo = async () => {
  try {
    const userMetadata = await magic.user.getInfo();
    return userMetadata;
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
};
