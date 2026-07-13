import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import AIAssistant from './pages/AIAssistant';
import Emergency from './pages/Emergency';
import Analytics from './pages/Analytics';
import SmartNavigation from './pages/SmartNavigation';
import Volunteers from './pages/Volunteers';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
          <Route path="smart-navigation" element={<SmartNavigation />} />
          <Route path="volunteers" element={<Volunteers />} />
          <Route path="emergency" element={<Emergency />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
