
export interface NavigationService {
  navigate(path: string, options?: { replace?: boolean }): void;
  goBack(): void;
  getCurrentPath(): string;
  createPath(route: string, params?: Record<string, string>): string;
}

export interface RouteConfig {
  path: string;
  name: string;
  component?: string;
  protected?: boolean;
  children?: RouteConfig[];
}

export const APP_ROUTES: RouteConfig[] = [
  {
    path: '/',
    name: 'home',
    component: 'MainMenu'
  },
  {
    path: '/game',
    name: 'game',
    component: 'Game',
    protected: true
  },
  {
    path: '/settings',
    name: 'settings',
    component: 'Settings',
    protected: true
  },
  {
    path: '/statistics',
    name: 'statistics',
    component: 'Statistics',
    protected: true
  },
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: 'Leaderboard',
    protected: true
  },
  {
    path: '/achievements',
    name: 'achievements',
    component: 'Achievements',
    protected: true
  },
  {
    path: '/tutorial',
    name: 'tutorial',
    component: 'Tutorial'
  },
  {
    path: '/auth',
    name: 'auth',
    component: 'Auth'
  }
];

export abstract class BaseNavigationService implements NavigationService {
  abstract navigate(path: string, options?: { replace?: boolean }): void;
  abstract goBack(): void;
  abstract getCurrentPath(): string;

  createPath(route: string, params?: Record<string, string>): string {
    let path = route;
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        path = path.replace(`:${key}`, value);
      });
    }
    return path;
  }

  getRouteByName(name: string): RouteConfig | undefined {
    const findRoute = (routes: RouteConfig[]): RouteConfig | undefined => {
      for (const route of routes) {
        if (route.name === name) return route;
        if (route.children) {
          const found = findRoute(route.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    return findRoute(APP_ROUTES);
  }

  isProtectedRoute(path: string): boolean {
    const route = APP_ROUTES.find(r => r.path === path);
    return route?.protected || false;
  }
}
