/**
 * Simulation Engine for Scenario Lab.
 * Recalculates projected operational metrics dynamically based on compound stress factors.
 * Strictly labeled as client-side illustrative prototype results.
 */

export const DEFAULT_SCENARIO_CONFIG = {
  demandSurgePercent: 35,     // 0% to 100%
  inboundDelayDays: 3,        // 0 to 14 days
  closedRouteId: 'ROUTE-02',  // 'none' or route ID (Corridor Cobalt)
  capacityReductionPercent: 25, // 0% to 70%
  weatherSeverityLevel: 3,    // 1 to 5
  simulatedNetworkOffline: false // boolean
};

export const simulationService = {
  calculateScenarioImpact: (config = DEFAULT_SCENARIO_CONFIG, baselineInventory = [], baselineRoutes = []) => {
    const demandMultiplier = 1 + (config.demandSurgePercent / 100);
    const capacityMultiplier = 1 - (config.capacityReductionPercent / 100);
    const delayDays = Number(config.inboundDelayDays);
    const weatherFactor = config.weatherSeverityLevel;

    // Recalculate stock coverage and risk for monitored depots
    const affectedDepots = [
      { name: 'Sector-4 Forward Depot', baseCoverage: 3.7, baseDailyDraw: 3800, currentStock: 14200, unit: 'Litres (Fuel)' },
      { name: 'Borealis Mountain Outpost', baseCoverage: 3.5, baseDailyDraw: 520, currentStock: 1840, unit: 'kg (Rations)' },
      { name: 'Vanguard Perimeter Camp', baseCoverage: 4.9, baseDailyDraw: 1650, currentStock: 8200, unit: 'Litres (Water)' },
    ];

    const recalculatedDepots = affectedDepots.map(depot => {
      // Increased demand shrinks coverage
      const scenarioDailyDraw = Math.round(depot.baseDailyDraw * demandMultiplier * (1 + weatherFactor * 0.04));
      const scenarioCoverage = Number((depot.currentStock / scenarioDailyDraw).toFixed(1));
      const coverageDelta = Number((scenarioCoverage - depot.baseCoverage).toFixed(1));

      // Calculate risk score (0 - 100%)
      let riskScore = 40;
      if (scenarioCoverage < 2.0) riskScore = 98;
      else if (scenarioCoverage < 3.5) riskScore = 88;
      else if (scenarioCoverage < 5.0) riskScore = 65;
      else riskScore = 30;

      // Compound risk with delay & route closure
      if (config.closedRouteId !== 'none') riskScore = Math.min(99, riskScore + 10);
      if (delayDays > 3) riskScore = Math.min(99, riskScore + (delayDays * 2));

      return {
        ...depot,
        scenarioDailyDraw,
        scenarioCoverage,
        coverageDelta,
        scenarioRiskScore: riskScore,
        scenarioStockoutDays: Math.max(0.5, scenarioCoverage - (delayDays * 0.4)).toFixed(1)
      };
    });

    // Baseline overall coverage average
    const baselineAvgCoverage = Number(
      (affectedDepots.reduce((acc, d) => acc + d.baseCoverage, 0) / affectedDepots.length).toFixed(1)
    );

    // Scenario overall coverage average
    const scenarioAvgCoverage = Number(
      (recalculatedDepots.reduce((acc, d) => acc + d.scenarioCoverage, 0) / recalculatedDepots.length).toFixed(1)
    );

    // Critical shortage count
    const baselineCriticalCount = 2;
    const scenarioCriticalCount = recalculatedDepots.filter(d => d.scenarioCoverage < 3.5 || d.scenarioRiskScore > 85).length + (delayDays >= 4 ? 1 : 0);

    // Delivery delay delta
    const baselineDelayHours = 0;
    const scenarioDelayHours = Math.round((delayDays * 24) + (config.closedRouteId !== 'none' ? 14 : 0) + (weatherFactor * 3.5));

    // Route availability count
    const totalRoutes = 5;
    const baselineAvailableRoutes = 3; // 1 was disrupted, 1 closed in baseline
    let scenarioAvailableRoutes = baselineAvailableRoutes;
    if (config.closedRouteId !== 'none' && config.closedRouteId !== 'ROUTE-03') {
      scenarioAvailableRoutes = Math.max(1, scenarioAvailableRoutes - 1);
    }
    if (weatherFactor >= 4) {
      scenarioAvailableRoutes = Math.max(1, scenarioAvailableRoutes - 1);
    }

    // Transport capacity available
    const baselineTransportCapacityTons = 1440;
    const scenarioTransportCapacityTons = Math.round(baselineTransportCapacityTons * capacityMultiplier);

    // Recommended replenishment changes
    const recommendedAdjustments = [
      {
        priority: 'Immediate Escalation',
        action: `Increase JP-8 Fuel dispatch to Sector-4 by +${Math.round(25000 * (demandMultiplier - 1) + 8000).toLocaleString()} Litres`,
        reason: `Demand surge of +${config.demandSurgePercent}% accelerates stockout by ${Math.abs(recalculatedDepots[0].coverageDelta)} days.`
      },
      {
        priority: 'Transport Reroute',
        action: config.closedRouteId === 'ROUTE-02' 
          ? 'Divert all desert highway convoys to Corridor Diamond Autonomous Rail' 
          : 'Activate auxiliary VTOL air corridor for high-risk segments',
        reason: config.closedRouteId !== 'none' 
          ? `Primary route closed in scenario. Secondary corridor buffer required.`
          : 'High weather hazard level requires air-gap contingency.'
      },
      {
        priority: 'Safety Stock Adjustment',
        action: `Elevate strategic safety stock buffer by +${Math.round(config.demandSurgePercent * 0.8)}% across all forward outposts`,
        reason: `Mitigates compound risk of incoming shipment delay (+${delayDays}d) and transport bottleneck.`
      }
    ];

    return {
      isPrototypeCalculation: true,
      timestamp: new Date().toISOString(),
      config,
      comparison: {
        stockCoverage: {
          baseline: `${baselineAvgCoverage} Days`,
          scenario: `${scenarioAvgCoverage} Days`,
          delta: `${(scenarioAvgCoverage - baselineAvgCoverage).toFixed(1)} Days`,
          status: scenarioAvgCoverage < 3 ? 'critical' : scenarioAvgCoverage < 4.5 ? 'warning' : 'nominal'
        },
        shortageRisk: {
          baseline: '2 Active Critical Risks',
          scenario: `${scenarioCriticalCount} Critical Shortage Alerts`,
          delta: `+${Math.max(0, scenarioCriticalCount - baselineCriticalCount)} Escalated`,
          status: scenarioCriticalCount > 2 ? 'critical' : 'warning'
        },
        deliveryDelay: {
          baseline: 'On Schedule (0.0h)',
          scenario: `+${scenarioDelayHours} Hours Average Delay`,
          delta: `+${(scenarioDelayHours / 24).toFixed(1)} Days`,
          status: scenarioDelayHours > 24 ? 'critical' : 'warning'
        },
        routeAlternatives: {
          baseline: `${baselineAvailableRoutes} / ${totalRoutes} Active Corridors`,
          scenario: `${scenarioAvailableRoutes} / ${totalRoutes} Available Corridors`,
          delta: `${scenarioAvailableRoutes - baselineAvailableRoutes} Corridors`,
          status: scenarioAvailableRoutes <= 2 ? 'critical' : 'warning'
        },
        transportThroughput: {
          baseline: `${baselineTransportCapacityTons} T/day`,
          scenario: `${scenarioTransportCapacityTons} T/day`,
          delta: `-${Math.round((1 - capacityMultiplier) * 100)}% Throughput`,
          status: capacityMultiplier < 0.75 ? 'critical' : 'warning'
        }
      },
      depots: recalculatedDepots,
      recommendedAdjustments
    };
  }
};
