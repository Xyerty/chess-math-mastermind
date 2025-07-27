
import { useContext, createContext } from 'react';
import { AuthService } from '../services/auth/AuthService';
import { GameStateService } from '../services/game/GameStateService';
import { NavigationService } from '../services/navigation/NavigationService';
import { ApiService } from '../services/api/ApiService';

export interface ServiceContainer {
  authService: AuthService;
  gameStateService: GameStateService;
  navigationService: NavigationService;
  apiService: ApiService;
}

const ServiceContext = createContext<ServiceContainer | null>(null);

export const useServices = (): ServiceContainer => {
  const services = useContext(ServiceContext);
  if (!services) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return services;
};

export const useAuthService = () => useServices().authService;
export const useGameStateService = () => useServices().gameStateService;
export const useNavigationService = () => useServices().navigationService;
export const useApiService = () => useServices().apiService;

export { ServiceContext };
