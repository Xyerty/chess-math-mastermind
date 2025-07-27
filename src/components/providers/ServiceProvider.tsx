
import React, { ReactNode, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ServiceContext, ServiceContainer } from '../../hooks/useServices';
import { ClerkAuthService } from '../../services/auth/ClerkAuthService';
import { DefaultGameStateService } from '../../services/game/GameStateService';
import { ReactRouterNavigationService } from '../../adapters/ReactRouterNavigationService';
import { BaseApiService } from '../../services/api/ApiService';

// Simple fetch-based API service implementation
class FetchApiService extends BaseApiService {
  async get<T>(endpoint: string, params?: Record<string, unknown>) {
    const url = this.buildUrl(endpoint, params);
    const response = await fetch(url);
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, body?: unknown) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, body?: unknown) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE'
    });
    return this.handleResponse<T>(response);
  }
}

interface ServiceProviderProps {
  children: ReactNode;
}

export const ServiceProvider: React.FC<ServiceProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const services: ServiceContainer = useMemo(() => ({
    authService: new ClerkAuthService(),
    gameStateService: new DefaultGameStateService(),
    navigationService: new ReactRouterNavigationService(navigate, location.pathname),
    apiService: new FetchApiService('/api') // Base API URL
  }), [navigate, location.pathname]);

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
};
