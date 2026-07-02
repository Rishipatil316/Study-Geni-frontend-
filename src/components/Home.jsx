import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles, FileText, BookOpen, Users, Zap, Shield,
  Upload, Bot, BarChart3, Star, Lock,
  Share2, TrendingUp, Award, ChevronRight, Menu, X,
  Mail, ArrowRight, CheckCircle, Play, Quote,
  Target, Brain
} from 'lucide-react';
import {
  FaRobot,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaRegCommentDots,
  FaTwitter,
  FaGithub,
  FaLinkedin
} from 'react-icons/fa';

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { icon: <Sparkles size={24} />, title: "AI Summary Generator", desc: "Generate instant smart summaries from any study material with advanced NLP", color: "from-indigo-500 to-purple-500", bg: "from-indigo-50 to-purple-50" },
    { icon: <Share2 size={24} />, title: "Smart Notes Sharing", desc: "Share notes seamlessly with classmates and teachers in real-time", color: "from-blue-500 to-cyan-500", bg: "from-blue-50 to-cyan-50" },
    { icon: <FaRegCommentDots size={24} />, title: "Interactive Quizzes", desc: "Create and attempt AI-powered adaptive quizzes with instant feedback", color: "from-emerald-500 to-teal-500", bg: "from-emerald-50 to-teal-50" },
    { icon: <FileText size={24} />, title: "PDF Learning Hub", desc: "Centralized PDF library with smart organization and search", color: "from-rose-500 to-pink-500", bg: "from-rose-50 to-pink-50" },
    { icon: <FaUserGraduate size={24} />, title: "Student Workspace", desc: "Personalized dashboard for effective learning and progress tracking", color: "from-violet-500 to-purple-500", bg: "from-violet-50 to-purple-50" },
    { icon: <FaChalkboardTeacher size={24} />, title: "Teacher Workspace", desc: "Manage classes, upload materials, track student progress", color: "from-orange-500 to-amber-500", bg: "from-orange-50 to-amber-50" },
    { icon: <Lock size={24} />, title: "OTP Authentication", desc: "Secure email-based OTP verification for account safety", color: "from-slate-500 to-gray-500", bg: "from-slate-50 to-gray-50" },
    { icon: <Users size={24} />, title: "Academic Collaboration", desc: "Real-time discussions, group studies, and peer learning", color: "from-cyan-500 to-blue-500", bg: "from-cyan-50 to-blue-50" }
  ];

  const testimonials = [
    { name: "Dr. Sarah Johnson", role: "Medical Student, Harvard", rating: 5, text: "StudyGeni transformed how I prepare for exams. The AI summaries save me hours daily and help me grasp complex topics instantly.", image: "https://randomuser.me/api/portraits/women/68.jpg" },
    { name: "Prof. Michael Chen", role: "Computer Science, Stanford", rating: 5, text: "My students' engagement skyrocketed after adopting StudyGeni. The collaboration features and AI summaries are revolutionary.", image: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Emily Rodriguez", role: "Engineering Student, MIT", rating: 5, text: "Best learning platform I've ever used. The quiz system adapts to my weak areas and helps me improve consistently.", image: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "Dr. James Wilson", role: "Physics Professor, Oxford", rating: 5, text: "A game-changer for education. The AI-powered summaries maintain academic integrity while enhancing comprehension.", image: "https://randomuser.me/api/portraits/men/45.jpg" }
  ];

  const stats = [
    { end: 15000, suffix: "+", label: "Active Students", icon: <Users size={28} /> },
    { end: 50000, suffix: "+", label: "Notes Uploaded", icon: <FileText size={28} /> },
    { end: 100000, suffix: "+", label: "AI Summaries", icon: <Brain size={28} /> },
    { end: 8500, suffix: "+", label: "Quizzes Created", icon: <BarChart3 size={28} /> }
  ];

  const howItWorks = [
    { step: "01", title: "Create Account", desc: "Sign up with email & verify using OTP", icon: <Users size={28} /> },
    { step: "02", title: "Upload Content", desc: "Upload PDFs or access shared materials", icon: <Upload size={28} /> },
    { step: "03", title: "AI Processing", desc: "Our AI analyzes and generates summaries", icon: <Bot size={28} /> },
    { step: "04", title: "Smart Learning", desc: "Quiz, revise, collaborate effectively", icon: <Sparkles size={28} /> }
  ];

  const Counter = ({ end, suffix, label, icon }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
      if (isInView) {
        let start = 0;
        const duration = 2500;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            setCount(end);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, 16);
        return () => clearInterval(timer);
      }
    }, [isInView, end]);

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
        <div className="relative bg-white rounded-2xl p-6 text-center shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition duration-300">
            {icon}
          </div>
          <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {count.toLocaleString()}{suffix}
          </div>
          <p className="text-slate-500 mt-2 font-medium">{label}</p>
        </div>
      </motion.div>
    );
  };

  const FeatureCard = ({ icon, title, desc, color, bg, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl blur-2xl opacity-0 group-hover:opacity-60 transition duration-500" />
      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${bg} rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition duration-500`} />
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4 shadow-md group-hover:shadow-lg transition-all group-hover:scale-110 duration-300`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );

  const TestimonialCard = ({ name, role, rating, text, image, index }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition duration-500" />
      <div className="relative bg-white rounded-2xl p-6 border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <Quote className="w-10 h-10 text-indigo-200 absolute top-4 right-4" />
        <div className="flex items-center gap-4 mb-4">
          <img src={image} alt={name} className="w-14 h-14 rounded-full object-cover border-2 border-indigo-200" />
          <div>
            <h4 className="font-bold text-slate-800">{name}</h4>
            <p className="text-sm text-slate-500">{role}</p>
          </div>
        </div>
        <div className="flex gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />
          ))}
        </div>
        <p className="text-slate-600 leading-relaxed">"{text}"</p>
      </div>
    </motion.div>
  );

  return (
    <div className="bg-white dark:bg-slate-950 overflow-x-hidden transition-colors duration-300" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}>


      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 -right-1/3 w-[800px] h-[800px] bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 -left-1/3 w-[800px] h-[800px] bg-gradient-to-tr from-cyan-500/30 via-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-violet-500/20 to-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cdefs%3E%3Cpattern%20id%3D%22grid%22%20width%3D%2260%22%20height%3D%2260%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Cpath%20d%3D%22M%2060%200%20L%200%200%200%2060%22%20fill%3D%22none%22%20stroke%3D%22%236366F1%22%20stroke-opacity%3D%220.05%22%20stroke-width%3D%221%22%2F%3E%3C%2Fpattern%3E%3C%2Fdefs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url(%23grid)%22%20%2F%3E%3C%2Fsvg%3E')] opacity-30" />

          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-indigo-400 rounded-full"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)
              }}
              animate={{
                y: [null, -30, 30, -30],
                x: [null, 20, -20, 20],
                opacity: [0.2, 0.8, 0.2]
              }}
              transition={{ duration: Math.random() * 5 + 3, repeat: Infinity, delay: Math.random() * 5 }}
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full px-4 py-2 mb-6 border border-indigo-200/50 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">AI-Powered Learning Platform</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-[1.2] tracking-tight"
              >
                Study Smarter with{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                  AI-Powered Learning
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-slate-600 dark:text-slate-300 mt-6 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                Generate instant AI summaries, access study materials, attempt quizzes, and collaborate seamlessly with teachers through one intelligent platform.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8"
              >
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 rounded-xl text-white font-semibold overflow-hidden shadow-lg hover:shadow-xl transition-all"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Get Start Learning <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-700 to-violet-700 opacity-0 group-hover:opacity-100 transition duration-300" />
                  </motion.button>
                </Link>

              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-6 justify-center lg:justify-start mt-8 pt-4"
              >
                {[
                  { icon: <Zap className="w-5 h-5 text-indigo-500" />, text: "AI Powered" },
                  { icon: <Shield className="w-5 h-5 text-emerald-500" />, text: "Secure OTP Auth" },
                  { icon: <TrendingUp className="w-5 h-5 text-cyan-500" />, text: "Fast Learning" },
                  { icon: <Users className="w-5 h-5 text-purple-500" />, text: "10k+ Students" }
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    {badge.icon}
                    <span>{badge.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Dashboard Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: 10 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex-1 relative"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-violet-500/20 rounded-3xl blur-2xl" />
                <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-50 to-white p-4 border-b">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <div className="ml-4 text-sm text-slate-500 font-mono">dashboard.studyGeni.ai</div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div whileHover={{ y: -2 }} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                        <Sparkles className="w-6 h-6 text-indigo-600 mb-2" />
                        <p className="text-xs text-slate-500">AI Summary</p>
                        <p className="text-sm font-semibold text-slate-800">Neural Networks Chapter 4</p>
                        <div className="mt-2 h-1 bg-indigo-200 rounded-full w-3/4" />
                      </motion.div>
                      <motion.div whileHover={{ y: -2 }} className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-100">
                        <Upload className="w-6 h-6 text-cyan-600 mb-2" />
                        <p className="text-xs text-slate-500">PDF Upload</p>
                        <p className="text-sm font-semibold text-slate-800">lecture_12.pdf</p>
                        <div className="mt-2 text-xs text-cyan-600">2.4 MB</div>
                      </motion.div>
                    </div>
                    <motion.div whileHover={{ y: -2 }} className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                      <BookOpen className="w-6 h-6 text-emerald-600 mb-2" />
                      <p className="text-xs text-slate-500">Quiz Ready</p>
                      <p className="text-sm font-semibold text-slate-800">20 Questions • AI Generated</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-emerald-200 text-emerald-700 px-2 py-0.5 rounded">Easy</span>
                        <span className="text-xs bg-emerald-200 text-emerald-700 px-2 py-0.5 rounded">8 min</span>
                      </div>
                    </motion.div>
                    <div className="flex gap-3 text-sm">
                      <Link to="/studentdashboard" className="flex-1">
                        <motion.div whileHover={{ y: -2 }} className="bg-slate-50 rounded-lg p-3 border cursor-pointer">
                          <FaUserGraduate className="w-4 h-4 text-indigo-600 mb-1" />
                          <span className="text-xs text-slate-600">Student Workspace</span>
                          <div className="text-xs text-slate-400 mt-1">4 active courses</div>
                        </motion.div>
                      </Link>
                      <Link to="/teacherdashboard" className="flex-1">
                        <motion.div whileHover={{ y: -2 }} className="bg-slate-50 rounded-lg p-3 border cursor-pointer">
                          <FaChalkboardTeacher className="w-4 h-4 text-purple-600 mb-1" />
                          <span className="text-xs text-slate-600">Teacher Workspace</span>
                          <div className="text-xs text-slate-400 mt-1">3 pending reviews</div>
                        </motion.div>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-8 -right-8 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-xl border border-white/50"
                >
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-purple-600" />
                    <span className="text-xs font-medium">AI Active</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>



      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-white via-indigo-50/20 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Powerful Features for{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Smart Learning</span>
            </h2>
            <p className="text-lg text-slate-600">Everything you need to excel in your academic journey</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* AI Showcase Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/40 via-purple-100/30 to-cyan-100/40" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <div className="inline-flex items-center gap-2 bg-indigo-100 rounded-full px-4 py-1.5 mb-6">
                <Brain className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-700">AI Technology</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                Transform Notes into{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">Smart Summaries</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Our advanced AI engine analyzes your content using state-of-the-art NLP and generates concise, intelligent summaries that capture key concepts instantly. Save hours of study time and focus on what truly matters.
              </p>

              <div className="space-y-4">
                {[
                  { icon: <Upload />, title: "Upload PDF", desc: "Drag & drop any study material or document", color: "from-blue-500 to-cyan-500" },
                  { icon: <Bot />, title: "AI Analysis", desc: "Advanced NLP processing with context understanding", color: "from-indigo-500 to-purple-500" },
                  { icon: <Sparkles />, title: "Smart Summary", desc: "Instant digestible insights with key points", color: "from-purple-500 to-pink-500" }
                ].map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-md`}>
                      {step.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{step.title}</p>
                      <p className="text-sm text-slate-500">{step.desc}</p>
                    </div>
                    <ChevronRight className="ml-auto w-5 h-5 text-slate-400" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex-1 relative"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000" />
                <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-white/10">
                  {/* Animated particles inside */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-indigo-400 rounded-full"
                      animate={{
                        y: [0, -50, 0],
                        x: [0, Math.random() * 40 - 20, 0],
                        opacity: [0, 1, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                      style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                    />
                  ))}

                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-400" />
                      AI Summary Preview
                    </h3>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-400 text-sm">neural_networks_chapter.pdf</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full w-3/4" />
                    <div className="h-2 bg-slate-700 rounded-full w-full" />
                    <div className="h-2 bg-slate-700 rounded-full w-5/6" />
                    <div className="bg-indigo-600/20 rounded-lg p-4 border border-indigo-500/30">
                      <p className="text-indigo-300 text-sm font-medium mb-2">📌 Key Points:</p>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Neural Networks mimic biological neurons</li>
                        <li>• Backpropagation adjusts weights</li>
                        <li>• Activation functions introduce non-linearity</li>
                        <li>• Deep learning uses multiple hidden layers</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center"
                    >
                      <Bot className="w-4 h-4 text-white" />
                    </motion.div>
                    <span className="text-slate-300 text-sm">AI generating insights...</span>
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="flex gap-1 ml-auto"
                    >
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Counter key={index} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-24 bg-gradient-to-b from-indigo-50/20 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose StudyGeni</h2>
            <p className="text-lg text-slate-600">Experience the future of education technology</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <FaRobot size={28} />, title: "AI Powered Learning", desc: "Advanced algorithms personalize your study path", color: "from-indigo-500 to-purple-500" },
              { icon: <Zap size={28} />, title: "Faster Revision", desc: "Save hours with instant AI summaries", color: "from-amber-500 to-orange-500" },
              { icon: <Users size={28} />, title: "Easy Collaboration", desc: "Seamless sharing and teamwork features", color: "from-emerald-500 to-teal-500" },
              { icon: <Shield size={28} />, title: "Secure Authentication", desc: "OTP verified email security", color: "from-cyan-500 to-blue-500" },
              { icon: <BookOpen size={28} />, title: "Centralized Resources", desc: "All study materials in one place", color: "from-rose-500 to-pink-500" },
              { icon: <Target size={28} />, title: "Personalized Learning", desc: "Adaptive content based on your progress", color: "from-violet-500 to-purple-500" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition duration-500" />
                <div className="relative bg-white rounded-2xl p-6 border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition duration-300 shadow-md`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/40 via-indigo-50/30 to-transparent" />
        <div className="container mx-auto px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-lg text-slate-600">Get started in 4 simple steps</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative text-center group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition duration-500" />
                <div className="relative bg-white rounded-2xl p-6 border border-slate-100 shadow-lg">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-lg">
                    {item.step}
                  </div>
                  <div className="mt-8 mb-4">
                    <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition duration-300">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                  {i < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2">
                      <ChevronRight className="w-6 h-6 text-slate-300" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Loved by Students & Teachers</h2>
            <p className="text-lg text-slate-600">Join thousands of happy learners worldwide</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, i) => (
              <TestimonialCard key={i} {...testimonial} index={i} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;