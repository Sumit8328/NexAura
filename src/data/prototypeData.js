/**
 * KARTAVYA Prototype Dataset
 * High-fidelity fictional forward logistics data for tactical and humanitarian command operations.
 * Fictional locations and simulated parameters clearly segregated.
 */

export const LOCATIONS = [
  { id: 'loc-zenith', name: 'Zenith Central Hub', code: 'ZEN-00', type: 'Primary Strategic Hub', coords: [35.6892, -105.9378], status: 'Fully Operational', elevation: '2,130m' },
  { id: 'loc-sector4', name: 'Sector-4 Forward Depot', code: 'DEP-04', type: 'Forward Operating Depot', coords: [34.0522, -111.0937], status: 'High Threat Level', elevation: '1,450m' },
  { id: 'loc-aurora', name: 'Aurora Station Alpha', code: 'AUR-01', type: 'Sub-Hub / Airhead', coords: [36.1699, -115.1398], status: 'Severe Weather Warning', elevation: '610m' },
  { id: 'loc-borealis', name: 'Borealis Mountain Outpost', code: 'BOR-03', type: 'Remote Outpost', coords: [37.7749, -119.4194], status: 'Isolated Transit', elevation: '3,200m' },
  { id: 'loc-helios', name: 'Helios Coastal Base', code: 'HEL-02', type: 'Maritime Tactical Base', coords: [32.7157, -117.1611], status: 'Operational', elevation: '15m' },
  { id: 'loc-vanguard', name: 'Vanguard Perimeter Camp', code: 'VAN-05', type: 'Perimeter Checkpoint', coords: [33.4484, -112.0740], status: 'Supply Constrained', elevation: '330m' },
];

export const CATEGORIES = [
  { id: 'fuel', name: 'Fuel (JP-8 Synthetic)', unit: 'Litres' },
  { id: 'rations', name: 'Field Rations (MRE-X)', unit: 'Kilograms' },
  { id: 'medical', name: 'Trauma Medical Kits', unit: 'Kits' },
  { id: 'water', name: 'Potable Water (Purified)', unit: 'Litres' },
  { id: 'batteries', name: 'Tactical Energy Cells', unit: 'Units' },
  { id: 'spares', name: 'Armored Spares & Optics', unit: 'Units' },
];

export const INITIAL_INVENTORY = [
  {
    id: 'INV-101',
    sku: 'POL-JP8-09',
    name: 'JP-8 Synthetic Heavy Fuel',
    category: 'Fuel (JP-8 Synthetic)',
    location: 'Sector-4 Forward Depot',
    locationId: 'loc-sector4',
    currentStock: 14200,
    unit: 'Litres',
    avgDailyConsumption: 3800,
    stockCoverageDays: 3.7,
    safetyStock: 18000,
    condition: 'Optimal',
    status: 'Critical',
    reorderLevel: 22000,
    maxCapacity: 65000,
    lastRestocked: '2026-10-04T08:30:00Z',
    notes: 'Consumption spiked 40% due to emergency power generators and medevac rotations.'
  },
  {
    id: 'INV-102',
    sku: 'MED-TRM-04',
    name: 'Advanced Trauma Resupply Kits (Tier-3)',
    category: 'Trauma Medical Kits',
    location: 'Sector-4 Forward Depot',
    locationId: 'loc-sector4',
    currentStock: 110,
    unit: 'Kits',
    avgDailyConsumption: 24,
    stockCoverageDays: 4.5,
    safetyStock: 150,
    condition: 'Sterile Validated',
    status: 'Low',
    reorderLevel: 200,
    maxCapacity: 600,
    lastRestocked: '2026-09-28T14:15:00Z',
    notes: 'Sterile seal check completed. Replenishment queued from Aurora Hub.'
  },
  {
    id: 'INV-103',
    sku: 'RAT-MRE-88',
    name: 'High-Calorie Compact Field Rations',
    category: 'Field Rations (MRE-X)',
    location: 'Borealis Mountain Outpost',
    locationId: 'loc-borealis',
    currentStock: 1840,
    unit: 'Kilograms',
    avgDailyConsumption: 520,
    stockCoverageDays: 3.5,
    safetyStock: 2500,
    condition: 'Inspected',
    status: 'Critical',
    reorderLevel: 4000,
    maxCapacity: 12000,
    lastRestocked: '2026-10-01T11:00:00Z',
    notes: 'Pass blocked by snowfall. Autonomous airdrop recommended if pass remains closed.'
  },
  {
    id: 'INV-104',
    sku: 'H2O-PUR-01',
    name: 'Ionized Desalinated Potable Water',
    category: 'Potable Water (Purified)',
    location: 'Vanguard Perimeter Camp',
    locationId: 'loc-vanguard',
    currentStock: 8200,
    unit: 'Litres',
    avgDailyConsumption: 1650,
    stockCoverageDays: 4.9,
    safetyStock: 9000,
    condition: 'Optimal',
    status: 'Low',
    reorderLevel: 14000,
    maxCapacity: 40000,
    lastRestocked: '2026-10-06T16:00:00Z',
    notes: 'Local filtration unit B down for maintenance. Daily draw heightened.'
  },
  {
    id: 'INV-105',
    sku: 'BAT-TNC-12',
    name: 'Solid-State Tactical Power Cells',
    category: 'Tactical Energy Cells',
    location: 'Zenith Central Hub',
    locationId: 'loc-zenith',
    currentStock: 3450,
    unit: 'Units',
    avgDailyConsumption: 180,
    stockCoverageDays: 19.1,
    safetyStock: 1200,
    condition: 'Optimal',
    status: 'Optimal',
    reorderLevel: 2000,
    maxCapacity: 8000,
    lastRestocked: '2026-10-07T09:00:00Z',
    notes: 'Central stockpile stable. Pre-allocated for forward echelon.'
  },
  {
    id: 'INV-106',
    sku: 'POL-JP8-09',
    name: 'JP-8 Synthetic Heavy Fuel',
    category: 'Fuel (JP-8 Synthetic)',
    location: 'Aurora Station Alpha',
    locationId: 'loc-aurora',
    currentStock: 48000,
    unit: 'Litres',
    avgDailyConsumption: 3200,
    stockCoverageDays: 15.0,
    safetyStock: 25000,
    condition: 'Optimal',
    status: 'Optimal',
    reorderLevel: 35000,
    maxCapacity: 110000,
    lastRestocked: '2026-10-08T17:45:00Z',
    notes: 'Underground reinforced storage tanks at 62% aggregate capacity.'
  },
  {
    id: 'INV-107',
    sku: 'SPR-VHC-77',
    name: 'Heavy Transport Suspension & Tread Units',
    category: 'Armored Spares & Optics',
    location: 'Sector-4 Forward Depot',
    locationId: 'loc-sector4',
    currentStock: 28,
    unit: 'Units',
    avgDailyConsumption: 4,
    stockCoverageDays: 7.0,
    safetyStock: 30,
    condition: 'Inspected',
    status: 'Low',
    reorderLevel: 45,
    maxCapacity: 120,
    lastRestocked: '2026-09-25T13:20:00Z',
    notes: 'Rough terrain operations causing accelerated tread wear on Convoy Epsilon.'
  },
  {
    id: 'INV-108',
    sku: 'RAT-MRE-88',
    name: 'High-Calorie Compact Field Rations',
    category: 'Field Rations (MRE-X)',
    location: 'Helios Coastal Base',
    locationId: 'loc-helios',
    currentStock: 18500,
    unit: 'Kilograms',
    avgDailyConsumption: 650,
    stockCoverageDays: 28.4,
    safetyStock: 5000,
    condition: 'Optimal',
    status: 'Optimal',
    reorderLevel: 8000,
    maxCapacity: 35000,
    lastRestocked: '2026-10-05T10:15:00Z',
    notes: 'Maritime supply corridor operating smoothly.'
  },
  {
    id: 'INV-109',
    sku: 'MED-TRM-04',
    name: 'Advanced Trauma Resupply Kits (Tier-3)',
    category: 'Trauma Medical Kits',
    location: 'Borealis Mountain Outpost',
    locationId: 'loc-borealis',
    currentStock: 42,
    unit: 'Kits',
    avgDailyConsumption: 9,
    stockCoverageDays: 4.6,
    safetyStock: 40,
    condition: 'Optimal',
    status: 'Low',
    reorderLevel: 60,
    maxCapacity: 150,
    lastRestocked: '2026-09-30T12:00:00Z',
    notes: 'Extreme cold storage protocols active. Thermocoolers operating normal.'
  },
  {
    id: 'INV-110',
    sku: 'POL-JP8-09',
    name: 'JP-8 Synthetic Heavy Fuel',
    category: 'Fuel (JP-8 Synthetic)',
    location: 'Zenith Central Hub',
    locationId: 'loc-zenith',
    currentStock: 185000,
    unit: 'Litres',
    avgDailyConsumption: 4500,
    stockCoverageDays: 41.1,
    safetyStock: 60000,
    condition: 'Optimal',
    status: 'Excess',
    reorderLevel: 90000,
    maxCapacity: 250000,
    lastRestocked: '2026-10-09T03:00:00Z',
    notes: 'Strategic reserve buffer healthy. Prepared to stage forward push.'
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: 'TX-9021',
    timestamp: '2026-10-09T05:22:00Z',
    type: 'Issue',
    itemId: 'INV-101',
    itemName: 'JP-8 Synthetic Heavy Fuel',
    quantity: 1400,
    unit: 'Litres',
    location: 'Sector-4 Forward Depot',
    recipient: 'Task Force Obsidian (VTOL Escort)',
    authorizedBy: 'Lt. Cdr. Vance',
    reason: 'Operational reconnaissance sortie fuel draw'
  },
  {
    id: 'TX-9020',
    timestamp: '2026-10-08T19:40:00Z',
    type: 'Receipt',
    itemId: 'INV-106',
    itemName: 'JP-8 Synthetic Heavy Fuel',
    quantity: 12000,
    unit: 'Litres',
    location: 'Aurora Station Alpha',
    recipient: 'Bulk Storage Tank 03',
    authorizedBy: 'Logistics Warrant Reyes',
    reason: 'Scheduled inbound transfer via Hyper-Rail Convoy #402'
  },
  {
    id: 'TX-9019',
    timestamp: '2026-10-08T14:15:00Z',
    type: 'Issue',
    itemId: 'INV-102',
    itemName: 'Advanced Trauma Resupply Kits (Tier-3)',
    quantity: 12,
    unit: 'Kits',
    location: 'Sector-4 Forward Depot',
    recipient: 'Mobile Surgical Unit Echo',
    authorizedBy: 'Maj. S. Morales',
    reason: 'Triage replenishment following perimeter incident'
  },
  {
    id: 'TX-9018',
    timestamp: '2026-10-07T11:05:00Z',
    type: 'Receipt',
    itemId: 'INV-105',
    itemName: 'Solid-State Tactical Power Cells',
    quantity: 800,
    unit: 'Units',
    location: 'Zenith Central Hub',
    recipient: 'Warehouse Rack B-12',
    authorizedBy: 'Chief Inspector Chen',
    reason: 'Factory delivery batch inspection passed'
  }
];

export const RISK_ALERTS = [
  {
    id: 'RISK-01',
    severity: 'critical',
    title: 'Imminent JP-8 Fuel Stockout Risk',
    supplyCategory: 'Fuel (JP-8 Synthetic)',
    location: 'Sector-4 Forward Depot',
    locationId: 'loc-sector4',
    inventoryId: 'INV-101',
    recommendationId: 'REC-301',
    currentStock: '14,200 Litres',
    projectedStockCoverage: 3.7, // days
    safetyStockThreshold: '18,000 Litres',
    estimatedStockoutDate: '2026-10-13 (04:30 UTC)',
    riskExplanation: 'Local burn rate elevated by 41% due to ongoing combat air patrol fueling. Route Cobalt is experiencing sandstorm disruptions, threatening the standard replenishment interval.',
    recommendedNextAction: 'Authorize immediate 22,000L emergency rail tanker dispatch from Zenith Central Hub via Route Diamond.',
    confidenceLevel: '94% (High Confidence)',
    dataLimitationNote: 'Weather severity model estimates are based on 12-hour delayed satellite meteorology feeds.'
  },
  {
    id: 'RISK-02',
    severity: 'critical',
    title: 'Severe Ration Shortfall — Mountain Pass Isolated',
    supplyCategory: 'Field Rations (MRE-X)',
    location: 'Borealis Mountain Outpost',
    locationId: 'loc-borealis',
    inventoryId: 'INV-103',
    recommendationId: 'REC-302',
    currentStock: '1,840 Kilograms',
    projectedStockCoverage: 3.5, // days
    safetyStockThreshold: '2,500 Kilograms',
    estimatedStockoutDate: '2026-10-12 (22:00 UTC)',
    riskExplanation: 'Mountain Pass Route Echo is currently obstructed by severe early blizzard conditions. Ground autonomous convoys cannot safely traverse the gradient.',
    recommendedNextAction: 'Approve Quad-VTOL Autonomous Heavy Air Bridge for 2,500kg immediate tactical drop.',
    confidenceLevel: '89% (Medium-High Confidence)',
    dataLimitationNote: 'Mountain telemetry sensor pack 04 is offline; snowpack depth estimated via radar altimetry.'
  },
  {
    id: 'RISK-03',
    severity: 'high',
    title: 'Trauma Medical Resupply Buffer Depletion',
    supplyCategory: 'Trauma Medical Kits',
    location: 'Sector-4 Forward Depot',
    locationId: 'loc-sector4',
    inventoryId: 'INV-102',
    recommendationId: 'REC-303',
    currentStock: '110 Kits',
    projectedStockCoverage: 4.5, // days
    safetyStockThreshold: '150 Kits',
    estimatedStockoutDate: '2026-10-14 (12:00 UTC)',
    riskExplanation: 'Repeated triage draws over the past 72 hours dropped inventory below the 150-kit threshold. Scheduled road convoy is subject to delay.',
    recommendedNextAction: 'Allocate 80 Tier-3 trauma kits from Aurora Station Alpha via rapid tactical courier.',
    confidenceLevel: '91% (High Confidence)',
    dataLimitationNote: 'Assumes hospital consumption rate remains at 72-hour trailing average.'
  },
  {
    id: 'RISK-04',
    severity: 'medium',
    title: 'Potable Water Filtration Load Imbalance',
    supplyCategory: 'Potable Water (Purified)',
    location: 'Vanguard Perimeter Camp',
    locationId: 'loc-vanguard',
    inventoryId: 'INV-104',
    recommendationId: 'REC-304',
    currentStock: '8,200 Litres',
    projectedStockCoverage: 4.9, // days
    safetyStockThreshold: '9,000 Litres',
    estimatedStockoutDate: '2026-10-14 (18:00 UTC)',
    riskExplanation: 'Primary filtration membrane B failure increased dependence on bottled emergency stores. Repair crew is en route.',
    recommendedNextAction: 'Stage secondary water bladders (5,000L) from Zenith Central Hub on standby transport.',
    confidenceLevel: '85% (Simulated Calculation)',
    dataLimitationNote: 'Dependent on scheduled delivery of replacement filtration membranes by Oct 11.'
  },
  {
    id: 'RISK-05',
    severity: 'low',
    title: 'Suspension Wear Replacement Threshold Approaching',
    supplyCategory: 'Armored Spares & Optics',
    location: 'Sector-4 Forward Depot',
    locationId: 'loc-sector4',
    inventoryId: 'INV-107',
    recommendationId: 'REC-305',
    currentStock: '28 Units',
    projectedStockCoverage: 7.0, // days
    safetyStockThreshold: '30 Units',
    estimatedStockoutDate: '2026-10-16 (09:00 UTC)',
    riskExplanation: 'Intensive patrol tempo across rocky wadi terrain has increased replacement parts draw by 18%.',
    recommendedNextAction: 'Include 20 tread units on routine weekly freight dispatch.',
    confidenceLevel: '82% (Baseline Linear Trend)',
    dataLimitationNote: 'Vehicle maintenance logs are manually digitized at 24-hour intervals.'
  }
];

export const ROUTES = [
  {
    id: 'ROUTE-01',
    code: 'COR-DIAMOND',
    name: 'Corridor Diamond (Hyper-Rail Mainline)',
    origin: 'Zenith Central Hub',
    originCoords: [35.6892, -105.9378],
    destination: 'Sector-4 Forward Depot',
    destinationCoords: [34.0522, -111.0937],
    waypoints: [
      [35.6892, -105.9378],
      [35.1500, -108.5000],
      [34.6000, -109.8000],
      [34.0522, -111.0937]
    ],
    status: 'Available',
    transitHours: 7.5,
    distanceKm: 580,
    transportCapacity: '650 Metric Tons',
    weatherSeverity: 'Low (Fair)',
    hazardLevel: 'Minimal',
    primaryMode: 'Autonomous Armored Rail',
    hazardDetails: 'Automated track integrity sensors reporting green. Defenses fully synchronized.',
    simulatedDisruption: 0
  },
  {
    id: 'ROUTE-02',
    code: 'COR-COBALT',
    name: 'Corridor Cobalt (Desert Highway E-40)',
    origin: 'Aurora Station Alpha',
    originCoords: [36.1699, -115.1398],
    destination: 'Sector-4 Forward Depot',
    destinationCoords: [34.0522, -111.0937],
    waypoints: [
      [36.1699, -115.1398],
      [35.1983, -114.0533],
      [34.5000, -112.5000],
      [34.0522, -111.0937]
    ],
    status: 'Disrupted',
    transitHours: 14.2,
    distanceKm: 490,
    transportCapacity: '220 Metric Tons',
    weatherSeverity: 'Moderate (Active Sandstorm)',
    hazardLevel: 'Elevated (Sensor Degradation)',
    primaryMode: 'Autonomous Convoy Trucks',
    hazardDetails: 'Visibility under 200m between Mile 120 and 210. Speed restricted to 35 km/h.',
    simulatedDisruption: 45
  },
  {
    id: 'ROUTE-03',
    code: 'COR-ECHO',
    name: 'Pass Echo (Alpine Ridge Highway)',
    origin: 'Aurora Station Alpha',
    originCoords: [36.1699, -115.1398],
    destination: 'Borealis Mountain Outpost',
    destinationCoords: [37.7749, -119.4194],
    waypoints: [
      [36.1699, -115.1398],
      [36.8000, -117.2000],
      [37.3000, -118.4000],
      [37.7749, -119.4194]
    ],
    status: 'Closed',
    transitHours: 18.0,
    distanceKm: 420,
    transportCapacity: '85 Metric Tons',
    weatherSeverity: 'Severe (Blizzard Warning)',
    hazardLevel: 'Hazardous (Pass Impassable)',
    primaryMode: 'Heavy Tracked Transports',
    hazardDetails: 'Snowpack exceeded 1.8 meters with avalanche hazards at elevation 2,800m.',
    simulatedDisruption: 100
  },
  {
    id: 'ROUTE-04',
    code: 'COR-SKYBRIDGE',
    name: 'Skybridge Air Corridor 09',
    origin: 'Zenith Central Hub',
    originCoords: [35.6892, -105.9378],
    destination: 'Borealis Mountain Outpost',
    destinationCoords: [37.7749, -119.4194],
    waypoints: [
      [35.6892, -105.9378],
      [36.5000, -112.0000],
      [37.2000, -116.0000],
      [37.7749, -119.4194]
    ],
    status: 'Available',
    transitHours: 3.2,
    distanceKm: 1250,
    transportCapacity: '35 Metric Tons',
    weatherSeverity: 'Low (High Altitude Clear)',
    hazardLevel: 'Low',
    primaryMode: 'Heavy Lift Quad-VTOL',
    hazardDetails: 'Airspace clear of turbulence above FL 180. Automated flight corridors active.',
    simulatedDisruption: 5
  },
  {
    id: 'ROUTE-05',
    code: 'COR-COASTAL',
    name: 'Corridor Pacific Shore (Intermodal)',
    origin: 'Helios Coastal Base',
    originCoords: [32.7157, -117.1611],
    destination: 'Vanguard Perimeter Camp',
    destinationCoords: [33.4484, -112.0740],
    waypoints: [
      [32.7157, -117.1611],
      [32.8000, -115.5000],
      [33.1000, -113.8000],
      [33.4484, -112.0740]
    ],
    status: 'Available',
    transitHours: 6.8,
    distanceKm: 480,
    transportCapacity: '400 Metric Tons',
    weatherSeverity: 'Low (Fair)',
    hazardLevel: 'Low',
    primaryMode: 'Heavy Hybrid Road Train',
    hazardDetails: 'Paved multi-lane expressway with autonomous convoy lanes operational.',
    simulatedDisruption: 0
  }
];

export const INITIAL_RECOMMENDATIONS = [
  {
    id: 'REC-301',
    priority: 'Critical',
    location: 'Sector-4 Forward Depot',
    locationId: 'loc-sector4',
    supplyCategory: 'Fuel (JP-8 Synthetic)',
    currentStock: '14,200 L',
    forecastDemand: '26,600 L (7-day horizon)',
    estimatedShortageRisk: '94% Stockout in 3.7 days',
    suggestedReplenishmentQty: 25000,
    unit: 'Litres',
    selectedRoute: 'Corridor Diamond (Hyper-Rail Mainline)',
    routeAlternatives: [
      { name: 'Corridor Diamond (Rail)', eta: '7.5 hrs', capacity: '650 T', status: 'Optimal' },
      { name: 'Corridor Cobalt (Highway)', eta: '14.2 hrs', capacity: '220 T', status: 'Disrupted (+6 hrs)' }
    ],
    illustrativeETA: '7.5 Hours',
    transportMode: 'Autonomous Armored Rail Tanker',
    explanation: 'Forward consumption rate increased 41% due to intensified patrol sorties. Hyper-rail link from Zenith Central Hub possesses 100% capacity margin and avoids the desert dust storms affecting Corridor Cobalt.',
    dataLimitations: 'Simulation based on historical 72-hour burn rates. Sudden combat escalations will accelerate depletion.',
    status: 'Pending Review',
    approvalHistory: null,
    modifiedDetails: null,
    riskId: 'RISK-01'
  },
  {
    id: 'REC-302',
    priority: 'Critical',
    location: 'Borealis Mountain Outpost',
    locationId: 'loc-borealis',
    supplyCategory: 'Field Rations (MRE-X)',
    currentStock: '1,840 kg',
    forecastDemand: '3,640 kg (7-day horizon)',
    estimatedShortageRisk: '89% Stockout in 3.5 days',
    suggestedReplenishmentQty: 3000,
    unit: 'Kilograms',
    selectedRoute: 'Skybridge Air Corridor 09',
    routeAlternatives: [
      { name: 'Skybridge Air Corridor 09 (VTOL)', eta: '3.2 hrs', capacity: '35 T', status: 'Clear & Open' },
      { name: 'Pass Echo (Alpine Ridge Highway)', eta: 'Blocked', capacity: '0 T', status: 'Pass Closed (Blizzard)' }
    ],
    illustrativeETA: '3.2 Hours',
    transportMode: 'Autonomous Quad-VTOL Air Lifter',
    explanation: 'Alpine road is 100% blocked by winter blizzards. Quad-VTOL from Zenith Hub provides weather-independent high-altitude ingress with immediate drop capability.',
    dataLimitations: 'VTOL flight plan subject to mountain gust variance exceeding 45 knots.',
    status: 'Pending Review',
    approvalHistory: null,
    modifiedDetails: null,
    riskId: 'RISK-02'
  },
  {
    id: 'REC-303',
    priority: 'High',
    location: 'Sector-4 Forward Depot',
    locationId: 'loc-sector4',
    supplyCategory: 'Trauma Medical Kits',
    currentStock: '110 Kits',
    forecastDemand: '168 Kits (7-day horizon)',
    estimatedShortageRisk: '91% Stockout in 4.5 days',
    suggestedReplenishmentQty: 120,
    unit: 'Kits',
    selectedRoute: 'Corridor Diamond (Hyper-Rail Mainline)',
    routeAlternatives: [
      { name: 'Corridor Diamond (Express Parcel Car)', eta: '8.0 hrs', capacity: '50 T', status: 'Optimal' },
      { name: 'Tactical Drone Courier', eta: '4.5 hrs', capacity: '2 T', status: 'Available' }
    ],
    illustrativeETA: '8.0 Hours',
    transportMode: 'High-Priority Rail Secure Pod',
    explanation: 'Inventory dipped below safety buffer (150 kits). Rapid resupply of 120 tier-3 trauma packs restores buffer to 12 days operational runway.',
    dataLimitations: 'Medical kit consumption fluctuates based on casualty evacuation surges.',
    status: 'Pending Review',
    approvalHistory: null,
    modifiedDetails: null,
    riskId: 'RISK-03'
  },
  {
    id: 'REC-304',
    priority: 'Medium',
    location: 'Vanguard Perimeter Camp',
    locationId: 'loc-vanguard',
    supplyCategory: 'Potable Water (Purified)',
    currentStock: '8,200 L',
    forecastDemand: '11,550 L (7-day horizon)',
    estimatedShortageRisk: '85% Below Safety in 4.9 days',
    suggestedReplenishmentQty: 8000,
    unit: 'Litres',
    selectedRoute: 'Corridor Pacific Shore (Intermodal)',
    routeAlternatives: [
      { name: 'Corridor Pacific Shore (Highway)', eta: '6.8 hrs', capacity: '400 T', status: 'Clear' }
    ],
    illustrativeETA: '6.8 Hours',
    transportMode: 'Bulk Water Tanker Semitrailer',
    explanation: 'Filtration unit down for planned overhaul. Auxiliary bulk delivery cushions depot reserves through maintenance window.',
    dataLimitations: 'Assumes maintenance crew resolves pump issue within 96 hours.',
    status: 'Pending Review',
    approvalHistory: null,
    modifiedDetails: null,
    riskId: 'RISK-04'
  }
];

export const INITIAL_SHIPMENTS = [
  {
    id: 'AST-9042',
    origin: 'Zenith Central Hub',
    originCode: 'ZEN-00',
    destination: 'Sector-4 Forward Depot',
    destinationCode: 'DEP-04',
    category: 'Fuel (JP-8 Synthetic)',
    quantity: 35000,
    unit: 'Litres',
    transportOption: 'Autonomous Armored Rail Tanker #114',
    routeCode: 'COR-DIAMOND',
    illustrativeETA: 'Oct 09, 2026 • 15:45 UTC (In 4.2h)',
    status: 'In Transit',
    progressPercent: 62,
    priority: 'High',
    lastUpdate: 'Checkpoint Delta passing speed 92 km/h',
    timeline: [
      { status: 'Requested', timestamp: '2026-10-09T02:00:00Z', note: 'Automated requisition triggered by consumption telemetry' },
      { status: 'Approved', timestamp: '2026-10-09T03:15:00Z', note: 'Approved by Logistics Command Station' },
      { status: 'Allocated', timestamp: '2026-10-09T04:30:00Z', note: 'Dedicated tanker railcar loaded and pressure tested' },
      { status: 'Dispatched', timestamp: '2026-10-09T06:00:00Z', note: 'Departed Zenith Central Railhead' },
      { status: 'In Transit', timestamp: '2026-10-09T09:30:00Z', note: 'Current position: Mile Marker 312, telemetry nominal' }
    ]
  },
  {
    id: 'AST-9041',
    origin: 'Aurora Station Alpha',
    originCode: 'AUR-01',
    destination: 'Sector-4 Forward Depot',
    destinationCode: 'DEP-04',
    category: 'Trauma Medical Kits',
    quantity: 90,
    unit: 'Kits',
    transportOption: 'Autonomous Convoy Truck Alpha-4',
    routeCode: 'COR-COBALT',
    illustrativeETA: 'Oct 09, 2026 • 21:00 UTC (In 9.5h)',
    status: 'In Transit',
    progressPercent: 35,
    priority: 'Critical',
    lastUpdate: 'Rerouted through low-dust secondary pass',
    timeline: [
      { status: 'Requested', timestamp: '2026-10-08T20:00:00Z', note: 'Depot medical officer initiated emergency requisition' },
      { status: 'Approved', timestamp: '2026-10-08T21:10:00Z', note: 'Expedited approval granted' },
      { status: 'Allocated', timestamp: '2026-10-08T22:45:00Z', note: 'Climate-controlled container sealed' },
      { status: 'Dispatched', timestamp: '2026-10-09T01:30:00Z', note: 'En route via Corridor Cobalt' },
      { status: 'In Transit', timestamp: '2026-10-09T07:15:00Z', note: 'Speed reduced due to 40-knot crosswinds' }
    ]
  },
  {
    id: 'AST-9040',
    origin: 'Zenith Central Hub',
    originCode: 'ZEN-00',
    destination: 'Borealis Mountain Outpost',
    destinationCode: 'BOR-03',
    category: 'Field Rations (MRE-X)',
    quantity: 2400,
    unit: 'Kilograms',
    transportOption: 'Heavy Lift Quad-VTOL "SkyStag-08"',
    routeCode: 'COR-SKYBRIDGE',
    illustrativeETA: 'Oct 09, 2026 • 13:10 UTC (In 1.8h)',
    status: 'In Transit',
    progressPercent: 80,
    priority: 'Critical',
    lastUpdate: 'Descending towards Borealis mountain landing pad 2',
    timeline: [
      { status: 'Requested', timestamp: '2026-10-09T04:15:00Z', note: 'Blizzard alert prompted airdrop prep' },
      { status: 'Approved', timestamp: '2026-10-09T05:00:00Z', note: 'Flight path certified clear' },
      { status: 'Allocated', timestamp: '2026-10-09T05:45:00Z', note: 'Rigged for autonomous precision drop' },
      { status: 'Dispatched', timestamp: '2026-10-09T07:20:00Z', note: 'Airborne from Zenith Airfield' },
      { status: 'In Transit', timestamp: '2026-10-09T09:45:00Z', note: 'Approaching landing beacon 03' }
    ]
  },
  {
    id: 'AST-9039',
    origin: 'Helios Coastal Base',
    originCode: 'HEL-02',
    destination: 'Vanguard Perimeter Camp',
    destinationCode: 'VAN-05',
    category: 'Potable Water (Purified)',
    quantity: 10000,
    unit: 'Litres',
    transportOption: 'Heavy Hybrid Road Train #22',
    routeCode: 'COR-COASTAL',
    illustrativeETA: 'Oct 09, 2026 • 11:30 UTC',
    status: 'Arrived',
    progressPercent: 100,
    priority: 'Normal',
    lastUpdate: 'Docked at Vanguard intake manifold. Transfer awaiting signoff.',
    timeline: [
      { status: 'Requested', timestamp: '2026-10-08T10:00:00Z', note: 'Routine scheduled bulk water transfer' },
      { status: 'Approved', timestamp: '2026-10-08T11:30:00Z', note: 'Dispatch cleared' },
      { status: 'Allocated', timestamp: '2026-10-08T14:00:00Z', note: 'Purity certification verified 99.98%' },
      { status: 'Dispatched', timestamp: '2026-10-08T16:00:00Z', note: 'Departed Helios Gate 4' },
      { status: 'In Transit', timestamp: '2026-10-08T21:00:00Z', note: 'Interstate corridor transit nominal' },
      { status: 'Arrived', timestamp: '2026-10-09T08:15:00Z', note: 'Vehicle entered Vanguard perimeter airlock' }
    ]
  },
  {
    id: 'AST-9038',
    origin: 'Zenith Central Hub',
    originCode: 'ZEN-00',
    destination: 'Aurora Station Alpha',
    destinationCode: 'AUR-01',
    category: 'Tactical Energy Cells',
    quantity: 1200,
    unit: 'Units',
    transportOption: 'High-Speed Maglev Flatcar',
    routeCode: 'COR-DIAMOND',
    illustrativeETA: 'Oct 08, 2026 • 18:00 UTC',
    status: 'Received',
    progressPercent: 100,
    priority: 'Normal',
    lastUpdate: 'Unloaded and verified into Station Alpha inventory.',
    timeline: [
      { status: 'Requested', timestamp: '2026-10-07T08:00:00Z', note: 'Depot stock rebalancing request' },
      { status: 'Approved', timestamp: '2026-10-07T09:15:00Z', note: 'Batch release approved' },
      { status: 'Allocated', timestamp: '2026-10-07T11:00:00Z', note: 'Units packed in EMP-shielded containers' },
      { status: 'Dispatched', timestamp: '2026-10-07T13:30:00Z', note: 'Departed Zenith Central' },
      { status: 'In Transit', timestamp: '2026-10-07T15:00:00Z', note: 'Transit on time' },
      { status: 'Arrived', timestamp: '2026-10-07T17:40:00Z', note: 'Arrived at Station Alpha dock' },
      { status: 'Received', timestamp: '2026-10-08T08:00:00Z', note: 'Barcode scan and acceptance complete' }
    ]
  },
  {
    id: 'AST-9043',
    origin: 'Zenith Central Hub',
    originCode: 'ZEN-00',
    destination: 'Sector-4 Forward Depot',
    destinationCode: 'DEP-04',
    category: 'Armored Spares & Optics',
    quantity: 24,
    unit: 'Units',
    transportOption: 'Autonomous Heavy Transporter 19',
    routeCode: 'COR-DIAMOND',
    illustrativeETA: 'Oct 10, 2026 • 08:00 UTC',
    status: 'Allocated',
    progressPercent: 20,
    priority: 'Normal',
    lastUpdate: 'Staged on loading bay 4, awaiting departure clearance.',
    timeline: [
      { status: 'Requested', timestamp: '2026-10-09T06:30:00Z', note: 'Parts requisition for tracked APC fleet' },
      { status: 'Approved', timestamp: '2026-10-09T07:45:00Z', note: 'Technical supervisor authorized parts release' },
      { status: 'Allocated', timestamp: '2026-10-09T09:00:00Z', note: 'Crated and secured with hydraulic clamps' }
    ]
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'AUD-8801',
    timestamp: '2026-10-09T09:30:00Z',
    actor: 'Logistics Controller (Local Operator)',
    action: 'Shipment Tracking Update',
    entityType: 'Shipment',
    entityId: 'AST-9042',
    previousValue: 'Checkpoint Gamma',
    updatedValue: 'Mile Marker 312 • In Transit (62%)',
    reason: 'Telemetry beacon ping processed',
    status: 'Success'
  },
  {
    id: 'AUD-8802',
    timestamp: '2026-10-09T05:22:00Z',
    actor: 'Lt. Cdr. Vance (Sector-4)',
    action: 'Stock Issued',
    entityType: 'Inventory Item',
    entityId: 'INV-101',
    previousValue: '15,600 Litres',
    updatedValue: '14,200 Litres (-1,400 L)',
    reason: 'Fuel draw for Task Force Obsidian VTOL reconnaissance',
    status: 'Success'
  },
  {
    id: 'AUD-8803',
    timestamp: '2026-10-09T04:15:00Z',
    actor: 'Predictive Intelligence Engine (Prototype Model)',
    action: 'Shortage Risk Alert Generated',
    entityType: 'Risk Intelligence',
    entityId: 'RISK-01',
    previousValue: 'High Risk (4.8 days)',
    updatedValue: 'Critical Risk (3.7 days)',
    reason: 'Consumption rate acceleration crossed safety margin',
    status: 'Automated'
  },
  {
    id: 'AUD-8804',
    timestamp: '2026-10-08T21:10:00Z',
    actor: 'Logistics Command Duty Officer',
    action: 'Recommendation Approved',
    entityType: 'Recommendation',
    entityId: 'REC-298',
    previousValue: 'Pending Review',
    updatedValue: 'Approved',
    reason: 'Critical medical supply line established ahead of adverse weather',
    status: 'Success'
  },
  {
    id: 'AUD-8805',
    timestamp: '2026-10-08T19:40:00Z',
    actor: 'Logistics Warrant Reyes',
    action: 'Stock Received',
    entityType: 'Inventory Item',
    entityId: 'INV-106',
    previousValue: '36,000 Litres',
    updatedValue: '48,000 Litres (+12,000 L)',
    reason: 'Scheduled bulk tank resupply from Train #402',
    status: 'Success'
  }
];

export const FORECAST_SERIES_DAYS = {
  7: generateForecastSeries(7),
  15: generateForecastSeries(15),
  30: generateForecastSeries(30),
};

function generateForecastSeries(horizonDays) {
  const result = [];
  const today = new Date('2026-10-09T00:00:00Z');
  
  // 7 days of historical
  for (let i = 7; i >= 1; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0].substring(5); // MM-DD
    const base = 3500 + Math.sin(i * 0.8) * 400 + (7 - i) * 80;
    result.push({
      date: dateStr,
      fullDate: d.toISOString().split('T')[0],
      historical: Math.round(base),
      projected: null,
      projectedMin: null,
      projectedMax: null,
      currentStockLevel: Math.max(8000, Math.round(28000 - (7 - i) * 2200)),
      safetyThreshold: 18000,
      type: 'Historical'
    });
  }

  // Today marker
  const todayStr = today.toISOString().split('T')[0].substring(5);
  result.push({
    date: todayStr,
    fullDate: today.toISOString().split('T')[0],
    historical: 3800,
    projected: 3800,
    projectedMin: 3600,
    projectedMax: 4000,
    currentStockLevel: 14200,
    safetyThreshold: 18000,
    type: 'Current'
  });

  // Future projected days
  let runningStock = 14200;
  for (let i = 1; i <= horizonDays; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0].substring(5);
    // Project simulated demand
    const trend = 3800 + i * 45 + Math.sin(i) * 350;
    const uncertainty = i * 65;
    runningStock = Math.max(0, runningStock - trend + (i === 4 ? 22000 : 0)); // Simulated arrival on day 4
    
    result.push({
      date: dateStr,
      fullDate: d.toISOString().split('T')[0],
      historical: null,
      projected: Math.round(trend),
      projectedMin: Math.max(1000, Math.round(trend - uncertainty)),
      projectedMax: Math.round(trend + uncertainty),
      currentStockLevel: Math.round(runningStock),
      safetyThreshold: 18000,
      type: 'Forecast'
    });
  }

  return result;
}
