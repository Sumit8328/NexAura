import { FORECAST_SERIES_DAYS } from '../data/prototypeData';
import { apiClient } from './apiClient';

export const forecastService = {
  getForecast: async ({ horizon = 7, category = 'Fuel (JP-8 Synthetic)', location = 'Sector-4 Forward Depot' } = {}) => {
    const res = await apiClient.get('/forecast', { horizon, category, location });
    if (!res || res.isFallback) {
      // Prototype synthetic computation based on parameters
      const baseSeries = FORECAST_SERIES_DAYS[horizon] || FORECAST_SERIES_DAYS[7];

      // Multipliers based on category
      let factor = 1.0;
      let unit = 'Litres';
      if (category.includes('Rations')) { factor = 0.14; unit = 'Kilograms'; }
      else if (category.includes('Medical')) { factor = 0.006; unit = 'Kits'; }
      else if (category.includes('Water')) { factor = 0.45; unit = 'Litres'; }
      else if (category.includes('Batteries')) { factor = 0.05; unit = 'Units'; }
      else if (category.includes('Spares')) { factor = 0.001; unit = 'Units'; }

      const adjustedData = baseSeries.map(point => ({
        ...point,
        historical: point.historical ? Math.round(point.historical * factor) : null,
        projected: point.projected ? Math.round(point.projected * factor) : null,
        projectedMin: point.projectedMin ? Math.round(point.projectedMin * factor) : null,
        projectedMax: point.projectedMax ? Math.round(point.projectedMax * factor) : null,
        currentStockLevel: Math.round(point.currentStockLevel * factor),
        safetyThreshold: Math.round(point.safetyThreshold * factor)
      }));

      return {
        data: adjustedData,
        unit,
        horizon,
        category,
        location,
        lastCalculated: '2026-10-09T08:00:00Z',
        freshnessMinutes: 14,
        confidenceScore: 91.4,
        methodology: 'Prototype Hybrid Autoregressive Rolling Mean with Synthetic Operational Priors (Client-Side Simulation)',
        isPrototypeEstimate: true,
        factors: [
          { name: 'Operational Tempo Surge', impact: '+24%', direction: 'up', note: 'Higher sortie rate scheduled for 72hr combat air patrol' },
          { name: 'Extreme Thermal Stress', impact: '+11%', direction: 'up', note: 'Ambient temps +38°C increasing cooling and generator fuel burn' },
          { name: 'Corridor Disruption Variance', impact: '+18% Lead Time Risk', direction: 'warning', note: 'Active dust storms delaying truck convoys on Route Cobalt' },
          { name: 'Scheduled Resupply Inbound', impact: '+35,000 L', direction: 'positive', note: 'AST-9042 inbound rail tanker ETA in 4.2 hours' }
        ]
      };
    }
    return res;
  }
};
