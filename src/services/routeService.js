import { ROUTES, LOCATIONS } from '../data/prototypeData';
import { apiClient } from './apiClient';

const ROUTES_STORAGE_KEY = 'kartavya_routes';
const LEGACY_ROUTES_KEY = 'astralogistics_routes';

const getLocalRoutes = () => {
  const stored = localStorage.getItem(ROUTES_STORAGE_KEY) || localStorage.getItem(LEGACY_ROUTES_KEY);
  return stored ? JSON.parse(stored) : ROUTES;
};

export const routeService = {
  getRoutes: async () => {
    const res = await apiClient.get('/routes');
    if (!res || res.isFallback) {
      const routes = getLocalRoutes();
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
      const routes = getLocalRoutes();
      const route = routes.find(r => r.id === id);
      if (!route) throw new Error(`Route ${id} not found.`);
      return { data: route, isPrototypeData: true };
    }
    return res;
  },

  updateRouteStatus: async (id, status, simulatedDisruption) => {
    const routes = [...getLocalRoutes()];
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
