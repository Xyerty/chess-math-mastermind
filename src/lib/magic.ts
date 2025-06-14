
import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';

// Initialize Magic instance with your publishable key
export const magic = new Magic('pk_live_1337BF61BAC7CF09', {
  network: 'ethereum',
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
    const userMetadata = await magic.user.getMetadata();
    return userMetadata;
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
};
