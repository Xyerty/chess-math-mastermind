
import { GetToken } from '@clerk/clerk-react';

type FetchOptions = RequestInit;

/**
 * A wrapper around the native fetch API that automatically injects a
 * Supabase-compatible JWT token from Clerk into the Authorization header.
 *
 * @param getToken - The `getToken` function from Clerk's `useAuth` hook.
 * @param url - The URL to fetch.
 * @param options - The options for the fetch request.
 * @returns A Promise that resolves to the Response.
 */
export const authenticatedFetch = async (
  getToken: GetToken,
  url: string,
  options: FetchOptions = {}
): Promise<Response> => {
  const token = await getToken({ template: 'supabase' });

  if (!token) {
    throw new Error('Authentication token not found. The user might be signed out.');
  }

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${token}`);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetails;
    try {
      errorDetails = await response.json();
    } catch (e) {
      errorDetails = { error: 'Request failed with status: ' + response.status, details: await response.text() };
    }
    
    console.error('Authenticated fetch error:', errorDetails);
    throw new Error(errorDetails.error || errorDetails.message || `HTTP error! status: ${response.status}`);
  }

  return response;
};
