import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { SyncProvider } from './context/SyncContext';
import AppShell from './components/layout/AppShell';

// Page components
import CommandCentre from './pages/CommandCentre';
import Inventory from './pages/Inventory';
import DemandForecast from './pages/DemandForecast';
import RiskIntelligence from './pages/RiskIntelligence';
import RouteIntelligence from './pages/RouteIntelligence';
import ReplenishmentRecommendations from './pages/ReplenishmentRecommendations';
import Shipments from './pages/Shipments';
import ScenarioLab from './pages/ScenarioLab';
import AuditActivity from './pages/AuditActivity';

export function App() {
  return (
    <ToastProvider>
      <SyncProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppShell />}>
              <Route index element={<CommandCentre />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="forecast" element={<DemandForecast />} />
              <Route path="risk" element={<RiskIntelligence />} />
              <Route path="routes" element={<RouteIntelligence />} />
              <Route path="recommendations" element={<ReplenishmentRecommendations />} />
              <Route path="shipments" element={<Shipments />} />
              <Route path="scenario-lab" element={<ScenarioLab />} />
              <Route path="audit" element={<AuditActivity />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SyncProvider>
    </ToastProvider>
  );
}

export default App;
