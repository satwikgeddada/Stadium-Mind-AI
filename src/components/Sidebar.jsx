import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Bot, AlertTriangle, BarChart3, X, Navigation, UserCheck, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';

const navGroups = [
  {
    role: "Organizers",
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Analytics', path: '/analytics', icon: BarChart3 }
    ]
  },
  {
    role: "Fans",
    items: [
      { name: 'Smart Navigation', path: '/smart-navigation', icon: Navigation },
      { name: 'AI Assistant', path: '/ai-assistant', icon: Bot }
    ]
  },
  {
    role: "Volunteers",
    items: [
      { name: 'Task Assignment', path: '/volunteers', icon: UserCheck }
    ]
  },
  {
    role: "Security",
    items: [
      { name: 'Incident Response', path: '/emergency', icon: AlertTriangle, color: 'text-rose-500' }
    ]
  }
];

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const location = useLocation();

  const sidebarContent = (
    <div className="h-full flex flex-col glass-panel border-y-0 border-l-0 rounded-none w-64 lg:w-72 bg-[#030914]/90">
      <div className="flex items-center justify-between p-6 border-b border-cyan-900/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-black flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <img src={logo} alt="FIFA Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
              FIFA
            </span>
            <span className="text-[10px] font-bold tracking-[0.3em] text-cyan-500 -mt-1">
              COMMAND
            </span>
          </div>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden text-cyan-700 hover:text-cyan-400 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 scroll-smooth">
        <nav className="space-y-6">
          {navGroups.map((group) => (
            <div key={group.role}>
              <h3 className="px-4 text-[10px] font-black text-cyan-700 uppercase tracking-[0.2em] mb-2">{group.role}</h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={() =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group ${
                          isActive 
                            ? 'text-cyan-50' 
                            : 'text-cyan-700 hover:text-cyan-100 hover:bg-cyan-900/20'
                        }`
                      }
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="sidebar-active"
                          className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-500/10 border border-cyan-500/30 rounded-xl shadow-[inset_0_0_20px_rgba(6,182,212,0.1)]"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                      )}
                      
                      <Icon className={`w-5 h-5 relative z-10 ${item.color || ''} ${isActive && !item.color ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : ''}`} />
                      <span className={`font-bold tracking-wide relative z-10 text-sm ${isActive ? 'drop-shadow-md' : ''}`}>{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
      
      <div className="p-6 border-t border-cyan-900/30">
        <div className="bg-[#06122a] border border-cyan-900/50 rounded-xl p-4 flex items-center gap-3 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div className="w-10 h-10 rounded-lg bg-blue-900/50 border border-blue-500/30 flex items-center justify-center shrink-0 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-500/20"></div>
            <span className="text-sm font-black text-blue-300 relative z-10">OP</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-cyan-100 truncate uppercase tracking-wider">Operator Alpha</p>
            <p className="text-xs font-bold text-cyan-600 tracking-widest truncate">SYS ADMIN</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block h-full z-20 shrink-0">
        {sidebarContent}
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#030914]/90 backdrop-blur-md z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
