import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Download, FileText, Brain, Sparkles,
  Search, LogOut, GraduationCap, Clock, User,
  ChevronDown, Eye, Zap, TrendingUp, FolderOpen,
  Loader2, X, LayoutGrid, List, BookMarked,
  Home, Star, StarOff, Timer, Play, Pause,
  RotateCcw, Activity, ChevronRight, Settings,
  Bell, Menu, ChevronLeft, BarChart3, Target,
  Award, Calendar, Filter, Heart, Bookmark,
  CheckCircle, AlertCircle, Flame, Coffee
} from "lucide-react";

// ────────── localStorage helpers ──────────
const STORAGE_KEYS = {
  BOOKMARKS: "studygeni_bookmarks",
  ACTIVITY: "studygeni_activity",
  STUDY_STATS: "studygeni_study_stats",
  TIMER_TOTAL: "studygeni_timer_total",
};

const getStorage = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; }
  catch { return fallback; }
};
const setStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const addActivity = (action, detail) => {
  const activities = getStorage(STORAGE_KEYS.ACTIVITY, []);
  activities.unshift({ action, detail, timestamp: Date.now() });
  setStorage(STORAGE_KEYS.ACTIVITY, activities.slice(0, 30));
};

const getStats = () => getStorage(STORAGE_KEYS.STUDY_STATS, { quizzes: 0, summaries: 0, downloads: 0, views: 0 });
const incrementStat = (key) => {
  const stats = getStats();
  stats[key] = (stats[key] || 0) + 1;
  setStorage(STORAGE_KEYS.STUDY_STATS, stats);
};

// ────────── Main Component ──────────
export default function StudentDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [expandedFile, setExpandedFile] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Sidebar & Navigation
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  // Bookmarks
  const [bookmarks, setBookmarks] = useState(getStorage(STORAGE_KEYS.BOOKMARKS, []));

  // Activity
  const [activities] = useState(getStorage(STORAGE_KEYS.ACTIVITY, []));

  // Study Timer
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [pomodoroMode, setPomodoroMode] = useState("focus"); // focus | break
  const timerRef = useRef(null);

  // Stats
  const [stats, setStats] = useState(getStats());

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchFiles();
  }, [token, navigate]);

  // Timer logic
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  // Save timer total on stop
  useEffect(() => {
    if (!timerRunning && timerSeconds > 0) {
      const total = getStorage(STORAGE_KEYS.TIMER_TOTAL, 0);
      setStorage(STORAGE_KEYS.TIMER_TOTAL, total + timerSeconds);
    }
  }, [timerRunning]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await API.get("/files");
      setFiles(res.data.files || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDownload = (fileId, title) => {
    window.location.href = `${API.defaults.baseURL}/files/download/${fileId}`;
    incrementStat("downloads");
    addActivity("download", `Downloaded "${title}"`);
    setStats(getStats());
  };

  const handleViewPdf = (fileId, title) => {
    window.open(`${API.defaults.baseURL}/files/view/${fileId}`, "_blank");
    incrementStat("views");
    addActivity("view", `Viewed "${title}"`);
    setStats(getStats());
  };

  const handleSummary = (fileId, title) => {
    incrementStat("summaries");
    addActivity("summary", `Generated summary for "${title}"`);
    setStats(getStats());
    navigate(`/summary/${fileId}`);
  };

  const handleQuiz = (fileId, title) => {
    incrementStat("quizzes");
    addActivity("quiz", `Started quiz for "${title}"`);
    setStats(getStats());
    navigate(`/quiz/${fileId}`);
  };

  const toggleBookmark = (fileId) => {
    let updated;
    if (bookmarks.includes(fileId)) {
      updated = bookmarks.filter((id) => id !== fileId);
    } else {
      updated = [...bookmarks, fileId];
    }
    setBookmarks(updated);
    setStorage(STORAGE_KEYS.BOOKMARKS, updated);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Computed
  const subjects = ["All", ...new Set(files.map((f) => f.subject).filter(Boolean))];
  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "All" || file.subject === selectedSubject;
    const matchesBookmark = activeSection === "bookmarks" ? bookmarks.includes(file._id) : true;
    return matchesSearch && matchesSubject && matchesBookmark;
  });

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const formatTime = (s) => {
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    if (hrs > 0) return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const timeAgo = (timestamp) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const totalStudyMins = Math.floor((getStorage(STORAGE_KEYS.TIMER_TOTAL, 0) + timerSeconds) / 60);

  const getSubjectColor = (subject) => {
    const map = {
      Mathematics: "from-blue-500/15 to-cyan-500/15 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      Science: "from-emerald-500/15 to-teal-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
      Physics: "from-violet-500/15 to-purple-500/15 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800",
      Chemistry: "from-amber-500/15 to-orange-500/15 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
      English: "from-rose-500/15 to-pink-500/15 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800",
    };
    return map[subject] || "from-indigo-500/15 to-purple-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800";
  };

  // Sidebar nav items
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { id: "materials", label: "Study Materials", icon: <FolderOpen className="w-5 h-5" /> },
    { id: "bookmarks", label: "Bookmarks", icon: <Bookmark className="w-5 h-5" />, badge: bookmarks.length || null },
    { id: "activity", label: "Activity", icon: <Activity className="w-5 h-5" /> },
    { id: "timer", label: "Study Timer", icon: <Timer className="w-5 h-5" /> },
    { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
  ];

  const activityIcons = { download: <Download className="w-3.5 h-3.5" />, view: <Eye className="w-3.5 h-3.5" />, summary: <Sparkles className="w-3.5 h-3.5" />, quiz: <Brain className="w-3.5 h-3.5" /> };
  const activityColors = { download: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30", view: "text-blue-500 bg-blue-50 dark:bg-blue-950/30", summary: "text-amber-500 bg-amber-50 dark:bg-amber-950/30", quiz: "text-purple-500 bg-purple-50 dark:bg-purple-950/30" };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors flex">

      {/* ═══════════ SIDEBAR (Desktop) ═══════════ */}
      <aside className={`hidden lg:flex flex-col fixed top-0 left-0 h-full z-40 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-20 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
              StudyGeni
            </motion.span>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                activeSection === item.id
                  ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {item.icon}
              {sidebarOpen && <span className="flex-1 text-left">{item.label}</span>}
              {sidebarOpen && item.badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Collapse Button */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-sm"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            {sidebarOpen && "Collapse"}
          </button>
        </div>

        {/* Logout */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && "Logout"}
          </button>
        </div>
      </aside>

      {/* ═══════════ MOBILE HEADER ═══════════ */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileSidebarOpen(true)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
            <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">StudyGeni</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* ═══════════ MOBILE SIDEBAR OVERLAY ═══════════ */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileSidebarOpen(false)} className="fixed inset-0 bg-black/40 z-50 lg:hidden" />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", damping: 25 }} className="fixed top-0 left-0 h-full w-72 bg-white dark:bg-slate-900 z-50 lg:hidden shadow-2xl">
              <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">StudyGeni</span>
                <button onClick={() => setMobileSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5 text-slate-500" /></button>
              </div>
              <nav className="py-4 px-3 space-y-1">
                {navItems.map((item) => (
                  <button key={item.id} onClick={() => { setActiveSection(item.id); setMobileSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeSection === item.id ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}>
                    {item.icon}<span>{item.label}</span>
                    {item.badge && <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold">{item.badge}</span>}
                  </button>
                ))}
              </nav>
              <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-100 dark:border-slate-800">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 text-sm font-medium">
                  <LogOut className="w-5 h-5" />Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"} pt-16 lg:pt-0`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">

          {/* ────── DASHBOARD SECTION ────── */}
          {activeSection === "dashboard" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              {/* Welcome */}
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  {getGreeting()}, <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{user?.username || "Student"}</span> 👋
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Here&apos;s your learning overview</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
                {[
                  { label: "Materials", value: files.length, icon: <FolderOpen className="w-5 h-5" />, gradient: "from-indigo-500 to-purple-500", bg: "bg-indigo-50 dark:bg-indigo-950/30" },
                  { label: "Quizzes Taken", value: stats.quizzes, icon: <Brain className="w-5 h-5" />, gradient: "from-purple-500 to-pink-500", bg: "bg-purple-50 dark:bg-purple-950/30" },
                  { label: "Summaries", value: stats.summaries, icon: <Sparkles className="w-5 h-5" />, gradient: "from-amber-500 to-orange-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
                  { label: "Study Time", value: `${totalStudyMins}m`, icon: <Clock className="w-5 h-5" />, gradient: "from-emerald-500 to-teal-500", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
                ].map((stat, i) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className={`${stat.bg} rounded-2xl p-4 sm:p-5 border border-slate-200/50 dark:border-slate-800/50`}>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white mb-3 shadow-lg`}>
                      {stat.icon}
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions + Timer + Recent Activity Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                {/* Quick Actions */}
                <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500" /> Quick Actions</h3>
                  <div className="space-y-2">
                    {[
                      { label: "Browse Materials", icon: <FolderOpen className="w-4 h-4" />, action: () => setActiveSection("materials"), color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30" },
                      { label: "View Bookmarks", icon: <Bookmark className="w-4 h-4" />, action: () => setActiveSection("bookmarks"), color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30" },
                      { label: "Start Study Timer", icon: <Timer className="w-4 h-4" />, action: () => setActiveSection("timer"), color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30" },
                    ].map((a) => (
                      <button key={a.label} onClick={a.action} className={`w-full flex items-center gap-3 p-3 rounded-xl ${a.color} text-sm font-medium hover:opacity-80 transition-opacity`}>
                        {a.icon}<span>{a.label}</span><ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mini Timer */}
                <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200/50 dark:border-slate-700/50 shadow-sm flex flex-col items-center justify-center text-center">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2"><Timer className="w-4 h-4 text-emerald-500" /> Study Timer</h3>
                  <div className="text-4xl font-mono font-bold text-slate-800 dark:text-white mb-4">{formatTime(timerSeconds)}</div>
                  <div className="flex gap-2">
                    <button onClick={() => setTimerRunning(!timerRunning)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg transition-all ${timerRunning ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"}`}>
                      {timerRunning ? <><Pause className="w-4 h-4" />Pause</> : <><Play className="w-4 h-4" />Start</>}
                    </button>
                    <button onClick={() => { setTimerRunning(false); setTimerSeconds(0); }}
                      className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-blue-500" /> Recent Activity</h3>
                  {activities.length === 0 ? (
                    <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-6">No activity yet. Start learning!</p>
                  ) : (
                    <div className="space-y-2.5 max-h-44 overflow-y-auto">
                      {activities.slice(0, 5).map((act, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${activityColors[act.action] || "text-slate-500 bg-slate-50 dark:bg-slate-800"}`}>
                            {activityIcons[act.action] || <Activity className="w-3.5 h-3.5" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate">{act.detail}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500">{timeAgo(act.timestamp)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Materials Preview */}
              <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2"><BookOpen className="w-4 h-4 text-indigo-500" /> Recent Materials</h3>
                  <button onClick={() => setActiveSection("materials")} className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1">
                    View All <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                {loading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-indigo-500 animate-spin" /></div>
                ) : files.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-8">No study materials uploaded yet</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {files.slice(0, 6).map((file) => (
                      <div key={file._id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-colors cursor-pointer group"
                        onClick={() => { setActiveSection("materials"); setExpandedFile(file._id); }}>
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{file.title}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500">{file.subject || "General"}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-400 transition-colors" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ────── MATERIALS / BOOKMARKS SECTION ────── */}
          {(activeSection === "materials" || activeSection === "bookmarks") && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {activeSection === "bookmarks" ? "⭐ Bookmarked Materials" : "📚 Study Materials"}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {activeSection === "bookmarks" ? "Your saved study materials for quick access" : "All materials uploaded by your teachers"}
                </p>
              </div>

              {/* Search & Filter */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search materials..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all shadow-sm" />
                  {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-slate-400" /></button>}
                </div>
                <div className="relative">
                  <button onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-300 shadow-sm min-w-[140px]">
                    <Filter className="w-4 h-4 text-indigo-500" /><span className="flex-1 text-left">{selectedSubject}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showFilterDropdown ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {showFilterDropdown && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        className="absolute top-full mt-2 right-0 w-full min-w-[160px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden">
                        {subjects.map((s) => (
                          <button key={s} onClick={() => { setSelectedSubject(s); setShowFilterDropdown(false); }}
                            className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedSubject === s ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-medium" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"}`}>
                            {s}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                  <button onClick={() => setViewMode("grid")} className={`p-3 transition-colors ${viewMode === "grid" ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`}><LayoutGrid className="w-4 h-4" /></button>
                  <button onClick={() => setViewMode("list")} className={`p-3 transition-colors ${viewMode === "list" ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`}><List className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Files Grid */}
              {loading ? (
                <div className="flex flex-col items-center py-20"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" /><p className="text-sm text-slate-500">Loading...</p></div>
              ) : filteredFiles.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3"><FolderOpen className="w-8 h-8 text-slate-400" /></div>
                  <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">{activeSection === "bookmarks" ? "No bookmarks yet" : "No materials found"}</h3>
                  <p className="text-xs text-slate-500">{activeSection === "bookmarks" ? "Star materials to save them here" : "Try adjusting your search"}</p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-slate-500 mb-4">Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{filteredFiles.length}</span> material{filteredFiles.length !== 1 ? "s" : ""}</p>
                  <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "flex flex-col gap-3"}>
                    {filteredFiles.map((file, i) => (
                      <motion.div key={file._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                        className="group bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200/70 dark:border-slate-700/50 shadow-sm hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-800/50 transition-all overflow-hidden">
                        <div className={`bg-gradient-to-r ${getSubjectColor(file.subject).split(" ")[0]} ${getSubjectColor(file.subject).split(" ")[1]} p-5`}>
                          <div className="flex items-center justify-between mb-3">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white/60 dark:bg-slate-900/40 border ${getSubjectColor(file.subject)}`}>
                              <BookOpen className="w-3 h-3" />{file.subject || "General"}
                            </span>
                            <div className="flex items-center gap-2">
                              <button onClick={() => toggleBookmark(file._id)} className="p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors">
                                {bookmarks.includes(file._id) ? <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> : <Star className="w-4 h-4 text-slate-400" />}
                              </button>
                              <span className="text-[10px] text-slate-400">{file.createdAt ? new Date(file.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}</span>
                            </div>
                          </div>
                          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{file.title}</h3>
                          {file.description && <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">{file.description}</p>}
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center"><User className="w-2.5 h-2.5 text-white" /></div>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{file.createdBy?.name || "Teacher"}</span>
                          </div>
                        </div>
                        <div className="p-4">
                          <button onClick={() => setExpandedFile(expandedFile === file._id ? null : file._id)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium border border-indigo-100 dark:border-indigo-900/50 transition-all hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-950/50 dark:hover:to-purple-950/50">
                            <Zap className="w-4 h-4" />{expandedFile === file._id ? "Hide" : "Study Options"}
                            <ChevronDown className={`w-4 h-4 transition-transform ${expandedFile === file._id ? "rotate-180" : ""}`} />
                          </button>
                          <AnimatePresence>
                            {expandedFile === file._id && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="grid grid-cols-2 gap-2 mt-3">
                                  <button onClick={() => handleViewPdf(file._id, file.title)} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-200/50 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors"><Eye className="w-4 h-4" />View PDF</button>
                                  <button onClick={() => handleDownload(file._id, file.title)} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-200/50 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-colors"><Download className="w-4 h-4" />Download</button>
                                  <button onClick={() => handleSummary(file._id, file.title)} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 text-xs font-semibold border border-amber-200/50 dark:border-amber-800/50 hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-colors"><Sparkles className="w-4 h-4" />AI Summary</button>
                                  <button onClick={() => handleQuiz(file._id, file.title)} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 text-xs font-semibold border border-purple-200/50 dark:border-purple-800/50 hover:bg-purple-100 dark:hover:bg-purple-950/50 transition-colors"><Brain className="w-4 h-4" />Start Quiz</button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* ────── ACTIVITY SECTION ────── */}
          {activeSection === "activity" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">📊 Activity Feed</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Your complete learning history</p>
              {activities.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                  <Activity className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-700 dark:text-slate-300">No activity yet</h3>
                  <p className="text-xs text-slate-500 mt-1">Start learning to build your activity feed!</p>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
                  {activities.map((act, i) => (
                    <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${activityColors[act.action] || "text-slate-500 bg-slate-50 dark:bg-slate-800"}`}>
                        {activityIcons[act.action] || <Activity className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{act.detail}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{timeAgo(act.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ────── TIMER SECTION ────── */}
          {activeSection === "timer" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 text-center">⏱️ Study Timer</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 text-center">Stay focused and track your study sessions</p>

              <div className="bg-white dark:bg-slate-800/60 rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg text-center">
                {/* Timer Display */}
                <div className="relative w-52 h-52 mx-auto mb-8">
                  <svg className="w-52 h-52 -rotate-90" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-100 dark:text-slate-700" />
                    {timerRunning && (
                      <motion.circle cx="100" cy="100" r="88" fill="none" strokeWidth="6" strokeLinecap="round"
                        className="text-indigo-500" style={{ strokeDasharray: `${2 * Math.PI * 88}` }}
                        animate={{ strokeDashoffset: [2 * Math.PI * 88, 0] }}
                        transition={{ duration: 60, repeat: Infinity, ease: "linear" }} />
                    )}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-mono font-bold text-slate-800 dark:text-white">{formatTime(timerSeconds)}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-wider font-semibold">
                      {timerRunning ? "Studying..." : "Ready"}
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-3">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setTimerRunning(!timerRunning)}
                    className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl text-white font-semibold shadow-xl transition-all ${timerRunning ? "bg-gradient-to-r from-red-500 to-rose-500 shadow-red-500/20" : "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-500/20"}`}>
                    {timerRunning ? <><Pause className="w-5 h-5" />Pause</> : <><Play className="w-5 h-5" />Start</>}
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setTimerRunning(false); setTimerSeconds(0); }}
                    className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                    <RotateCcw className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Total Study Time */}
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Total Study Time</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">{totalStudyMins} minutes</p>
                </div>
              </div>

              {/* Tips */}
              <div className="mt-6 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-900/50">
                <h4 className="text-sm font-bold text-indigo-700 dark:text-indigo-400 mb-2 flex items-center gap-2"><Coffee className="w-4 h-4" /> Study Tips</h4>
                <ul className="text-xs text-indigo-600/80 dark:text-indigo-400/80 space-y-1.5">
                  <li>• Focus for 25 minutes, then take a 5-minute break (Pomodoro)</li>
                  <li>• Stay hydrated and avoid distractions</li>
                  <li>• Review AI summaries before taking quizzes</li>
                </ul>
              </div>
            </motion.div>
          )}

          {/* ────── PROFILE SECTION ────── */}
          {activeSection === "profile" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">👤 My Profile</h1>

              <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-center text-white">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 border-2 border-white/30">
                    <User className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-bold">{user?.username || "Student"}</h2>
                  <p className="text-white/80 text-sm mt-1">{user?.email || "student@studygeni.com"}</p>
                  <span className="inline-block mt-3 px-4 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm">🎓 Student</span>
                </div>

                {/* Stats */}
                <div className="p-6">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Learning Statistics</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Materials", value: files.length, icon: <FolderOpen className="w-4 h-4 text-indigo-500" /> },
                      { label: "Quizzes", value: stats.quizzes, icon: <Brain className="w-4 h-4 text-purple-500" /> },
                      { label: "Summaries", value: stats.summaries, icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
                      { label: "Downloads", value: stats.downloads, icon: <Download className="w-4 h-4 text-emerald-500" /> },
                    ].map((s) => (
                      <div key={s.label} className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 text-center">
                        <div className="flex justify-center mb-2">{s.icon}</div>
                        <p className="text-xl font-bold text-slate-800 dark:text-white">{s.value}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Study Time */}
                  <div className="mt-6 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white"><Clock className="w-6 h-6" /></div>
                    <div>
                      <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Total Study Time</p>
                      <p className="text-2xl font-bold text-slate-800 dark:text-white">{totalStudyMins} minutes</p>
                    </div>
                  </div>

                  {/* Bookmarks count */}
                  <div className="mt-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white"><Star className="w-6 h-6" /></div>
                    <div>
                      <p className="text-sm font-bold text-amber-700 dark:text-amber-400">Bookmarked Materials</p>
                      <p className="text-2xl font-bold text-slate-800 dark:text-white">{bookmarks.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}