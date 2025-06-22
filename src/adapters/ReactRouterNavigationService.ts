
import { NavigateFunction } from 'react-router-dom';
import { BaseNavigationService } from '../services/navigation/NavigationService';

export class ReactRouterNavigationService extends BaseNavigationService {
  constructor(private navigateFunction: NavigateFunction, private currentPath: string) {
    super();
  }

  navigate(path: string, options?: { replace?: boolean }): void {
    this.navigateFunction(path, options);
  }

  goBack(): void {
    this.navigateFunction(-1 as any); // React Router's navigate accepts -1 for back navigation
  }

  getCurrentPath(): string {
    return this.currentPath;
  }
}
