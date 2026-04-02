import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Plus, 
  Clock, 
  Zap,
  LayoutGrid,
  Settings,
  LogOut,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  Timer,
  Flag,
  Settings2,
  Check
} from 'lucide-react';

const App = () => {
  // --- UI & Global States ---
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' or 'stopwatch'
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingMode, setIsSettingMode] = useState(false);
  
  // --- Shared Task State ---
  const [tasks, setTasks] = useState([
    { id: 1, text: "Finalize Azero branding kit", completed: false },
    { id: 2, text: "Review animation keyframes", completed: true },
    { id: 3, text: "Update portfolio site", completed: false },
  ]);
  const [newTask, setNewTask] = useState("");

  // --- Pomodoro States (Dashboard) ---
  const [customTimes, setCustomTimes] = useState({ pomodoro: 25, short: 5, long: 15 });
  const [pomoMinutes, setPomoMinutes] = useState(25);
  const [pomoSeconds, setPomoSeconds] = useState(0);
  const [pomoActive, setPomoActive] = useState(false);
  const [pomoMode, setPomoMode] = useState('pomodoro');
  const [sessions, setSessions] = useState(0);

  // --- Stopwatch States ---
  const [swTime, setSwTime] = useState(0); 
  const [swActive, setSwActive] = useState(false);
  const [laps, setLaps] = useState([]);
  const swRef = useRef(null);

  // --- Timer Logic (Pomodoro) ---
  useEffect(() => {
    let interval = null;
    if (pomoActive) {
      interval = setInterval(() => {
        if (pomoSeconds > 0) {
          setPomoSeconds(pomoSeconds - 1);
        } else if (pomoMinutes > 0) {
          setPomoMinutes(pomoMinutes - 1);
          setPomoSeconds(59);
        } else {
          setPomoActive(false);
          setSessions(s => s + 1);
          clearInterval(interval);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pomoActive, pomoMinutes, pomoSeconds]);

  useEffect(() => {
    if (!pomoActive) {
      setPomoMinutes(customTimes[pomoMode]);
      setPomoSeconds(0);
    }
  }, [pomoMode, customTimes, pomoActive]);

  // --- Stopwatch Logic ---
  useEffect(() => {
    if (swActive) {
      swRef.current = setInterval(() => {
        setSwTime(prev => prev + 10);
      }, 10);
    } else {
      clearInterval(swRef.current);
    }
    return () => clearInterval(swRef.current);
  }, [swActive]);

  // --- Helper Functions ---
  const formatStopwatch = (ms) => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return { h: String(h).padStart(2, '0'), m: String(m).padStart(2, '0'), s: String(s).padStart(2, '0'), cs: String(cs).padStart(2, '0') };
  };

  const setTaskComplete = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));
  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([{ id: Date.now(), text: newTask, completed: false }, ...tasks]);
    setNewTask("");
  };

  // Progress Circle for Pomodoro
  const totalPomoSec = customTimes[pomoMode] * 60;
  const currPomoSec = pomoMinutes * 60 + pomoSeconds;
  const pomoProgress = totalPomoSec > 0 ? ((totalPomoSec - currPomoSec) / totalPomoSec) * 283 : 0;

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;1,400&display=swap');
          :root { --app-font: 'Instrument Serif', serif; }
          .app-font { font-family: var(--app-font); }
          .hide-arrows::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        `}
      </style>

      <div className="h-screen w-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 app-font flex overflow-hidden transition-colors duration-500">
        
        {/* SIDEBAR */}
        <aside className={`${isSidebarOpen ? 'w-56' : 'w-20'} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col py-6 transition-all duration-300 relative overflow-hidden`}>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="absolute -right-0 top-10 w-6 h-10 bg-white dark:bg-slate-900 border-y border-l border-slate-200 dark:border-slate-800 rounded-l-md flex items-center justify-center text-slate-400 hover:text-blue-600 shadow-sm z-50">
            {isSidebarOpen ? <PanelLeftClose size={12} /> : <PanelLeftOpen size={12} />}
          </button>

          <div className={`px-5 mb-10 flex items-center gap-3 ${!isSidebarOpen && 'justify-center px-0'}`}>
            <div className="min-w-[32px] h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-lg shadow-lg">A</div>
            <h1 className={`font-bold text-xl transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>Azero</h1>
          </div>

          <nav className="flex-grow px-3 space-y-1">
            <NavItem icon={<LayoutGrid size={18}/>} label="Dashboard" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} isOpen={isSidebarOpen} />
            <NavItem icon={<Timer size={18}/>} label="Stopwatch" active={currentView === 'stopwatch'} onClick={() => setCurrentView('stopwatch')} isOpen={isSidebarOpen} />
            <NavItem icon={<Clock size={18}/>} label="History" isOpen={isSidebarOpen} />
            <NavItem icon={<Settings size={18}/>} label="Settings" isOpen={isSidebarOpen} />
          </nav>

          <div className="px-3 mt-auto space-y-1">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${!isSidebarOpen ? 'justify-center' : ''} ${isDarkMode ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-600'}`}>
              <span className="flex-shrink-0">{isDarkMode ? <Sun size={18} /> : <Moon size={18} />}</span>
              <span className={`text-sm transition-all duration-300 ${isSidebarOpen ? 'opacity-100 font-light' : 'opacity-0 w-0 overflow-hidden'}`}>Theme</span>
            </button>
            <button className={`w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-red-500 rounded-xl ${!isSidebarOpen ? 'justify-center' : ''}`}>
              <span className="flex-shrink-0"><LogOut size={18} /></span>
              <span className={`text-sm transition-all duration-300 ${isSidebarOpen ? 'opacity-100 font-light' : 'opacity-0 w-0 overflow-hidden'}`}>Logout</span>
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-grow flex flex-col p-6 overflow-hidden">
          <header className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold leading-tight">{currentView === 'dashboard' ? 'Focus Hub' : 'Time Tracker'}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-light italic">
                {currentView === 'dashboard' ? `Session count: ${sessions}` : 'Monitor your actual workflow duration.'}
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 pr-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-inner">Z</div>
              <div className="text-left leading-none">
                <p className="text-xs font-bold">Azero</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-light">Freelance</p>
              </div>
            </div>
          </header>

          <div className="flex-grow grid grid-cols-12 gap-6 min-h-0">
            
            {/* VIEW SWITCHER CONTENT */}
            <section className="col-span-7 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center relative overflow-hidden transition-colors px-6">
              
              {currentView === 'dashboard' ? (
                /* --- POMODORO VIEW --- */
                <>
                  <button onClick={() => setIsSettingMode(!isSettingMode)} className={`absolute top-6 right-6 p-1.5 rounded-lg transition-all ${isSettingMode ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                    {isSettingMode ? <Check size={14} /> : <Settings2 size={14} />}
                  </button>

                  {!isSettingMode && (
                    <div className="absolute top-6 flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg z-10">
                      {['pomodoro', 'short', 'long'].map(k => (
                        <button key={k} onClick={() => switchMode(k)} className={`px-3 py-1 rounded text-[10px] transition-all ${pomoMode === k ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400 font-light'}`}>
                          {k === 'pomodoro' ? 'Focus' : k === 'short' ? 'Short' : 'Long'}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="relative flex items-center justify-center w-full max-w-[280px]">
                    {isSettingMode ? (
                      <div className="flex flex-col items-center gap-4 py-8 w-full animate-in fade-in duration-300">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Duration Setup (Min)</h4>
                        <div className="grid grid-cols-3 gap-4 w-full px-4">
                          {Object.keys(customTimes).map(k => (
                            <div key={k} className="flex flex-col items-center gap-1.5">
                              <label className="text-[8px] font-bold uppercase text-slate-500 tracking-wider">{(k)}</label>
                              <input type="number" value={customTimes[k]} onChange={(e) => setCustomTimes({...customTimes, [k]: parseInt(e.target.value)||0})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-center text-sm font-bold py-2.5 focus:ring-1 focus:ring-blue-500 hide-arrows transition-all" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        <svg className="w-44 h-44 lg:w-52 lg:h-52 transform -rotate-90">
                          <circle cx="50%" cy="50%" r="45%" className="stroke-slate-50 dark:stroke-slate-800" strokeWidth="2" fill="transparent" />
                          <circle cx="50%" cy="50%" r="45%" style={{ strokeDasharray: 283, strokeDashoffset: 283 - pomoProgress }} stroke={pomoMode === 'pomodoro' ? '#2563eb' : pomoMode === 'short' ? '#10b981' : '#0ea5e9'} strokeWidth="3" fill="transparent" strokeLinecap="round" className="transition-all duration-1000 ease-linear shadow-lg" />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-6xl lg:text-7xl font-bold tracking-tighter tabular-nums text-slate-900 dark:text-white leading-none">{String(pomoMinutes).padStart(2,'0')}:{String(pomoSeconds).padStart(2,'0')}</span>
                          <div className={`mt-2 px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-[0.2em] text-white ${pomoActive ? 'bg-blue-600 animate-pulse' : 'bg-slate-400 dark:bg-slate-600'}`}>{pomoActive ? 'Live' : 'Ready'}</div>
                        </div>
                      </>
                    )}
                  </div>
                  {!isSettingMode && (
                    <div className="mt-6 flex items-center gap-3">
                      <button onClick={resetTimer} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700 hover:text-blue-600"><RotateCcw size={14}/></button>
                      <button onClick={toggleTimer} className={`h-10 w-32 rounded-lg flex items-center justify-center gap-2.5 transition-all active:scale-95 text-[10px] font-bold tracking-widest ${pomoActive ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900' : 'bg-blue-600 text-white shadow-xl shadow-blue-500/20'}`}>
                        {pomoActive ? <Pause size={14} fill="currentColor"/> : <Play size={14} fill="currentColor"/>} {pomoActive ? 'PAUSE' : 'START'}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* --- STOPWATCH VIEW --- */
                <div className="flex flex-col items-center w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-end gap-1 mb-8">
                    <span className="text-7xl lg:text-8xl font-bold tracking-tighter tabular-nums text-slate-900 dark:text-white leading-none">
                      {formatStopwatch(swTime).h > 0 ? `${formatStopwatch(swTime).h}:` : ''}{formatStopwatch(swTime).m}:{formatStopwatch(swTime).s}
                    </span>
                    <span className="text-3xl lg:text-4xl font-light text-blue-600 dark:text-blue-400 mb-2 tabular-nums">.{formatStopwatch(swTime).cs}</span>
                  </div>
                  <div className="flex items-center gap-5">
                    <button onClick={() => {setSwTime(0); setLaps([]); setSwActive(false);}} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-800 hover:text-blue-600 active:scale-90"><RotateCcw size={20}/></button>
                    <button onClick={() => setSwActive(!swActive)} className={`h-14 w-40 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 text-sm font-bold tracking-widest shadow-lg ${swActive ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900' : 'bg-blue-600 text-white shadow-blue-500/20'}`}>
                      {swActive ? <Pause size={20} fill="currentColor"/> : <Play size={20} fill="currentColor"/>} {swActive ? 'PAUSE' : 'START'}
                    </button>
                    <button onClick={() => swActive && setLaps([swTime, ...laps])} disabled={!swActive && swTime === 0} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-800 hover:text-blue-600 disabled:opacity-20 active:scale-90"><Flag size={20}/></button>
                  </div>
                  <div className="mt-10 w-full max-w-sm h-32 overflow-y-auto custom-scrollbar px-2">
                    {laps.map((lap, i) => {
                      const f = formatStopwatch(lap);
                      return (
                        <div key={i} className="flex justify-between py-2 border-b border-slate-50 dark:border-slate-800/50 last:border-0 text-sm">
                          <span className="text-slate-400 font-light">Lap {laps.length - i}</span>
                          <span className="font-bold tabular-nums">{f.h>0?`${f.h}:`:''}{f.m}:{f.s}.<span className="text-xs text-blue-500">{f.cs}</span></span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>

            {/* SHARED TASKS CARD */}
            <section className="col-span-5 flex flex-col min-h-0 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm p-6 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold dark:text-white uppercase tracking-tight">Active Tasks</h3>
                <span className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full font-bold tracking-widest uppercase">
                  {tasks.filter(t => t.completed).length}/{tasks.length} Done
                </span>
              </div>

              <form onSubmit={addTask} className="mb-6 relative">
                <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Drop a task..." className="w-full pl-4 pr-12 py-3.5 bg-slate-50 dark:bg-slate-800 border-none dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500/20 text-sm font-light transition-all" />
                <button type="submit" className="absolute right-1.5 top-1.5 h-10 w-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-all shadow-md active:scale-95"><Plus size={18}/></button>
              </form>

              <div className="flex-grow overflow-y-auto pr-1 custom-scrollbar space-y-2">
                {tasks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-10 py-10"><Zap size={32}/><p className="text-[10px] font-bold uppercase tracking-widest mt-2">All tasks completed</p></div>
                ) : (
                  tasks.map(task => (
                    <div key={task.id} className={`group flex items-center justify-between p-3.5 rounded-xl transition-all border ${task.completed ? 'bg-slate-50 dark:bg-slate-800/30 border-transparent opacity-50' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-blue-100/50 shadow-sm'}`}>
                      <div className="flex items-center gap-3 overflow-hidden">
                        <button onClick={() => setTaskComplete(task.id)} className={`flex-shrink-0 transition-all ${task.completed ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-700 hover:text-blue-500'}`}>{task.completed ? <CheckCircle2 size={20}/> : <Circle size={20}/>}</button>
                        <span className={`text-[14px] truncate ${task.completed ? 'line-through text-slate-400 font-light' : 'text-slate-700 dark:text-slate-200 font-bold'}`}>{task.text}</span>
                      </div>
                      <button onClick={() => deleteTask(task.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all ml-2 flex-shrink-0"><Trash2 size={16}/></button>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </main>

        <style dangerouslySetInnerHTML={{ __html: `
          .custom-scrollbar::-webkit-scrollbar { width: 3px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
          .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
        `}} />
      </div>
    </div>
  );

  function switchMode(newMode) {
    setPomoMode(newMode);
    setPomoActive(false);
    setPomoMinutes(customTimes[newMode]);
    setPomoSeconds(0);
  }
  function resetTimer() {
    setPomoActive(false);
    setPomoMinutes(customTimes[pomoMode]);
    setPomoSeconds(0);
  }
  function toggleTimer() { setPomoActive(!pomoActive); }
};

const NavItem = ({ icon, label, active = false, isOpen = true, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${active ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 font-bold shadow-sm' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-light'} ${!isOpen && 'justify-center'}`}>
    <span className="flex-shrink-0">{icon}</span>
    <span className={`text-sm uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>{label}</span>
  </button>
);

export default App;
