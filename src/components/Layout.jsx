// src/components/Layout.jsx
import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Menu, X, Sun, Moon, User, LogOut, GraduationCap, BookOpen, ChevronDown } from 'lucide-react';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Dark mode
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Check auth on every route change
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsLoggedIn(true);
      try { setCurrentUser(JSON.parse(user)); } catch { setCurrentUser(null); }
    } else {
      setIsLoggedIn(false);
      setCurrentUser(null);
    }
    setShowProfileDropdown(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) { root.classList.add('dark'); } else { root.classList.remove('dark'); }
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setShowProfileDropdown(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const getDashboardPath = () => {
    if (currentUser?.role === 'teacher') return '/teacherdashboard';
    return '/studentdashboard';
  };

  const getRoleLabel = () => {
    if (currentUser?.role === 'teacher') return 'Teacher';
    return 'Student';
  };

  const getRoleIcon = () => {
    if (currentUser?.role === 'teacher') return <BookOpen className="w-3.5 h-3.5" />;
    return <GraduationCap className="w-3.5 h-3.5" />;
  };

  // Check if we're on a dashboard page (hide navbar for student dashboard which has its own)
  const isStudentDashboard = location.pathname === '/studentdashboard';

  if (isStudentDashboard) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* Header */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
        <div className="container mx-auto px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 dark:shadow-none hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-outfit font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              StudyGeni
            </span>
          </Link>

          {/* ═══ Desktop Nav ═══ */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                {/* Dashboard Link */}
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all"
                >
                  {getRoleIcon()}
                  Dashboard
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white leading-tight">{currentUser?.username || "User"}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{getRoleLabel()}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showProfileDropdown ? "rotate-180" : ""}`} />
                  </button>

                  {showProfileDropdown && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setShowProfileDropdown(false)} />
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-40 overflow-hidden">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                          <p className="text-sm font-semibold text-slate-800 dark:text-white">{currentUser?.username || "User"}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser?.email || ""}</p>
                          <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                            {getRoleIcon()} {getRoleLabel()}
                          </span>
                        </div>
                        {/* Menu Items */}
                        <div className="py-1">
                          <Link
                            to={getDashboardPath()}
                            onClick={() => setShowProfileDropdown(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                          >
                            {getRoleIcon()} My Dashboard
                          </Link>
                        </div>
                        {/* Logout */}
                        <div className="border-t border-slate-100 dark:border-slate-700 py-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors w-full"
                          >
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Login
                </Link>
                <Link to="/signup">
                  <button className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white text-sm font-semibold shadow-md shadow-indigo-500/25 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                    Sign Up
                  </button>
                </Link>
              </>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm border border-slate-200/30 dark:border-slate-700/30"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* ═══ Mobile Controls ═══ */}
          <div className="flex items-center gap-3 md:hidden">
            {isLoggedIn && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ═══ Mobile Menu ═══ */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl transition-all">
            <div className="flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">{currentUser?.username || "User"}</p>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">{getRoleLabel()}</span>
                    </div>
                  </div>
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-2.5 px-4 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 font-medium text-sm"
                  >
                    {getRoleIcon()} My Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 py-2.5 px-4 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium text-sm w-full text-left mt-1"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center py-2.5 bg-indigo-600 rounded-xl text-white font-semibold shadow-md shadow-indigo-500/25 hover:bg-indigo-700 transition-colors">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Page content */}
      <main className="pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800/80 transition-colors duration-300">
        <div className="container mx-auto px-6 py-12 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-outfit font-extrabold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  StudyGeni
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                Empowering students and educators with AI-driven learning tools. Upload notes, compile summaries, and generate test prep quizzes in seconds.
              </p>
            </div>

            {/* Quick links column */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Platform</h4>
              <ul className="space-y-2 text-xs font-medium">
                <li>
                  <Link to="/" className="text-slate-600 dark:text-slate-350 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    Home Page
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-slate-600 dark:text-slate-350 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    Access Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="text-slate-600 dark:text-slate-350 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    Register Account
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support column */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Contact & Support</h4>
              <p className="text-xs text-slate-600 dark:text-slate-350 mb-2">Have questions or feedback? Reach out to us:</p>
              <a href="mailto:support@studygeni.ai" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                support@studygeni.ai
              </a>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-slate-400">
              © {new Date().getFullYear()} StudyGeni. All rights reserved.
            </p>
            <div className="flex gap-4 text-[11px] font-medium text-slate-400">
              <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Privacy Policy</a>
              <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
