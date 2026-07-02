import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, ArrowLeft, Download, Copy, CheckCircle,
  BookOpen, Brain, Loader2, AlertCircle, RotateCcw,
  FileText, Bookmark, Share2, XCircle
} from "lucide-react";

export default function Summary() {
  const { fileId } = useParams();
  const navigate = useNavigate();

  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  // Loading animation phrases
  const loadingPhrases = [
    "📖 Reading your PDF document...",
    "🧠 Analyzing key concepts...",
    "✍️ Structuring study notes...",
    "📝 Formatting for easy reading...",
    "✨ Polishing your summary...",
  ];
  const [loadingPhrase, setLoadingPhrase] = useState(0);

  useEffect(() => {
    fetchSummary();
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
    }, 3500);
    return () => clearInterval(interval);
  }, [loading]);

  const fetchSummary = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);
      setError("");
      const res = await API.get(`/ai/${fileId}/summary`, { signal: controller.signal });
      if (!isMountedRef.current) return;
      setSummary(res.data.summary || "");
    } catch (err) {
      if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") return;
      console.error(err);
      if (isMountedRef.current) {
        setError("Failed to generate summary. Please try again.");
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
      setSummary("");
      setLoadingPhrase(0);
    }
    navigate(-1);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Parse summary into formatted sections
  const formatSummary = (text) => {
    if (!text) return [];

    const lines = text.split("\n");
    const sections = [];
    let currentSection = { heading: "", content: [] };

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        if (currentSection.content.length > 0 || currentSection.heading) {
          currentSection.content.push("");
        }
        return;
      }

      // Check if it's a heading (starts with emoji or all caps section)
      const isHeading = /^[📘📚🧠📖📝⚡🎯💡🔑✅❓🏆]\s/.test(trimmed) ||
        (/^[A-Z\s]{4,}$/.test(trimmed) && trimmed.length < 60);

      if (isHeading) {
        if (currentSection.heading || currentSection.content.length > 0) {
          sections.push({ ...currentSection });
        }
        currentSection = { heading: trimmed, content: [] };
      } else {
        currentSection.content.push(trimmed);
      }
    });

    if (currentSection.heading || currentSection.content.length > 0) {
      sections.push(currentSection);
    }

    return sections;
  };

  // ─── LOADING STATE ───
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/50 to-yellow-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 transition-colors">
        {/* Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
            className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-yellow-400/15 to-amber-400/15 rounded-full blur-3xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center max-w-md w-full"
        >
          {/* Animated Icon */}
          <motion.div
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 flex items-center justify-center shadow-2xl shadow-amber-500/30"
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-3">
            Generating AI Summary
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
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-full"
            />
          </div>

          {/* Floating dots */}
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -12, 0], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-amber-500 to-orange-500"
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
            AI is reading your PDF and creating structured notes — this may take a moment
          </p>
        </motion.div>
      </div>
    );
  }

  // ─── ERROR STATE ───
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50/30 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4 transition-colors">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md w-full bg-white dark:bg-slate-800/60 rounded-3xl p-8 shadow-xl border border-slate-200/50 dark:border-slate-700/50"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Summary Generation Failed</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={fetchSummary}
              className="px-5 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-amber-500/20">
              <RotateCcw className="w-4 h-4" /> Retry
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate(-1)}
              className="px-5 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Go Back
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── SUMMARY CONTENT ───
  const sections = formatSummary(summary);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-amber-200/15 to-orange-200/15 dark:from-amber-900/10 dark:to-orange-900/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-yellow-200/10 to-amber-200/10 dark:from-yellow-900/10 dark:to-amber-900/10 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </motion.button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-500" />
                AI Generated Summary
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Smart structured notes from your PDF
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border shadow-sm transition-all ${
                copied
                  ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/quiz/${fileId}`)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-shadow"
            >
              <Brain className="w-4 h-4" /> Take Quiz
            </motion.button>
          </div>
        </motion.div>

        {/* Summary Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden"
        >
          {/* Gradient top bar */}
          <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500" />

          <div className="p-6 sm:p-8 lg:p-10">
            {sections.length > 0 ? (
              <div className="space-y-8">
                {sections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    {/* Section Heading */}
                    {section.heading && (
                      <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-700/50 flex items-center gap-2">
                        {section.heading}
                      </h2>
                    )}

                    {/* Section Content */}
                    <div className="space-y-2">
                      {section.content.map((line, i) => {
                        if (!line) return <div key={i} className="h-2" />;

                        // Bullet point
                        if (line.startsWith("•") || line.startsWith("-") || line.startsWith("*")) {
                          return (
                            <div key={i} className="flex items-start gap-3 pl-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                                {line.replace(/^[•\-*]\s*/, "")}
                              </p>
                            </div>
                          );
                        }

                        // Definition or key-value
                        if (line.includes(":") && line.indexOf(":") < 40) {
                          const [key, ...rest] = line.split(":");
                          const value = rest.join(":").trim();
                          if (value) {
                            return (
                              <p key={i} className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                                <span className="font-semibold text-slate-800 dark:text-white">{key}:</span> {value}
                              </p>
                            );
                          }
                        }

                        // Regular paragraph
                        return (
                          <p key={i} className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                            {line}
                          </p>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              /* Fallback: raw text */
              <div className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-loose whitespace-pre-wrap">
                {summary}
              </div>
            )}
          </div>

          {/* Bottom Actions Bar */}
          <div className="border-t border-slate-100 dark:border-slate-700/50 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/30">
            <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Generated by StudyGeni AI
            </p>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Notes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/quiz/${fileId}`)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                <Brain className="w-3.5 h-3.5" /> Take Quiz
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}