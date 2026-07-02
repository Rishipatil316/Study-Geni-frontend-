import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  BookOpen,
  Download,
  Eye,
  Sparkles,
  Trash2,
  LayoutDashboard,
  GraduationCap,
  FolderOpen,
  Clock,
  Search,
  Plus,
  ArrowRight,
  LogOut,
  ChevronDown,
  User,
  Activity,
  Zap,
  Menu,
  X,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  CloudLightning
} from "lucide-react";

// GRADIENTS for Subjects
const GRADIENTS = [
  "from-indigo-500/10 to-violet-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60",
  "from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60",
  "from-rose-500/10 to-orange-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/60",
  "from-sky-500/10 to-indigo-500/10 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800/60",
  "from-fuchsia-500/10 to-pink-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-800/60",
  "from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/60",
];

const getSubjectStyles = (subject = "") => {
  const sum = subject.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return GRADIENTS[sum % GRADIENTS.length];
};

const getInitials = (name = "T") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function TeacherDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  // Protect route
  useEffect(() => {
    if (!token || user.role !== "teacher") {
      navigate("/login");
    }
  }, [token, navigate, user]);

  // UI state
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Delete Dialog State
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    fileId: null,
    fileName: "",
    isDeleting: false
  });

  // Upload Form
  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    file: null,
  });

  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("All");

  useEffect(() => {
    fetchFiles();
  }, []);

  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchFiles = async () => {
    try {
      const res = await API.get("/files");
      setFiles(res.data.files || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch library materials.", "error");
    }
  };

  const handleDownload = (fileId, title) => {
    window.location.href = `${API.defaults.baseURL}/files/download/${fileId}`;
    showToast(`Downloading "${title}"...`);
  };

  const handleChange = (e) => {
    if (e.target.name === "file") {
      setForm({ ...form, file: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // Delete handlers with custom dialog
  const handleDeleteClick = (id, title) => {
    setDeleteDialog({
      isOpen: true,
      fileId: id,
      fileName: title,
      isDeleting: false
    });
  };

  const handleConfirmDelete = async () => {
    setDeleteDialog(prev => ({ ...prev, isDeleting: true }));

    try {
      await API.delete(`/files/${deleteDialog.fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showToast(`Successfully deleted "${deleteDialog.fileName}"`);
      fetchFiles();
      setDeleteDialog({
        isOpen: false,
        fileId: null,
        fileName: "",
        isDeleting: false
      });
    } catch (err) {
      console.error(err);
      showToast("Delete failed. Please try again.", "error");
      setDeleteDialog(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog({
      isOpen: false,
      fileId: null,
      fileName: "",
      isDeleting: false
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!form.file) {
      showToast("Please select a file to upload.", "error");
      return;
    }
    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus("Preparing document upload...");

    let progress = 0;
    const uploadSim = setInterval(() => {
      progress += Math.floor(Math.random() * 8) + 2;
      if (progress >= 75) {
        progress = 75;
        setUploadStatus("Processing PDF and extracting study notes with AI (this might take a few seconds)...");
        clearInterval(uploadSim);
      } else if (progress > 45) {
        setUploadStatus("Uploading file to cloud storage...");
      } else if (progress > 15) {
        setUploadStatus("Sending material to StudyGeni server...");
      }
      setUploadProgress(progress);
    }, 150);

    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("subject", form.subject);
      data.append("file", form.file);

      await API.post("/files", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      clearInterval(uploadSim);

      setUploadStatus("Compiling summary and quiz questions...");
      setUploadProgress(90);

      setTimeout(() => {
        setUploadProgress(100);
        setUploadStatus("Publish complete! Document added to library.");
        showToast("Published study material successfully!");

        setTimeout(() => {
          fetchFiles();
          setForm({ title: "", description: "", subject: "", file: null });
          setIsUploading(false);
          setUploadProgress(0);
          setUploadStatus("");
          setActiveTab("materials");
        }, 800);
      }, 500);

    } catch (err) {
      clearInterval(uploadSim);
      console.error(err);
      showToast(err.response?.data?.message || "Upload failed", "error");
      setIsUploading(false);
      setUploadProgress(0);
      setUploadStatus("");
    }
  };

  const subjectsList = ["All", ...new Set(files.map((f) => f.subject).filter(Boolean))];

  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.subject?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject = selectedSubjectFilter === "All" || file.subject === selectedSubjectFilter;
    const matchesCreator = activeTab === "my-uploads" ? file.createdBy?._id === user?.id : true;

    return matchesSearch && matchesSubject && matchesCreator;
  });

  const totalFiles = files.length;
  const subjectCount = new Set(files.map((f) => f.subject).filter(Boolean)).size;
  const myFilesCount = files.filter((f) => f.createdBy?._id === user?.id).length;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard Overview", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "materials", label: "Class Library", icon: <BookOpen className="w-5 h-5" /> },
    { id: "my-uploads", label: "My Uploads", icon: <FolderOpen className="w-5 h-5" />, badge: myFilesCount || null },
    { id: "upload-new", label: "Upload Material", icon: <Upload className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans flex">

      {/* ─── TOAST NOTIFICATION ─── */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-5 right-5 z-[100] px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 border backdrop-blur-md ${notification.type === "error"
                ? "bg-red-50/90 dark:bg-red-950/90 border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400"
                : "bg-emerald-50/90 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-900/60 text-emerald-600 dark:text-emerald-400"
              }`}
          >
            {notification.type === "error" ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            <span className="text-sm font-semibold">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── DELETE CONFIRMATION DIALOG ─── */}
      <AnimatePresence>
        {deleteDialog.isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancelDelete}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-full max-w-md px-4"
            >
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-800/80 overflow-hidden">
                {/* Header with gradient accent */}
                <div className="h-1.5 bg-gradient-to-r from-rose-500 via-red-500 to-pink-500" />

                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    {/* Icon container */}
                    <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center flex-shrink-0">
                      <Trash2 className="w-6 h-6 text-red-500 dark:text-red-400" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Delete Study Material
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Are you sure you want to permanently delete this file?
                      </p>
                    </div>
                  </div>

                  {/* File details */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-200/50 dark:border-slate-800/50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                          {deleteDialog.fileName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          This action cannot be undone
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleCancelDelete}
                      disabled={deleteDialog.isDeleting}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      disabled={deleteDialog.isDeleting}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-red-500/20 active:scale-[0.98] transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {deleteDialog.isDeleting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          Delete Permanently
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Subtle Background Art */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-br from-indigo-200/10 to-pink-200/10 dark:from-indigo-900/5 dark:to-pink-900/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-gradient-to-tr from-purple-200/10 to-sky-200/10 dark:from-purple-900/5 dark:to-sky-900/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
      </div>

      {/* ═══════════ SIDEBAR (Desktop) ═══════════ */}
      <aside className={`hidden lg:flex flex-col fixed top-0 left-0 h-full z-45 bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800/80 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"}`}>
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-5 h-20 border-b border-slate-100 dark:border-slate-800/50 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 dark:shadow-none flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
              StudyGeni
            </motion.span>
          )}
        </div>

        {/* User Card */}
        {sidebarOpen ? (
          <div className="p-4 mx-3 my-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/40 dark:border-slate-800/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center text-sm font-bold shadow-md">
              {getInitials(user?.username)}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-xs truncate text-slate-800 dark:text-white">{user?.username || "Educator"}</h4>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase mt-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30 animate-pulse"></span>
                Educator
              </p>
            </div>
          </div>
        ) : (
          <div className="my-6 mx-auto">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center text-sm font-bold shadow-md">
              {getInitials(user?.username)}
            </div>
          </div>
        )}

        {/* Nav list */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id
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

        {/* Sidebar Toggle & Logout */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/50 space-y-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-600 dark:hover:text-slate-350 transition-colors text-xs font-semibold"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            {sidebarOpen && "Collapse Menu"}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && "Sign Out"}
          </button>
        </div>
      </aside>

      {/* ═══════════ MOBILE HEADER ═══════════ */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileSidebarOpen(true)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
            <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">StudyGeni Workspace</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
            {getInitials(user?.username)}
          </div>
        </div>
      </div>

      {/* ═══════════ MOBILE SIDEBAR OVERLAY ═══════════ */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileSidebarOpen(false)} className="fixed inset-0 bg-black/40 z-50 lg:hidden" />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", damping: 25 }} className="fixed top-0 left-0 h-full w-72 bg-white dark:bg-slate-900 z-50 lg:hidden shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">StudyGeni</span>
                  <button onClick={() => setMobileSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5 text-slate-500" /></button>
                </div>
                <div className="p-4 m-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center gap-3 border border-slate-100 dark:border-slate-800/60">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-xs font-bold shadow-md">
                    {getInitials(user?.username)}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs truncate text-slate-800 dark:text-white">{user?.username}</h4>
                    <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400">Educator</span>
                  </div>
                </div>
                <nav className="py-4 px-3 space-y-1">
                  {navItems.map((item) => (
                    <button key={item.id} onClick={() => { setActiveTab(item.id); setMobileSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}>
                      {item.icon}<span>{item.label}</span>
                      {item.badge && <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold">{item.badge}</span>}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="p-3 border-t border-slate-100 dark:border-slate-800">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 text-sm font-medium">
                  <LogOut className="w-5 h-5" />Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════ MAIN WORKSPACE ═══════════ */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"} pt-16 lg:pt-0`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 z-10 relative">

          {/* ────── DASHBOARD TAB ────── */}
          {activeTab === "dashboard" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Welcome back, {user?.username || "Educator"} 👨‍🏫
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Compile summaries, upload files, and challenge students with auto-generated quizzes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  { title: "Library Materials", value: totalFiles, desc: "All system files", icon: <BookOpen className="w-5 h-5" />, bg: "from-indigo-500 to-purple-500", lightBg: "bg-indigo-50 dark:bg-indigo-950/30" },
                  { title: "Active Subjects", value: subjectCount, desc: "Academic fields", icon: <GraduationCap className="w-5 h-5" />, bg: "from-emerald-500 to-teal-500", lightBg: "bg-emerald-50 dark:bg-emerald-950/30" },
                  { title: "My Uploads", value: myFilesCount, desc: "Published by you", icon: <FileText className="w-5 h-5" />, bg: "from-rose-500 to-pink-500", lightBg: "bg-rose-50 dark:bg-rose-950/30" },
                ].map((stat, i) => (
                  <div key={i} className={`${stat.lightBg} rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center justify-between`}>
                    <div className="space-y-1.5">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">{stat.title}</p>
                      <h3 className="text-3xl font-bold">{stat.value}</h3>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{stat.desc}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.bg} text-white flex items-center justify-center shadow-lg shadow-indigo-500/10`}>
                      {stat.icon}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[350px]">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 pb-4 mb-4">
                      <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-500" />
                        Recent Library Uploads
                      </h3>
                      <button onClick={() => setActiveTab("materials")} className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                        View All
                      </button>
                    </div>

                    {files.length === 0 ? (
                      <div className="text-center py-16 text-slate-400 dark:text-slate-500">
                        <FolderOpen className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                        <p className="text-xs font-semibold">No materials published yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {files.slice(0, 4).map((file) => {
                          const grad = getSubjectStyles(file.subject);
                          return (
                            <div key={file._id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/50 flex items-center justify-between hover:bg-slate-100/50 dark:hover:bg-slate-800 transition duration-150">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${grad.split(" ")[0]} ${grad.split(" ")[1]} flex items-center justify-center font-bold text-[9px] shrink-0`}>
                                  {file.subject?.slice(0, 2).toUpperCase() || "GE"}
                                </div>
                                <div className="overflow-hidden">
                                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">{file.title}</h4>
                                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{file.subject || "General"}</p>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-650" />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm min-h-[350px] flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
                      Educator Quick Actions
                    </h3>
                    <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                      Publish study files directly to your dashboard so students can trigger AI features instantly.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div
                        onClick={() => setActiveTab("upload-new")}
                        className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 hover:border-indigo-400 dark:hover:border-indigo-700 cursor-pointer transition flex items-center gap-4"
                      >
                        <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center"><Upload className="w-5 h-5" /></div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-800 dark:text-white">Upload New PDF</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">Publish syllabus documents</p>
                        </div>
                      </div>

                      <div
                        onClick={() => setActiveTab("my-uploads")}
                        className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 hover:border-emerald-400 dark:hover:border-emerald-700 cursor-pointer transition flex items-center gap-4"
                      >
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center"><FolderOpen className="w-5 h-5" /></div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-800 dark:text-white">View Uploads</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">Manage your class files</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ────── MATERIALS & MY UPLOADS DIRECTORIES ────── */}
          {(activeTab === "materials" || activeTab === "my-uploads") && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {activeTab === "my-uploads" ? "Manage My Published Guides" : "Class Library Directory"}
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  {activeTab === "my-uploads" ? "Upload, delete, and inspect files created by you" : "Search and study all documents published inside StudyGeni"}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search titles, outlines, subjects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Subject:</span>
                  <div className="relative">
                    <select
                      value={selectedSubjectFilter}
                      onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                      className="appearance-none pl-4 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20 transition cursor-pointer"
                    >
                      {subjectsList.map((subj) => (
                        <option key={subj} value={subj}>{subj}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {filteredFiles.length === 0 ? (
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center bg-white dark:bg-slate-900">
                  <FolderOpen className="text-slate-400 dark:text-slate-650 w-12 h-12 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-350 font-bold">No Materials Found</p>
                  <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Try adapting your filters or search keywords.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFiles.map((file) => {
                    const styles = getSubjectStyles(file.subject);
                    return (
                      <motion.div
                        key={file._id}
                        layout
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden"
                      >
                        <div className={`bg-gradient-to-r ${styles.split(" ")[0]} ${styles.split(" ")[1]} p-6 pb-4`}>
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <span className={`text-[10px] font-bold px-3 py-1 rounded-lg bg-white/60 dark:bg-slate-950/40 border border-slate-200/30 dark:border-slate-800/40 uppercase tracking-wider ${styles.split(" ").slice(2).join(" ")}`}>
                              {file.subject || "General"}
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-white/40 dark:bg-slate-850/40 flex items-center justify-center shrink-0 border border-slate-200/20 dark:border-slate-800/30">
                              <FileText className="text-slate-500 dark:text-slate-400 w-4 h-4" />
                            </div>
                          </div>

                          <h3 className="font-bold text-slate-800 dark:text-white leading-snug line-clamp-2 min-h-[44px]">
                            {file.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                            {file.description || "No description provided."}
                          </p>

                          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/40">
                            <div className="w-6 h-6 rounded-full bg-slate-700 dark:bg-slate-800 text-white flex items-center justify-center text-[8px] font-bold shrink-0">
                              {getInitials(file.createdBy?.name || "T")}
                            </div>
                            <span className="text-[11px] text-slate-500 dark:text-slate-450 truncate max-w-[120px] font-semibold">
                              {file.createdBy?.name || "Educator"}
                            </span>
                            <span className="ml-auto text-[10px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(file.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => navigate(`/summary/${file._id}`)}
                              className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 text-xs font-bold py-2.5 hover:bg-indigo-100/80 dark:hover:bg-indigo-950/50 transition-colors"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> AI Summary
                            </button>
                            <button
                              onClick={() => navigate(`/quiz/${file._id}`)}
                              className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 text-xs font-bold py-2.5 hover:bg-emerald-100/80 dark:hover:bg-emerald-950/50 transition-colors"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> AI Quiz
                            </button>
                          </div>

                          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/40 pt-3">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => window.open(`${API.defaults.baseURL}/files/view/${file._id}`, "_blank")}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                                title="View PDF"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDownload(file._id, file.title)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                                title="Download Document"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>

                            {file.createdBy?._id === user?.id && (
                              <button
                                onClick={() => handleDeleteClick(file._id, file.title)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 dark:text-slate-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition"
                                title="Delete Study Guide"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ────── UPLOAD NEW MATERIAL TAB ────── */}
          {activeTab === "upload-new" && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Upload New Material</h1>
                <p className="text-sm text-slate-500 mt-1">Publish lecture materials, textbook PDFs, or custom syllabus docs to StudyGeni library.</p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                <form onSubmit={handleUpload} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Material Title</label>
                      <input
                        name="title"
                        placeholder="e.g. Intro to Machine Learning"
                        value={form.title}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:bg-slate-900 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Subject</label>
                      <input
                        name="subject"
                        placeholder="e.g. Computer Science"
                        value={form.subject}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:bg-slate-900 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Short Description</label>
                    <textarea
                      name="description"
                      placeholder="Outline topics, chapters, or syllabus points covered inside this document..."
                      value={form.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:bg-slate-900 transition resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Attach Document (PDF only)</label>
                    <label
                      htmlFor="dashboard-file"
                      className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-850/10 px-4 py-8 text-sm text-slate-500 dark:text-slate-400 cursor-pointer hover:border-indigo-500 hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition group"
                    >
                      <FileText className="w-8 h-8 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="font-semibold text-slate-700 dark:text-slate-350 text-center truncate max-w-xs">
                        {form.file ? form.file.name : "Choose PDF from file explorer"}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">Maximum size limit 10MB</span>
                    </label>
                    <input
                      id="dashboard-file"
                      type="file"
                      name="file"
                      accept=".pdf"
                      onChange={handleChange}
                      className="hidden"
                      required
                    />
                  </div>

                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>{uploadStatus}</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-650 text-white font-bold text-sm py-3.5 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98] transition duration-200 disabled:opacity-70"
                  >
                    {isUploading ? "Uploading & Analyzing Document..." : "Publish to Classroom"}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}