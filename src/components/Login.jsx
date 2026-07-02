import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { motion } from "framer-motion";
import { 
  Mail, Lock, ArrowRight, Eye, EyeOff, 
  Sparkles, Shield, CheckCircle,
  ChevronRight, Fingerprint, Globe, Zap,
  GraduationCap, BookOpen, Rocket, Brain,
  Award, Users, BarChart3, Clock, 
  Sun, Cloud, Star, Palette, 
  TrendingUp, Target, Compass
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "teacher") {
        navigate("/teacherdashboard");
      } else {
        navigate("/studentdashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50/80 to-pink-100/80 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 2, 1],
            opacity: [0.2, 0.5, 0.2],
            x: [0, 120, 0],
            y: [0, -80, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] right-[-20%] w-[800px] h-[800px] bg-gradient-to-br from-indigo-400/40 via-purple-400/30 to-transparent rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{ 
            scale: [1, 1.8, 1],
            opacity: [0.2, 0.45, 0.2],
            x: [0, -100, 0],
            y: [0, 80, 0]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-[-20%] left-[-20%] w-[750px] h-[750px] bg-gradient-to-tr from-pink-400/30 via-purple-400/30 to-transparent rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{ 
            scale: [1, 1.6, 1],
            opacity: [0.15, 0.4, 0.15],
            x: [0, 80, 0],
            y: [0, 60, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-gradient-to-r from-blue-400/30 via-indigo-400/30 to-purple-400/30 rounded-full blur-3xl"
        />

        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 5 + 2 + "px",
              height: Math.random() * 5 + 2 + "px",
              background: `radial-gradient(circle, ${['#6366f1', '#8b5cf6', '#a78bfa', '#c084fc', '#818cf8', '#7c3aed', '#ec4899'][Math.floor(Math.random() * 7)]}50, transparent)`,
            }}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -(Math.random() * 150 + 80), (Math.random() * 150 + 80), -(Math.random() * 150 + 80)],
              x: [null, (Math.random() * 120 - 60), -(Math.random() * 120 - 60), (Math.random() * 120 - 60)],
              opacity: [0.1, 0.8, 0.1],
            }}
            transition={{
              duration: Math.random() * 18 + 10,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#6366f1_1px,_transparent_1px)] [background-size:30px_30px] opacity-[0.05]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-md z-10"
      >
        {/* Unique Login Card - Gradient Glass Design */}
        <div className="relative bg-gradient-to-br from-white via-white/95 to-indigo-50/80 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-800/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 dark:border-slate-700 overflow-hidden">
          
          {/* Animated gradient border glow */}
          <motion.div
            animate={{
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-purple-500/30 to-pink-500/20 blur-xl"
          />
          
          {/* Decorative top gradient bar with animation */}
          <motion.div 
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-indigo-400 via-purple-400 via-pink-400 to-transparent"
          />
          
          {/* Floating gradient orbs inside card */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-pink-200/30 to-purple-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-100/20 via-purple-100/20 to-pink-100/20 rounded-full blur-3xl" />
          
          {/* Corner decorations with glow */}
          <div className="absolute top-4 right-4 w-14 h-14 border-t-2 border-r-2 border-indigo-300/40 rounded-tr-xl">
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full blur-sm" />
          </div>
          <div className="absolute bottom-4 left-4 w-14 h-14 border-b-2 border-l-2 border-pink-300/40 rounded-bl-xl">
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-tr from-pink-400 to-purple-400 rounded-full blur-sm" />
          </div>
          
          <div className="relative p-8">
            {/* Logo and Header with unique styling */}
            <div className="text-center mb-7">
              <Link to="/" className="inline-flex items-center gap-3 mb-4 group">
                <motion.div 
                  whileHover={{ rotate: 360, scale: 1.15 }}
                  transition={{ duration: 0.8 }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-200/50 group-hover:shadow-indigo-300/50 transition-all"
                >
                  <Sparkles className="w-7 h-7 text-white" />
                </motion.div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  StudyGeni
                </span>
              </Link>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">
                  Welcome Back
                </h2>
                <p className="text-sm text-slate-500">
                  Sign in to continue your learning journey
                </p>
              </motion.div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50/80 border border-red-200/80 rounded-xl flex items-center gap-2 text-red-600 text-sm backdrop-blur-sm"
              >
                <Shield className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-slate-800/80 border-2 border-slate-200/80 dark:border-slate-700 rounded-xl text-slate-700 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-0 focus:border-indigo-400 transition-all group-focus-within:shadow-lg group-focus-within:shadow-indigo-100/50"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-11 py-3 bg-white/80 dark:bg-slate-800/80 border-2 border-slate-200/80 dark:border-slate-700 rounded-xl text-slate-700 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-0 focus:border-indigo-400 transition-all group-focus-within:shadow-lg group-focus-within:shadow-indigo-100/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                </div>
              </motion.div>

              {/* Remember me & Forgot password */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="flex items-center justify-between text-xs"
              >
                <label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-offset-0 transition-all" />
                  Remember me
                </label>
                <a href="#" className="text-indigo-500 hover:text-indigo-600 font-semibold transition-colors flex items-center gap-0.5 group">
                  Forgot password?
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </motion.div>

              {/* Submit Button with unique design */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-200/50 hover:shadow-indigo-300/50 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider with unique style */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200/80"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-gradient-to-r from-white via-white/95 to-indigo-50/80 text-slate-400">Secure Login</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="text-center text-xs text-slate-500 mt-5"
            >
              Don't have an account?{" "}
              <Link to="/signup" className="text-indigo-500 hover:text-indigo-600 font-semibold transition-colors group inline-flex items-center gap-0.5">
                Create one now
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.p>

            {/* Trust indicators with unique style */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
              className="mt-4 flex items-center justify-center gap-3"
            >
              <div className="flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[10px] text-slate-400 font-medium">Secure</span>
              </div>
              <div className="w-px h-3 bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] text-slate-400 font-medium">OTP Protected</span>
              </div>
              <div className="w-px h-3 bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-[10px] text-slate-400 font-medium">Encrypted</span>
              </div>
            </motion.div>

            {/* Decorative text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
              className="mt-3 text-center"
            >
              <p className="text-[10px] text-slate-400/70 flex items-center justify-center gap-1.5">
                <Globe className="w-3 h-3" />
                Trusted by 50,000+ learners worldwide
                <Zap className="w-3 h-3 text-indigo-300" />
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;