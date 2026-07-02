import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Sparkles, CheckCircle, XCircle, ArrowRight,
  ArrowLeft, Trophy, Target, Clock, Loader2,
  RotateCcw, Home, ChevronRight, Zap, Award,
  BookOpen, AlertCircle, PartyPopper
} from "lucide-react";

export default function Quiz() {
  const { fileId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  // Loading animation phrases
  const loadingPhrases = [
    "🧠 Analyzing your study material...",
    "✨ Crafting intelligent questions...",
    "📚 Building your personalized quiz...",
    "🎯 Preparing challenge questions...",
    "⚡ Almost ready for your quiz...",
  ];
  const [loadingPhrase, setLoadingPhrase] = useState(0);

  useEffect(() => {
    fetchQuiz();
    return () => {
      isMountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  // Cycle loading phrases
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingPhrase((prev) => (prev + 1) % loadingPhrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [loading]);

  const fetchQuiz = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);
      setError("");
      const res = await API.get(`/ai/${fileId}/quiz`, { signal: controller.signal });
      if (!isMountedRef.current) return;

      const onlyTenQuestions = (res.data.quiz || []).slice(0, 10);
      if (onlyTenQuestions.length === 0) {
        setError("No quiz questions could be generated for this material.");
      } else {
        setQuiz(onlyTenQuestions);
      }
    } catch (err) {
      if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") return;
      console.error(err);
      if (isMountedRef.current) {
        setError("Failed to generate quiz. Please try again.");
      }
    } finally {
      if (isMountedRef.current && abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const handleCancelGeneration = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    if (isMountedRef.current) {
      setLoading(false);
      setError("");
      setQuiz([]);
      setLoadingPhrase(0);
    }
    navigate(-1);
  };

  const handleOptionSelect = (questionIndex, optionLetter) => {
    if (submitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionLetter,
    });
  };

  const handleSubmitQuiz = () => {
    let totalScore = 0;
    quiz.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) {
        totalScore++;
      }
    });
    setScore(totalScore);
    setSubmitted(true);
    setShowResults(true);
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setShowResults(false);
    setReviewMode(false);
    setScore(0);
    setCurrentQuestion(0);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = quiz.length > 0 ? (answeredCount / quiz.length) * 100 : 0;
  const scorePercent = quiz.length > 0 ? (score / quiz.length) * 100 : 0;

  const getScoreGrade = () => {
    if (scorePercent >= 90) return { label: "Outstanding!", color: "text-emerald-500", emoji: "🏆", bg: "from-emerald-500 to-teal-500" };
    if (scorePercent >= 70) return { label: "Great Job!", color: "text-blue-500", emoji: "🌟", bg: "from-blue-500 to-cyan-500" };
    if (scorePercent >= 50) return { label: "Good Effort!", color: "text-amber-500", emoji: "👍", bg: "from-amber-500 to-orange-500" };
    return { label: "Keep Practicing!", color: "text-rose-500", emoji: "💪", bg: "from-rose-500 to-pink-500" };
  };

  // ─── LOADING STATE ───
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 transition-colors">
        {/* Background decorations */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-pink-400/20 to-purple-400/20 rounded-full blur-3xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center max-w-md w-full"
        >
          {/* Animated Brain Icon */}
          <motion.div
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-indigo-500/30"
          >
            <Brain className="w-12 h-12 text-white" />
          </motion.div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-3">
            Generating Your Quiz
          </h2>

          {/* Animated Loading Phrase */}
          <AnimatePresence mode="wait">
            <motion.p
              key={loadingPhrase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-slate-500 dark:text-slate-400 mb-8 text-sm sm:text-base"
            >
              {loadingPhrases[loadingPhrase]}
            </motion.p>
          </AnimatePresence>

          {/* Progress Bar */}
          <div className="relative w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
            />
          </div>

          {/* Floating Dots */}
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -12, 0], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500"
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCancelGeneration}
            className="mt-6 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700/70 shadow-sm text-sm font-semibold"
          >
            <XCircle className="w-4 h-4" /> Cancel
          </motion.button>

          <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
            AI is reading your PDF and creating questions — this may take a moment
          </p>
        </motion.div>
      </div>
    );
  }

  // ─── ERROR STATE ───
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4 transition-colors">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md w-full bg-white dark:bg-slate-800/60 rounded-3xl p-8 shadow-xl border border-slate-200/50 dark:border-slate-700/50"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Quiz Generation Failed</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={fetchQuiz}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              <RotateCcw className="w-4 h-4" /> Retry
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── RESULTS SCREEN ───
  if (showResults && !reviewMode) {
    const grade = getScoreGrade();
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 transition-colors">
        {/* Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-200/20 to-purple-200/20 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="relative z-10 w-full max-w-lg"
        >
          <div className="bg-white dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
            {/* Score Header */}
            <div className={`bg-gradient-to-r ${grade.bg} p-8 text-center text-white relative overflow-hidden`}>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-white/10 rounded-full blur-3xl"
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="text-6xl mb-3"
              >
                {grade.emoji}
              </motion.div>
              <h2 className="text-3xl font-bold mb-1">{grade.label}</h2>
              <p className="text-white/80 text-sm">Quiz Complete</p>
            </div>

            {/* Score Details */}
            <div className="p-8">
              {/* Circular Score */}
              <div className="flex justify-center mb-6">
                <div className="relative w-36 h-36">
                  <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-700" />
                    <motion.circle
                      cx="60" cy="60" r="52" fill="none" strokeWidth="8" strokeLinecap="round"
                      className={grade.color.replace("text-", "stroke-")}
                      style={{ strokeDasharray: `${2 * Math.PI * 52}` }}
                      initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - scorePercent / 100) }}
                      transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="text-3xl font-bold text-slate-800 dark:text-white"
                    >
                      {Math.round(scorePercent)}%
                    </motion.span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{score}/{quiz.length}</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: "Correct", value: score, icon: <CheckCircle className="w-4 h-4" />, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30" },
                  { label: "Wrong", value: quiz.length - score, icon: <XCircle className="w-4 h-4" />, color: "text-red-500 bg-red-50 dark:bg-red-950/30" },
                  { label: "Total", value: quiz.length, icon: <Target className="w-4 h-4" />, color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30" },
                ].map((s) => (
                  <div key={s.label} className={`${s.color} rounded-xl p-3 text-center`}>
                    <div className="flex justify-center mb-1">{s.icon}</div>
                    <p className="text-xl font-bold text-slate-800 dark:text-white">{s.value}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2.5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setReviewMode(true); setCurrentQuestion(0); }}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-shadow"
                >
                  <BookOpen className="w-4 h-4" /> Review Answers
                </motion.button>
                <div className="grid grid-cols-2 gap-2.5">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRetry}
                    className="py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" /> Retry
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(-1)}
                    className="py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Home className="w-4 h-4" /> Dashboard
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── QUIZ / REVIEW MODE ───
  const q = quiz[currentQuestion];
  const isLastQuestion = currentQuestion === quiz.length - 1;
  const isFirstQuestion = currentQuestion === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-200/15 to-purple-200/15 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-200/10 to-blue-200/10 dark:from-cyan-900/10 dark:to-blue-900/10 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">
                {reviewMode ? "Review Answers" : "AI Quiz"}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {reviewMode ? "See how you did on each question" : `${quiz.length} questions generated from your material`}
              </p>
            </div>
          </div>
          {reviewMode && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setReviewMode(false); setShowResults(true); }}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Trophy className="w-3.5 h-3.5" /> Back to Results
            </motion.button>
          )}
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Question {currentQuestion + 1} of {quiz.length}
            </span>
            {!reviewMode && (
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                {answeredCount}/{quiz.length} answered
              </span>
            )}
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
              transition={{ duration: 0.4 }}
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            />
          </div>

          {/* Question Dots */}
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            {quiz.map((_, i) => {
              let dotColor = "bg-slate-200 dark:bg-slate-700";
              if (reviewMode || submitted) {
                if (selectedAnswers[i] === quiz[i].answer) {
                  dotColor = "bg-emerald-500";
                } else if (selectedAnswers[i]) {
                  dotColor = "bg-red-500";
                } else {
                  dotColor = "bg-slate-300 dark:bg-slate-600";
                }
              } else if (selectedAnswers[i]) {
                dotColor = "bg-indigo-500";
              }
              return (
                <button
                  key={i}
                  onClick={() => setCurrentQuestion(i)}
                  className={`w-3 h-3 rounded-full transition-all ${dotColor} ${
                    i === currentQuestion ? "ring-2 ring-offset-2 ring-indigo-400 dark:ring-offset-slate-900 scale-125" : "hover:scale-110"
                  }`}
                />
              );
            })}
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden"
          >
            {/* Question Header */}
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
                  {currentQuestion + 1}
                </span>
                <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white leading-relaxed pt-0.5">
                  {q.question}
                </h2>
              </div>
            </div>

            {/* Options */}
            <div className="p-5 sm:p-6 space-y-3">
              {q.options.map((opt, i) => {
                const optionLetter = opt.charAt(0);
                const isSelected = selectedAnswers[currentQuestion] === optionLetter;
                const isCorrect = optionLetter === q.answer;
                const showFeedback = reviewMode || submitted;

                let optionStyle = "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20";

                if (showFeedback) {
                  if (isCorrect) {
                    optionStyle = "border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30";
                  } else if (isSelected && !isCorrect) {
                    optionStyle = "border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-950/30";
                  } else {
                    optionStyle = "border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 opacity-60";
                  }
                } else if (isSelected) {
                  optionStyle = "border-indigo-500 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20";
                }

                return (
                  <motion.button
                    key={i}
                    whileHover={!showFeedback ? { scale: 1.01 } : {}}
                    whileTap={!showFeedback ? { scale: 0.99 } : {}}
                    onClick={() => handleOptionSelect(currentQuestion, optionLetter)}
                    disabled={submitted}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${optionStyle}`}
                  >
                    {/* Option Letter Circle */}
                    <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
                      showFeedback && isCorrect
                        ? "bg-emerald-500 text-white"
                        : showFeedback && isSelected && !isCorrect
                        ? "bg-red-500 text-white"
                        : isSelected
                        ? "bg-indigo-500 text-white"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                    }`}>
                      {optionLetter}
                    </span>

                    {/* Option Text */}
                    <span className={`text-sm font-medium flex-1 ${
                      showFeedback && isCorrect
                        ? "text-emerald-700 dark:text-emerald-400"
                        : showFeedback && isSelected && !isCorrect
                        ? "text-red-700 dark:text-red-400"
                        : "text-slate-700 dark:text-slate-300"
                    }`}>
                      {opt.substring(2).trim()}
                    </span>

                    {/* Feedback Icon */}
                    {showFeedback && isCorrect && (
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    )}
                    {showFeedback && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Correct Answer (review mode) */}
            {(reviewMode || submitted) && (
              <div className="px-6 pb-5">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span className="text-xs font-medium text-indigo-700 dark:text-indigo-400">
                    Correct Answer: <span className="font-bold">{q.answer}</span>
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mt-6"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
            disabled={isFirstQuestion}
            className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </motion.button>

          {/* Submit or Next */}
          {!submitted && isLastQuestion ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmitQuiz}
              disabled={answeredCount < quiz.length}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trophy className="w-4 h-4" /> Submit Quiz
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setCurrentQuestion((prev) => Math.min(quiz.length - 1, prev + 1))}
              disabled={isLastQuestion}
              className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              Next <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </motion.div>

        {/* Quick Submit Hint */}
        {!submitted && answeredCount === quiz.length && !isLastQuestion && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center"
          >
            <button
              onClick={handleSubmitQuiz}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1 mx-auto"
            >
              <Zap className="w-3 h-3" /> All questions answered — Submit Quiz now?
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}