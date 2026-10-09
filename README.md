# KARTAVYA — Intelligent Logistics Command Platform

> **Predict. Prepare. Deliver.**

KARTAVYA is a modern, intelligent, resilient logistics and supply-chain decision-support platform designed for mission-critical operations, forward operating depots, and multi-modal freight networks.

This repository contains the **complete, standalone, responsive frontend** engineered for high-density operational monitoring, human-in-the-loop decision verification, and seamless integration with a Python FastAPI backend via Antigravity.

---

## 1. Brand Identity & Design Language

- **Product Name**: KARTAVYA
- **Core Tagline**: *"Predict. Prepare. Deliver."*
- **Mission**: Providing operational commanders, supply officers, and logistics directors with real-time early warning telemetry, forward stock runway estimations, autonomous replenishment proposals, and multi-modal corridor intelligence.
- **Midnight Dark Surfaces**: Backgrounds engineered with `#060a12`, `#0b1120`, and `#0f172a` for low eye strain in 24/7 command environments.
- **Electric Cyan (`#00f0ff` / `#06b6d4`)**: Active telemetry streams, real-time vehicle vectors, and high-confidence predictions.
- **Hazard Amber (`#f59e0b`) & Crimson (`#f43f5e`)**: Early warning stockout signals, weather closures, and corridor bottlenecks.
- **Density & Hierarchy**: Compact typography (`Inter` + `JetBrains Mono`), corner reticles, micro-status indicators, and instant drill-downs.

---

## 2. Tech Stack

- **Framework**: React 18 + Vite 5
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS (Dark midnight navy palette with electric cyan, hazard amber, and alert crimson)
- **Icons**: Lucide React
- **Data Visualization**: Recharts (Composed time-series, historical actuals, predictive bounds, safety thresholds)
- **GIS & Route Visualization**: Custom Tactical Vector GIS Engine + Leaflet / OpenStreetMap compatibility
- **State Management & Resiliency**: Built-in decoupled service layer with local reactive storage and offline buffer queue

---

## 3. Implemented Command Modules

1. **Command Centre (`/`)**: High-density theater operational overview with readiness gauge (84%), 6 tracked inventory categories, attention depots, active shortage alerts, in-transit convoy trackers, demand vs reserve chart, compact map, and priority action lists.
2. **Inventory Management (`/inventory`)**: Searchable, filterable forward stockpile ledger with category filters (Fuel, Rations, Medical Kits, Water, Batteries, Spares), location filters, condition tags, stock coverage days, and working modal dialogs to **Record Stock Receipt** and **Record Stock Issue** with immediate client-side balance updates.
3. **Demand Forecasting (`/forecast`)**: 7, 15, and 30-day horizons comparing historical draw against predicted trajectories with 95% confidence uncertainty envelopes, safety threshold baselines, influencing factors, and transparent prototype methodology notes.
4. **Risk Intelligence (`/risk`)**: Early warning matrix filtering by Critical, High, Medium, and Low severity. Displays calculated stockout ETAs, projected coverage, safety buffer gaps, root cause intel, and 1-click links to replenishment actions.
5. **Route Intelligence (`/routes`)**: Multi-modal corridor GIS visualizer displaying 5 fictional corridors (Hyper-Rail, Desert Highway, Alpine Ridge, VTOL Airbridge, Coastal Intermodal) with waypoint tracing, simulated degradation, and route status toggles.
6. **Replenishment Recommendations (`/recommendations`)**: Human-in-the-Loop decision workspace supporting the complete lifecycle (`Pending Review` → `Approved` / `Modified` / `Rejected` → `Executed`). Rejections and modifications require documented operational reasons. **Note**: Approving a proposal deliberately does not auto-dispatch physical shipments.
7. **Shipment Tracking (`/shipments`)**: Live freight tracking advancing through the 8-stage operational chain (`Requested` → `Approved` → `Allocated` → `Dispatched` → `In Transit` → `Arrived` → `Received` → `Closed`) with interactive status transitions and event logs.
8. **Scenario Lab (`/scenario-lab`)**: Interactive what-if stress simulation engine. Configurable controls for Demand Surge (+0-100%), Inbound Delay (0-14d), Route Closure, Transport Capacity Reduction (0-70%), Weather Tier (1-5), and Simulated Offline Mode. Dynamically recalculates baseline-versus-scenario metrics in real time.
9. **Audit & Activity (`/audit`)**: Searchable custody journal capturing actor timestamps, entity IDs, delta state comparisons, and operational justifications for all local session transactions.

---

## 4. Frontend Architecture & Future FastAPI Integration

The project is structured with a clean separation of concerns:

```
src/
├── components/
│   ├── common/         # Button, Badge, Card, Modal, Drawer, StatCard, DataDisclaimerBanner, KartavyaLogo, LoadingScreen
│   ├── layout/         # AppShell, Sidebar, TopNav, SyncStatusWidget
│   └── maps/           # LogisticsMap, CompactMap (Tactical GIS Vector Engine)
├── context/
│   ├── ToastContext.jsx  # Notification alerts & toast queue
│   └── SyncContext.jsx   # Connectivity status, offline queue, manual sync
├── data/
│   └── prototypeData.js  # Segregated initial dataset & fictional entities
├── services/
│   ├── apiClient.js              # Central HTTP client using VITE_API_BASE_URL
│   ├── inventoryService.js       # Inbound receipt / outbound issue logic
│   ├── forecastService.js        # Autoregressive predictive series
│   ├── riskService.js            # Stockout horizon heuristics
│   ├── routeService.js           # Corridor status & telemetry
│   ├── recommendationService.js  # Human validation workflow
│   ├── shipmentService.js        # 8-stage lifecycle tracker
│   ├── simulationService.js      # Compound scenario stress calculation
│   ├── syncService.js            # Offline queue & synchronization
│   └── auditService.js           # Custody change logging
├── pages/              # All 9 primary command views
├── App.jsx             # React Router routing tree
└── main.jsx
```

### Backend Integration Instructions (Antigravity & FastAPI)

1. Set your backend URL in `.env`:
   ```bash
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   VITE_USE_PROTOTYPE_FALLBACK=false
   ```
2. When configured, `apiClient.js` routes all calls to your FastAPI routes:
   - `GET /api/v1/inventory`
   - `POST /api/v1/inventory/{id}/receipt`
   - `POST /api/v1/inventory/{id}/issue`
   - `GET /api/v1/forecast?horizon=15&category=Fuel`
   - `GET /api/v1/risks`
   - `GET /api/v1/routes`
   - `POST /api/v1/recommendations/{id}/approve`
   - `PATCH /api/v1/recommendations/{id}/modify`
   - `POST /api/v1/recommendations/{id}/reject`
   - `GET /api/v1/shipments`
   - `POST /api/v1/shipments/{id}/advance`
   - `GET /api/v1/audit`
3. When `VITE_API_BASE_URL` is empty (default), KARTAVYA operates smoothly using the built-in local prototype state engine, allowing standalone deployment, testing, and evaluation without database or backend dependencies.

---

## 5. Quick Start & Local Run

### Prerequisites
- Node.js 18+ (tested on Node v20)
- npm 9+

### Installation
```bash
# Navigate to project directory
cd astralogistics-command-centre

# Install dependencies
npm install

# Start local development server
npm run dev
```

The application will be live at `http://localhost:5173`.

### Production Build
```bash
npm run build
npm run preview
```

---

## 6. Offline Resiliency & Data Integrity Notice

- All illustrative data points and routes are synthetic tactical models for command evaluation.
- No live GPS, neural network weights, or classified transport networks are fabricated.
- Prototype calculations are explicitly demarcated with tactical disclaimer banners across all workspaces.
