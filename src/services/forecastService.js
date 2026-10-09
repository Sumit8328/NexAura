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

      // Location modifier
      let locMultiplier = 1.0;
      if (location.includes('Borealis')) locMultiplier = 1.25; // cold weather penalty
      else if (location.includes('Sector-4')) locMultiplier = 1.15; // combat sortie tempo
      else if (location.includes('Vanguard')) locMultiplier = 1.10; // austere forward camp
      else if (location.includes('Zenith')) locMultiplier = 0.90; // central supply buffer
      else if (location.includes('Aurora')) locMultiplier = 0.95; // staging facility

      const effectiveFactor = factor * locMultiplier;

      const adjustedData = baseSeries.map(point => ({
        ...point,
        historical: point.historical ? Math.round(point.historical * effectiveFactor) : null,
        projected: point.projected ? Math.round(point.projected * effectiveFactor) : null,
        projectedMin: point.projectedMin ? Math.round(point.projectedMin * effectiveFactor) : null,
        projectedMax: point.projectedMax ? Math.round(point.projectedMax * effectiveFactor) : null,
        currentStockLevel: Math.round(point.currentStockLevel * effectiveFactor),
        safetyThreshold: Math.round(point.safetyThreshold * effectiveFactor)
      }));

      // Calculate dynamic metrics
      const futurePoints = adjustedData.filter(p => p.projected !== null);
      const projectedValues = futurePoints.map(p => p.projected);
      const peakDemand = projectedValues.length > 0 ? Math.max(...projectedValues) : 0;
      const avgDemand = projectedValues.length > 0 
        ? Math.round(projectedValues.reduce((a, b) => a + b, 0) / projectedValues.length) 
        : 0;

      // Find safety buffer breach point
      const breachPoint = futurePoints.find(p => p.currentStockLevel < p.safetyThreshold);
      const minStockPoint = futurePoints.reduce(
        (min, p) => (p.currentStockLevel < min.currentStockLevel ? p : min), 
        futurePoints[0] || { currentStockLevel: 0, date: '—' }
      );

      // Confidence score naturally decays with longer horizons
      const confidenceScore = horizon === 7 ? 95.4 : horizon === 15 ? 91.2 : 83.6;

      // Dynamic contextual factors tailored to selected category and location
      const factors = [
        { 
          name: `${location.split(' ')[0]} Operational Tempo Surge`, 
          impact: locMultiplier > 1 ? `+${Math.round((locMultiplier - 1) * 100 + 12)}% Draw` : 'Baseline Draw', 
          direction: locMultiplier > 1 ? 'up' : 'neutral', 
          note: `High activity cycle registered for forward logistics echelon at ${location}.` 
        },
        { 
          name: `${category.split(' ')[0]} Burn Coefficient`, 
          impact: `+${horizon === 30 ? '28%' : horizon === 15 ? '18%' : '9%'} Cumulative Variance`, 
          direction: 'warning', 
          note: `Modeled rate includes 95% confidence uncertainty envelope over ${horizon} operating days.` 
        },
        { 
          name: 'Corridor Disruption Risk', 
          impact: location.includes('Borealis') ? 'Pass Closure Risk (Severe)' : 'Active Corridor Monitoring', 
          direction: location.includes('Borealis') ? 'up' : 'neutral', 
          note: location.includes('Borealis') 
            ? 'Alpine blizzard warnings threaten Route Echo pass access for ground autonomous convoys.' 
            : 'Route Diamond rail transport corridor operates within acceptable variance parameters.' 
        },
        { 
          name: 'Scheduled Resupply Infusion', 
          impact: `+${Math.round(22000 * effectiveFactor).toLocaleString()} ${unit}`, 
          direction: 'positive', 
          note: `Strategic convoy KTV-9042 delivery scheduled on Day 4 to replenish reserve buffer.` 
        }
      ];

      return {
        data: adjustedData,
        unit,
        horizon,
        category,
        location,
        lastCalculated: '2026-10-09T08:00:00Z',
        freshnessMinutes: 14,
        confidenceScore,
        peakDemand,
        avgDemand,
        breachDate: breachPoint ? breachPoint.date : 'None (Above Buffer)',
        minReserve: minStockPoint?.currentStockLevel || 0,
        minReserveDate: minStockPoint?.date || '—',
        methodology: 'Prototype Hybrid Autoregressive Rolling Mean with Synthetic Operational Priors (Client-Side Simulation)',
        isPrototypeEstimate: true,
        factors
      };
    }
    return res;
  }
};

