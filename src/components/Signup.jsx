import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { motion } from "framer-motion";
import { 
  Mail, Lock, ArrowRight, Eye, EyeOff, 
  Sparkles, Shield, CheckCircle, User,
  ChevronRight, Fingerprint, Globe, Zap,
  Send, Verified, AlertCircle
} from "lucide-react";

function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Send OTP
  const handleSendOTP = async () => {
    if (!email) {
      setError("Please enter your email first");
      return;
    }
    
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await API.post("/auth/signup/send-otp", {
        email,
        name: username || "User",
      });

      setSuccess(res.data.message || "OTP sent successfully!");
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await API.post("/auth/signup/verify-otp", {
        email,
        otp,
      });

      setSuccess(res.data.message || "Email verified successfully!");
      setOtpVerified(true);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      setError("Please verify your email with OTP first");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await API.post("/auth/signup", {
        username,
        email,
        password,
        role,
      });

      setSuccess(res.data.message || "Account created successfully!");
      
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 relative overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50/80 to-pink-100/80 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      
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
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 2 + "px",
              height: Math.random() * 4 + 2 + "px",
              background: `radial-gradient(circle, ${['#6366f1', '#8b5cf6', '#a78bfa', '#c084fc', '#818cf8', '#7c3aed', '#ec4899'][Math.floor(Math.random() * 7)]}50, transparent)`,
            }}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -(Math.random() * 120 + 60), (Math.random() * 120 + 60), -(Math.random() * 120 + 60)],
              x: [null, (Math.random() * 100 - 50), -(Math.random() * 100 - 50), (Math.random() * 100 - 50)],
              opacity: [0.1, 0.7, 0.1],
            }}
            transition={{
              duration: Math.random() * 15 + 8,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#6366f1_1px,_transparent_1px)] [background-size:30px_30px] opacity-[0.05]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative w-full max-w-sm sm:max-w-md z-10"
      >
        {/* Signup Card - Smaller size */}
        <div className="relative bg-gradient-to-br from-white via-white/95 to-indigo-50/80 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-800/80 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50 dark:border-slate-700 overflow-hidden">
          
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
            className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-500/20 via-purple-500/30 to-pink-500/20 blur-xl"
          />
          
          {/* Decorative top gradient bar */}
          <motion.div 
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-400 via-purple-400 via-pink-400 to-transparent"
          />
          
          {/* Floating gradient orbs inside card - smaller */}
          <div className="absolute -top-20 -right-20 w-36 h-36 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-36 h-36 bg-gradient-to-tr from-pink-200/30 to-purple-200/30 rounded-full blur-3xl" />
          
          {/* Corner decorations - smaller */}
          <div className="absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 border-indigo-300/40 rounded-tr-lg">
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full blur-sm" />
          </div>
          <div className="absolute bottom-3 left-3 w-10 h-10 border-b-2 border-l-2 border-pink-300/40 rounded-bl-lg">
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-tr from-pink-400 to-purple-400 rounded-full blur-sm" />
          </div>
          
          <div className="relative p-5 sm:p-7">
            {/* Logo and Header - Smaller */}
            <div className="text-center mb-4 sm:mb-5">
              <Link to="/" className="inline-flex items-center gap-2 mb-3 sm:mb-4 group">
                <motion.div 
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.8 }}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-200/50 group-hover:shadow-indigo-300/50 transition-all"
                >
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </motion.div>
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  StudyGeni
                </span>
              </Link>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-0.5">
                  Create Account
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Start your learning journey today
                </p>
              </motion.div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 p-2.5 bg-red-50/80 border border-red-200/80 rounded-lg flex items-center gap-2 text-red-600 text-xs backdrop-blur-sm"
              >
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Success Message */}
            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 p-2.5 bg-emerald-50/80 border border-emerald-200/80 rounded-lg flex items-center gap-2 text-emerald-600 text-xs backdrop-blur-sm"
              >
                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{success}</span>
              </motion.div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <label className="block text-[10px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-white/80 dark:bg-slate-800/80 border-2 border-slate-200/80 dark:border-slate-700 rounded-lg text-slate-700 dark:text-white text-xs sm:text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-0 focus:border-indigo-400 transition-all group-focus-within:shadow-lg group-focus-within:shadow-indigo-100/50"
                  />
                </div>
              </motion.div>

              {/* Email Field with OTP */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-[10px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={otpVerified}
                    className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-white/80 dark:bg-slate-800/80 border-2 border-slate-200/80 dark:border-slate-700 rounded-lg text-slate-700 dark:text-white text-xs sm:text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-0 focus:border-indigo-400 transition-all group-focus-within:shadow-lg group-focus-within:shadow-indigo-100/50 disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
                
                {/* OTP Controls - Responsive */}
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={otpVerified || isLoading || !email}
                    className="flex-1 min-w-[80px] py-1.5 sm:py-2 px-2 sm:px-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] sm:text-xs font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                  >
                    <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    {otpVerified ? 'Verified' : otpSent ? 'Resend' : 'Send OTP'}
                  </button>
                  
                  {otpSent && !otpVerified && (
                    <>
                      <input
                        type="text"
                        placeholder="OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="flex-1 min-w-[60px] py-1.5 sm:py-2 px-2 sm:px-3 bg-white/80 dark:bg-slate-800/80 border-2 border-slate-200/80 dark:border-slate-700 rounded-lg text-slate-700 dark:text-white text-xs sm:text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-0 focus:border-indigo-400 transition-all"
                        maxLength="6"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOTP}
                        disabled={isLoading || !otp}
                        className="py-1.5 sm:py-2 px-2 sm:px-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] sm:text-xs font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                      >
                        <Verified className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        Verify
                      </button>
                    </>
                  )}
                </div>

                {otpVerified && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-1 flex items-center gap-1 text-emerald-600 text-[10px] sm:text-xs font-medium"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Email verified!
                  </motion.div>
                )}
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-[10px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-9 py-2 sm:py-2.5 bg-white/80 dark:bg-slate-800/80 border-2 border-slate-200/80 dark:border-slate-700 rounded-lg text-slate-700 dark:text-white text-xs sm:text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-0 focus:border-indigo-400 transition-all group-focus-within:shadow-lg group-focus-within:shadow-indigo-100/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </motion.div>

              {/* Role Selection - Smaller */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
              >
                <label className="block text-[10px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  I am a
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "student", label: "Student", icon: "🎓" },
                    { value: "teacher", label: "Teacher", icon: "👨‍🏫" }
                  ].map((option) => (
                    <motion.button
                      key={option.value}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setRole(option.value)}
                      className={`p-2 sm:p-2.5 rounded-lg border-2 transition-all ${
                        role === option.value
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 shadow-md shadow-indigo-100 dark:shadow-none"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/80"
                      }`}
                    >
                      <div className="text-xl sm:text-2xl mb-0.5">{option.icon}</div>
                      <span className={`text-[10px] sm:text-xs font-medium ${
                        role === option.value ? "text-indigo-700 dark:text-indigo-400" : "text-slate-600 dark:text-slate-300"
                      }`}>
                        {option.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading || !otpVerified}
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-lg shadow-indigo-200/50 hover:shadow-indigo-300/50 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-3 sm:my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200/80"></div>
              </div>
              <div className="relative flex justify-center text-[10px] sm:text-xs">
                <span className="px-3 bg-gradient-to-r from-white via-white/95 to-indigo-50/80 text-slate-400">Secure Signup</span>
              </div>
            </div>

            {/* Login Link */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="text-center text-[10px] sm:text-xs text-slate-500"
            >
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-500 hover:text-indigo-600 font-semibold transition-colors group inline-flex items-center gap-0.5">
                Sign in here
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.p>

            {/* Trust indicators - Smaller */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-3 sm:mt-4 flex items-center justify-center gap-2 sm:gap-3"
            >
              <div className="flex items-center gap-1">
                <Fingerprint className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-400" />
                <span className="text-[8px] sm:text-[10px] text-slate-400 font-medium">Secure</span>
              </div>
              <div className="w-px h-3 bg-slate-200" />
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                <span className="text-[8px] sm:text-[10px] text-slate-400 font-medium">OTP Protected</span>
              </div>
              <div className="w-px h-3 bg-slate-200" />
              <div className="flex items-center gap-1">
                <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-400" />
                <span className="text-[8px] sm:text-[10px] text-slate-400 font-medium">Encrypted</span>
              </div>
            </motion.div>

            {/* Decorative text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="mt-2 sm:mt-3 text-center"
            >
              <p className="text-[8px] sm:text-[10px] text-slate-400/70 flex items-center justify-center gap-1.5">
                <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                Join 50,000+ learners worldwide
                <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-indigo-300" />
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Signup;