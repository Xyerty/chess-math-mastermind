
import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';

// Initialize Magic instance with your publishable key
export const magic = new Magic('pk_live_1337BF61BAC7CF09', {
  network: {
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY', // You'll need to replace with actual Infura key
    chainId: 1, // Ethereum mainnet
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
