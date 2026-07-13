import React, { useState } from 'react';
import { 
  Search, ArrowUp, CornerUpLeft, CornerUpRight, ArrowUpCircle, ArrowUpRight,
  MapPin, User, Clock, Map, Navigation, ArrowDown
} from 'lucide-react';
import routesData from '../data/routes.json';
import { motion, AnimatePresence } from 'framer-motion';

const getIcon = (iconName) => {
  switch (iconName) {
    case 'ArrowUp': return ArrowUp;
    case 'CornerUpLeft': return CornerUpLeft;
    case 'CornerUpRight': return CornerUpRight;
    case 'ArrowUpCircle': return ArrowUpCircle;
    case 'ArrowUpRight': return ArrowUpRight;
    case 'MapPin': return MapPin;
    case 'User': return User;
    default: return Navigation;
  }
};

const SmartNavigation = () => {
  const [searchInput, setSearchInput] = useState('');
  const [activeRoute, setActiveRoute] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    const route = routesData.find(r => r.seatNumber.toLowerCase() === searchInput.trim().toLowerCase());
    
    if (route) {
      setActiveRoute(route);
      setError('');
    } else {
      setActiveRoute(null);
      setError('Seat not found. Try A102, B205, or C10.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="glass-card bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <Map className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Smart Navigation</h1>
            <p className="text-slate-400">Indoor routing system (No GPS required)</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Seat ID (e.g. A102)..."
              className="glass-input w-full pl-12 py-4 text-lg font-medium"
            />
          </div>
          <button type="submit" className="glass-button-primary px-8 text-lg flex items-center gap-2">
            <Navigation className="w-5 h-5" /> Navigate
          </button>
        </form>
        {error && <p className="text-rose-400 mt-3 text-sm">{error}</p>}
      </div>

      <AnimatePresence mode="wait">
        {activeRoute && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card border-emerald-500/20"
          >
            <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-700/50">
              <div>
                <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold mb-1">Destination</p>
                <h2 className="text-2xl font-bold text-emerald-400">{activeRoute.destination}</h2>
                <h3 className="text-xl text-slate-200 mt-1">Seat {activeRoute.seatNumber}</h3>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold mb-1">Est. Time</p>
                <div className="flex items-center gap-2 text-xl font-bold text-slate-200 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
                  <Clock className="w-5 h-5 text-amber-400" />
                  {activeRoute.walkingTime}
                </div>
              </div>
            </div>

            <div className="relative pl-8">
              {/* Vertical line connecting steps */}
              <div className="absolute left-[39px] top-8 bottom-8 w-0.5 bg-slate-700"></div>
              
              <div className="space-y-6">
                {activeRoute.directions.map((step, index) => {
                  const StepIcon = getIcon(step.icon);
                  const isLast = index === activeRoute.directions.length - 1;
                  const isFirst = index === 0;
                  
                  return (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={index} 
                      className="relative flex items-center gap-6"
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-slate-900 relative z-10 ${
                        isLast ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 
                        isFirst ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 
                        'bg-slate-700'
                      }`}>
                        <StepIcon className="w-5 h-5 text-white" />
                      </div>
                      
                      <div className={`flex-1 p-4 rounded-xl border ${
                        isLast ? 'bg-emerald-500/10 border-emerald-500/30' : 
                        isFirst ? 'bg-blue-500/10 border-blue-500/30' : 
                        'bg-slate-800/50 border-slate-700/50'
                      }`}>
                        <p className={`text-lg font-medium ${
                          isLast ? 'text-emerald-400' : isFirst ? 'text-blue-400' : 'text-slate-200'
                        }`}>
                          {step.instruction}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartNavigation;
