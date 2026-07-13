import React, { useState, useEffect } from 'react';
import { useLiveSensors } from '../hooks/useLiveSensors';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserCheck, TrendingDown, MapPin, ShieldAlert, Bot
} from 'lucide-react';

const Volunteers = () => {
  const { stats, heatmap } = useLiveSensors();
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const newAssignments = [];

    heatmap.forEach(area => {
      if (area.status === 'Congested') {
        newAssignments.push({
          id: `TASK-${area.name.replace(/\s+/g, '-').toUpperCase()}`,
          role: 'Volunteer Team',
          count: 3,
          location: area.name,
          action: 'Crowd Control & Queuing',
          reduction: '18%',
          priority: 'High',
          color: 'rose'
        });
      } else if (area.status === 'Busy') {
        newAssignments.push({
          id: `TASK-${area.name.replace(/\s+/g, '-').toUpperCase()}`,
          role: 'Volunteer',
          count: 1,
          location: area.name,
          action: 'Information & Assistance',
          reduction: '5%',
          priority: 'Medium',
          color: 'amber'
        });
      }
    });

    // Add a dedicated security task if there are alerts
    if (stats.securityAlerts > 0) {
      newAssignments.unshift({
        id: `SEC-SECTOR-C`,
        role: 'Security Team',
        count: 2,
        location: 'Sector C',
        action: 'Investigate Alert',
        reduction: 'Resolution',
        priority: 'Critical',
        color: 'purple'
      });
    }

    setAssignments(newAssignments);
  }, [heatmap, stats.securityAlerts]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Bot className="w-6 h-6 text-cyan-400" /> AI Task Assignment
          </h1>
          <p className="text-slate-400">Dynamic resource allocation based on live density</p>
        </div>
        <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-bold text-blue-400 uppercase tracking-wide">
            {stats.volunteersAvailable} Standby
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-200 mb-4">Recommended Deployments</h2>
          
          <AnimatePresence mode="popLayout">
            {assignments.length > 0 ? assignments.map((task) => (
              <motion.div
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={task.id}
                className={`glass-card border-l-4 transition-colors border-l-${task.color}-500 bg-slate-800/40 hover:bg-slate-800/60`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-${task.color}-500/20 text-${task.color}-400`}>
                      {task.priority === 'Critical' ? <ShieldAlert className="w-6 h-6" /> : <UserCheck className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold uppercase tracking-wider text-${task.color}-400`}>
                          {task.priority} PRIORITY
                        </span>
                        <span className="text-xs text-slate-500">{task.id}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-200">
                        Dispatch {task.count}x {task.role} to {task.location}
                      </h3>
                      <p className="text-sm text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {task.action}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right flex flex-col items-end">
                    <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">Est. Impact</span>
                    <div className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      <TrendingDown className="w-4 h-4" /> {task.reduction}
                    </div>
                    <button className="mt-4 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                      Execute Deployment &rarr;
                    </button>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="glass-card flex flex-col items-center justify-center py-12 text-slate-400">
                <UserCheck className="w-12 h-12 mb-4 text-emerald-500/50" />
                <p className="text-lg font-medium">All zones operating optimally.</p>
                <p className="text-sm">No reassignments recommended at this time.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <div className="glass-card bg-gradient-to-br from-[#06122a] to-blue-900/20">
            <h2 className="text-lg font-bold text-slate-200 mb-6">Resource Overview</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Active Volunteers</span>
                  <span className="font-bold text-cyan-400">85%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-cyan-500 h-2 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Security Personnel</span>
                  <span className="font-bold text-purple-400">92%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Medical Staff</span>
                  <span className="font-bold text-emerald-400">45%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Volunteers;
