// src/components/AdminDashboard.jsx
import { motion } from "framer-motion";
import { ShieldCheck, Users, BarChart2 } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />, label: "Security", value: "99%" },
    { icon: <Users className="w-6 h-6 text-purple-600" />, label: "Active Users", value: "12.5k" },
    { icon: <BarChart2 className="w-6 h-6 text-emerald-600" />, label: "Sessions", value: "45k/day" },
  ];

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-8"
        >
          Admin Dashboard
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md flex items-center gap-4"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
