import { ROUTES, LOCATIONS } from '../data/prototypeData';
import { apiClient } from './apiClient';

const ROUTES_STORAGE_KEY = 'kartavya_routes';

export const routeService = {
  getRoutes: async () => {
    const res = await apiClient.get('/routes');
    if (!res || res.isFallback) {
      const stored = localStorage.getItem(ROUTES_STORAGE_KEY);
      const routes = stored ? JSON.parse(stored) : ROUTES;
      return {
        data: routes,
        locations: LOCATIONS,
        isPrototypeData: true,
        disclaimer: 'Fictional illustrative route network for command simulation. Not verified real-world routes.'
      };
    }
    return res;
  },

  getRouteById: async (id) => {
    const res = await apiClient.get(`/routes/${id}`);
    if (!res || res.isFallback) {
      const stored = localStorage.getItem(ROUTES_STORAGE_KEY);
      const routes = stored ? JSON.parse(stored) : ROUTES;
      const route = routes.find(r => r.id === id);
      if (!route) throw new Error(`Route ${id} not found.`);
      return { data: route, isPrototypeData: true };
    }
    return res;
  },

  updateRouteStatus: async (id, status, simulatedDisruption) => {
    const stored = localStorage.getItem(ROUTES_STORAGE_KEY);
    const routes = stored ? JSON.parse(stored) : [...ROUTES];
    const index = routes.findIndex(r => r.id === id);
    if (index !== -1) {
      routes[index] = {
        ...routes[index],
        status,
        simulatedDisruption: simulatedDisruption !== undefined ? simulatedDisruption : routes[index].simulatedDisruption
      };
      localStorage.setItem(ROUTES_STORAGE_KEY, JSON.stringify(routes));
      return { success: true, route: routes[index] };
    }
    throw new Error(`Route ${id} not found.`);
  },

  resetRoutes: () => {
    localStorage.setItem(ROUTES_STORAGE_KEY, JSON.stringify(ROUTES));
  }
};
