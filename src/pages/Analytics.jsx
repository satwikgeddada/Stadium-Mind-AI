import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useLiveSensors } from '../hooks/useLiveSensors';
import { motion, useSpring, useTransform } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Animated Counter component
const AnimatedCounter = ({ value, prefix = "", suffix = "" }) => {
  const spring = useSpring(value, { mass: 1, stiffness: 50, damping: 15 });
  const display = useTransform(spring, (current) => 
    `${prefix}${Math.round(current).toLocaleString()}${suffix}`
  );
  
  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
};

const Analytics = () => {
  const { analytics, stats } = useLiveSensors();
  const labels = analytics?.labels || [];

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
        ticks: { color: 'rgba(148, 163, 184, 1)' }
      },
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(148, 163, 184, 1)' }
      }
    }
  };

  const visitorsData = {
    labels,
    datasets: [{
      fill: true,
      data: analytics?.visitors || [],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
    }]
  };

  const densityData = {
    labels,
    datasets: [{
      fill: true,
      data: analytics?.crowdDensity || [],
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      tension: 0.4,
    }]
  };

  const queueData = {
    labels,
    datasets: [{
      data: analytics?.queueLength || [],
      backgroundColor: 'rgba(167, 139, 250, 0.8)',
      borderRadius: 4,
    }]
  };

  const medicalData = {
    labels,
    datasets: [{
      data: analytics?.medicalRequests || [],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderWidth: 2,
      tension: 0,
      stepped: true
    }]
  };

  const securityData = {
    labels,
    datasets: [{
      data: analytics?.securityAlerts || [],
      backgroundColor: 'rgba(244, 63, 94, 0.8)',
      borderRadius: 4,
    }]
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Deep Analytics Core</h1>
          <p className="text-slate-400">Live telemetry and historical trends</p>
        </div>
        <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-sm font-bold text-emerald-400 uppercase tracking-wide">Live Stream Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitors Chart */}
        <div className="glass-card flex flex-col h-[350px]">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-bold text-slate-200">Total Visitors</h2>
            <div className="text-2xl font-bold text-blue-400">
              <AnimatedCounter value={stats?.totalVisitors || 0} />
            </div>
          </div>
          <div className="flex-1 relative w-full">
            <Line data={visitorsData} options={commonOptions} />
          </div>
        </div>

        {/* Crowd Density Chart */}
        <div className="glass-card flex flex-col h-[350px]">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-bold text-slate-200">Crowd Density %</h2>
            <div className="text-2xl font-bold text-amber-400">
              <AnimatedCounter value={parseInt(stats?.crowdDensity || 0)} suffix="%" />
            </div>
          </div>
          <div className="flex-1 relative w-full">
            <Line data={densityData} options={commonOptions} />
          </div>
        </div>

        {/* Queue Length Chart */}
        <div className="glass-card flex flex-col h-[300px]">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-bold text-slate-200">Avg. Queue Length</h2>
            <div className="text-xl font-bold text-purple-400">
              <AnimatedCounter value={parseInt(stats?.queueLength || 0)} suffix=" mins" />
            </div>
          </div>
          <div className="flex-1 relative w-full">
            <Bar data={queueData} options={commonOptions} />
          </div>
        </div>

        {/* Medical & Security Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="glass-card flex flex-col h-[300px]">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-sm font-bold text-slate-200">Medical Dispatches</h2>
              <div className="text-lg font-bold text-emerald-400">
                <AnimatedCounter value={stats?.medicalTeams || 0} />
              </div>
            </div>
            <div className="flex-1 relative w-full">
              <Line data={medicalData} options={commonOptions} />
            </div>
          </div>

          <div className="glass-card flex flex-col h-[300px]">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-sm font-bold text-slate-200">Security Alerts</h2>
              <div className="text-lg font-bold text-rose-400">
                <AnimatedCounter value={stats?.securityAlerts || 0} />
              </div>
            </div>
            <div className="flex-1 relative w-full">
              <Bar data={securityData} options={commonOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
