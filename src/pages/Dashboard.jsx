import React, { useState, useEffect } from 'react';
import { 
  Users, Activity, ShieldAlert, CloudRain, Clock, Stethoscope, Sparkles, RefreshCw
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useLiveSensors } from '../hooks/useLiveSensors';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const stadiumData = useLiveSensors();
  const { stats, heatmap, hourlyTraffic } = stadiumData;

  const [recommendation, setRecommendation] = useState("Analyzing stadium parameters...");
  const [loadingRec, setLoadingRec] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data loading skeleton for 1.5s
    const timer = setTimeout(() => setInitialLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const fetchRecommendation = async () => {
    try {
      setLoadingRec(true);
      const res = await fetch('https://stadium-mind-ai.onrender.com/recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(stadiumData)
      });
      const data = await res.json();
      
      if (data.recommendation) {
        setRecommendation(data.recommendation);
      } else {
        setRecommendation("Error retrieving recommendation.");
      }
    } catch (err) {
      setRecommendation("Unable to fetch AI recommendation. Ensure backend is running at http://localhost:8000.");
    } finally {
      setLoadingRec(false);
    }
  };

  // Fetch recommendation on initial load
  useEffect(() => {
    fetchRecommendation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statCards = [
    { name: 'Total Visitors', value: stats.totalVisitors.toLocaleString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { name: 'Crowd Density', value: stats.crowdDensity, icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { name: 'Security Alerts', value: stats.securityAlerts, icon: ShieldAlert, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { name: 'Weather', value: stats.weather, icon: CloudRain, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { name: 'Queue Length', value: stats.queueLength, icon: Clock, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { name: 'Medical Teams', value: stats.medicalTeams, icon: Stethoscope, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'normal':
        return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
      case 'busy':
        return 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]';
      case 'congested':
        return 'bg-rose-500/20 border-rose-500/50 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse';
      default:
        return 'bg-slate-500/20 border-slate-500/50 text-slate-400';
    }
  };

  const chartData = {
    labels: hourlyTraffic.labels,
    datasets: [
      {
        fill: true,
        label: 'Hourly Traffic',
        data: hourlyTraffic.data,
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 500,
    },
    plugins: {
      legend: {
        labels: {
          color: 'rgba(148, 163, 184, 1)',
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(51, 65, 85, 0.5)',
        },
        ticks: {
          color: 'rgba(148, 163, 184, 1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(51, 65, 85, 0.5)',
        },
        ticks: {
          color: 'rgba(148, 163, 184, 1)',
        },
      },
    },
  };

  if (initialLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-[#0a1936]/60 rounded-xl border border-cyan-900/30"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-28 bg-[#0a1936]/60 rounded-xl border border-cyan-900/30"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[400px] bg-[#0a1936]/60 rounded-xl border border-cyan-900/30"></div>
          <div className="h-[400px] bg-[#0a1936]/60 rounded-xl border border-cyan-900/30"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* AI Recommendation Card */}
      <div className="glass-card border-purple-500/30 bg-gradient-to-r from-slate-900/80 to-purple-900/20 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-600/10 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                StadiumMind AI Insights
              </h2>
              <button 
                onClick={fetchRecommendation}
                disabled={loadingRec}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-300 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loadingRec ? 'animate-spin' : ''}`} />
                {loadingRec ? 'Analyzing...' : 'Refresh AI'}
              </button>
            </div>
            <p className="text-slate-300 leading-relaxed font-medium">
              {recommendation}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="glass-card flex items-center p-6 gap-6 transition-all duration-300">
              <div className={`p-4 rounded-xl ${stat.bg} flex-shrink-0`}>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div>
                <p className="text-slate-400 font-medium text-sm mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-slate-100 transition-all duration-500">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card flex flex-col h-[400px]">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            Traffic Overview
            <span className="flex h-3 w-3 relative ml-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </h2>
          <div className="flex-1 w-full relative">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="glass-card flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              Stadium Heatmap
              <span className="flex h-3 w-3 relative ml-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </h2>
            <div className="flex gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>Normal</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>Busy</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></span>Congested</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-1">
            {heatmap.map((section) => (
              <div 
                key={section.name} 
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-700 ${getStatusColor(section.status)}`}
              >
                <span className="text-lg font-bold mb-2 text-center">{section.name}</span>
                <span className="text-xs uppercase tracking-wider font-semibold opacity-80">
                  {section.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
