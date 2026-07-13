import React, { useState, useEffect } from 'react';
import { Menu, Bell, Search, Settings, ShieldCheck, X, Monitor, BellRing, Globe, Moon, Wifi, Database, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const settingsSections = [
  {
    title: 'Display',
    icon: Monitor,
    items: [
      { label: 'Dark Mode', type: 'toggle', defaultOn: true },
      { label: 'Compact View', type: 'toggle', defaultOn: false },
      { label: 'Animations', type: 'toggle', defaultOn: true },
    ]
  },
  {
    title: 'Notifications',
    icon: BellRing,
    items: [
      { label: 'Security Alerts', type: 'toggle', defaultOn: true },
      { label: 'Medical Alerts', type: 'toggle', defaultOn: true },
      { label: 'Crowd Warnings', type: 'toggle', defaultOn: true },
    ]
  },
  {
    title: 'Data & Sync',
    icon: Wifi,
    items: [
      { label: 'Live Sensor Feed', type: 'toggle', defaultOn: true },
      { label: 'AI Auto-Analysis', type: 'toggle', defaultOn: false },
    ]
  }
];

const Toggle = ({ defaultOn }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${on ? 'bg-cyan-500' : 'bg-slate-700'}`}
    >
      <motion.div
        animate={{ x: on ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow"
      />
    </button>
  );
};

const Navbar = ({ onMenuClick }) => {
  const location = useLocation();
  const [time, setTime] = useState(new Date());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname.substring(1);
    if (!path) return 'Dashboard';
    return path.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <>
      <header className="glass-panel rounded-none border-t-0 border-x-0 sticky top-0 z-30 bg-[#06122a]/80">
        <div className="flex items-center justify-between px-4 md:px-6 h-20">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg text-cyan-500/70 hover:bg-cyan-900/30 hover:text-cyan-400 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex flex-col">
              <h1 className="text-2xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-300">
                {getPageTitle()}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">System Secure</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 flex-1 justify-end">
            {/* Live Clock */}
            <div className="hidden md:flex flex-col items-end">
              <span className="text-lg font-bold text-cyan-50 tracking-wider font-mono">
                {time.toLocaleTimeString('en-US', { hour12: false })}
              </span>
              <span className="text-[10px] text-cyan-500/70 uppercase font-black tracking-[0.2em]">
                {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>

            <div className="h-8 w-px bg-cyan-900/50 hidden md:block"></div>

            <div className="flex items-center gap-3">
              <div className="relative hidden md:block w-48 lg:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-600" />
                <input
                  type="text"
                  placeholder="Query system..."
                  className="glass-input w-full pl-9 py-1.5 text-sm"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 relative text-cyan-100 hover:text-white transition-colors bg-[#0a1936] rounded-xl border border-cyan-900/50 hover:border-cyan-500/50"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,1)] animate-ping"></span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
              </motion.button>

              <motion.button
                id="settings-btn"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-cyan-100 hover:text-white transition-colors bg-[#0a1936] rounded-xl border border-cyan-900/50 hover:border-cyan-500/50"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Panel Overlay */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="settings-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="fixed inset-0 bg-[#030914]/60 backdrop-blur-sm z-40"
            />

            {/* Panel */}
            <motion.div
              key="settings-panel"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-80 z-50 bg-[#06122a] border-l border-cyan-900/40 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-cyan-900/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                    <Settings className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="font-black text-slate-100 tracking-wide">System Settings</h2>
                    <p className="text-xs text-cyan-600 font-bold tracking-widest uppercase">Configuration</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-2 rounded-lg text-cyan-700 hover:text-cyan-400 hover:bg-cyan-900/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* System Info Bar */}
              <div className="mx-4 mt-4 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">All Systems Operational</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Backend · Sensors · AI Core</p>
                </div>
                <Database className="w-4 h-4 text-emerald-500/50" />
              </div>

              {/* Settings Sections */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 mt-2">
                {settingsSections.map((section) => {
                  const SectionIcon = section.icon;
                  return (
                    <div key={section.title}>
                      <div className="flex items-center gap-2 mb-3 px-1">
                        <SectionIcon className="w-4 h-4 text-cyan-500" />
                        <h3 className="text-[10px] font-black text-cyan-600 uppercase tracking-[0.2em]">{section.title}</h3>
                      </div>
                      <div className="space-y-1">
                        {section.items.map((item) => (
                          <div
                            key={item.label}
                            className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-800/40 border border-slate-700/40 hover:border-cyan-900/50 transition-colors"
                          >
                            <span className="text-sm font-medium text-slate-300">{item.label}</span>
                            <Toggle defaultOn={item.defaultOn} />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Version Info */}
                <div className="px-1 pt-2 border-t border-cyan-900/20">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>StadiumMind v1.0.0</span>
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" /> en-US
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-cyan-900/30">
                <button className="w-full py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-bold hover:bg-rose-500/20 transition-colors tracking-wide">
                  Reset to Defaults
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
