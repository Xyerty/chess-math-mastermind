
export interface AuthUser {
  id: string;
  email: string | null;
  username: string | null;
  fullName: string | null;
  imageUrl: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken?: string;
  expiresAt?: number;
}

export interface AuthService {
  getCurrentUser(): AuthUser | null;
  getCurrentSession(): AuthSession | null;
  isAuthenticated(): boolean;
  signIn(email: string, password: string): Promise<{ user?: AuthUser; error?: string }>;
  signUp(email: string, password: string): Promise<{ user?: AuthUser; error?: string }>;
  signOut(): Promise<void>;
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void;
}

export abstract class BaseAuthService implements AuthService {
  abstract getCurrentUser(): AuthUser | null;
  abstract getCurrentSession(): AuthSession | null;
  abstract isAuthenticated(): boolean;
  abstract signIn(email: string, password: string): Promise<{ user?: AuthUser; error?: string }>;
  abstract signUp(email: string, password: string): Promise<{ user?: AuthUser; error?: string }>;
  abstract signOut(): Promise<void>;
  abstract onAuthStateChange(callback: (user: AuthUser | null) => void): () => void;
}
