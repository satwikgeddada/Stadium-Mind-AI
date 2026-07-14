import React, { useState } from 'react';
import { 
  AlertTriangle, ShieldAlert, PhoneCall, RadioTower, Flame, 
  Baby, ZapOff, Shield, Loader2, Info, CheckCircle2, Megaphone, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveSensors } from '../hooks/useLiveSensors';

const Emergency = () => {
  const stadiumData = useLiveSensors();
  const [activeAlert, setActiveAlert] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [emergencyPlan, setEmergencyPlan] = useState(null);
  const [error, setError] = useState(null);

  const emergencyProtocols = [
    { id: 'medical', title: 'Medical Emergency', icon: PhoneCall, color: 'blue' },
    { id: 'fire', title: 'Fire Detected', icon: Flame, color: 'rose' },
    { id: 'child', title: 'Lost Child', icon: Baby, color: 'purple' },
    { id: 'security', title: 'Security Breach', icon: Shield, color: 'amber' },
    { id: 'power', title: 'Power Failure', icon: ZapOff, color: 'slate' },
  ];

  const handleTriggerEmergency = async (protocol) => {
    setActiveAlert(protocol.id);
    setIsGenerating(true);
    setEmergencyPlan(null);
    setError(null);

    try {
      const res = await fetch('https://stadium-mind-ai.onrender.com/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          incidentType: protocol.title,
          stadiumData: stadiumData 
        })
      });
      
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setEmergencyPlan(data);
      }
    } catch (err) {
      setError("Failed to connect to AI Emergency Core. Check backend status.");
    } finally {
      setIsGenerating(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'CRITICAL': return 'bg-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.5)]';
      case 'HIGH': return 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]';
      case 'MEDIUM': return 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)]';
      case 'LOW': return 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="glass-card border-rose-500/30 bg-rose-500/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-rose-500/50"></div>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-500/20 rounded-xl">
            <AlertTriangle className="w-8 h-8 text-rose-500 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-rose-500 mb-2">Emergency Response Director</h1>
            <p className="text-slate-300">
              Trigger an incident to generate an AI-powered emergency action plan based on live stadium telemetry.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {emergencyProtocols.map((protocol) => {
          const Icon = protocol.icon;
          const isActive = activeAlert === protocol.id;
          
          return (
            <motion.button 
              key={protocol.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTriggerEmergency(protocol)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${
                isActive 
                  ? `border-${protocol.color}-500 bg-${protocol.color}-500/20 shadow-[0_0_20px_rgba(var(--color-${protocol.color}-500),0.3)]` 
                  : 'border-slate-700/50 bg-slate-800/40 hover:border-slate-500 hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-8 h-8 mb-2 ${isActive ? `text-${protocol.color}-400` : 'text-slate-400'}`} />
              <span className={`text-sm font-bold text-center ${isActive ? 'text-white' : 'text-slate-300'}`}>
                {protocol.title}
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {isGenerating && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card flex flex-col items-center justify-center py-16"
          >
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-slate-200">AI Director is analyzing live telemetry...</h2>
            <p className="text-slate-400 mt-2">Synthesizing evacuation routes and generating protocols.</p>
          </motion.div>
        )}

        {error && !isGenerating && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-rose-500/20 border border-rose-500/50 rounded-xl text-rose-400 text-center font-medium"
          >
            {error}
          </motion.div>
        )}

        {emergencyPlan && !isGenerating && (
          <motion.div
            key={`plan-${activeAlert}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Left Column */}
            <div className="space-y-6">
              <div className="glass-card border-l-4 border-l-blue-500">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-400" /> Incident Summary
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${getPriorityColor(emergencyPlan.priority)}`}>
                    {emergencyPlan.priority} PRIORITY
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {emergencyPlan.incidentSummary}
                </p>
              </div>

              <div className="glass-card border-l-4 border-l-amber-500">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-amber-400" /> Immediate Actions
                </h3>
                <ul className="space-y-3">
                  {emergencyPlan.immediateActions?.map((action, i) => (
                    <li key={i} className="flex gap-3 items-start bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                      <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 text-sm font-bold">
                        {i + 1}
                      </span>
                      <span className="text-slate-200 mt-0.5">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="glass-card border-l-4 border-l-purple-500 h-auto">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-purple-400" /> Volunteer Instructions
                </h3>
                <div className="bg-purple-500/5 p-4 rounded-lg border border-purple-500/20 text-slate-300 leading-relaxed">
                  {emergencyPlan.volunteerInstructions}
                </div>
              </div>

              <div className="glass-card border-l-4 border-l-emerald-500">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <Megaphone className="w-5 h-5 text-emerald-400" /> Public Announcement Script
                </h3>
                <div className="relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50 rounded-l-lg"></div>
                  <div className="bg-slate-900/80 p-5 pl-6 rounded-lg text-emerald-50 italic font-medium leading-relaxed tracking-wide border border-slate-700/50">
                    "{emergencyPlan.publicAnnouncement}"
                  </div>
                </div>
                <button className="mt-4 w-full glass-button-primary bg-emerald-600/80 hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  Broadcast to PA System
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Emergency;
