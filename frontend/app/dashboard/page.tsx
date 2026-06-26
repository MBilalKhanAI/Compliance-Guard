"use client";

import { FileText, MessageSquare, TrendingUp, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const stats = [
    {
        name: "Total Documents",
        value: "24",
        change: "+12%",
        icon: FileText,
        color: "from-blue-500 to-cyan-500",
    },
    {
        name: "Total Queries",
        value: "1,284",
        change: "+23%",
        icon: MessageSquare,
        color: "from-purple-500 to-pink-500",
    },
    {
        name: "Avg Response Time",
        value: "2.4s",
        change: "-8%",
        icon: Clock,
        color: "from-orange-500 to-red-500",
    },
    {
        name: "Accuracy Rate",
        value: "94.2%",
        change: "+5%",
        icon: TrendingUp,
        color: "from-green-500 to-emerald-500",
    },
];

const queryData = [
    { name: "Mon", queries: 45 },
    { name: "Tue", queries: 52 },
    { name: "Wed", queries: 48 },
    { name: "Thu", queries: 61 },
    { name: "Fri", queries: 55 },
    { name: "Sat", queries: 38 },
    { name: "Sun", queries: 42 },
];

const accuracyData = [
    { name: "Week 1", accuracy: 89 },
    { name: "Week 2", accuracy: 91 },
    { name: "Week 3", accuracy: 92 },
    { name: "Week 4", accuracy: 94 },
];

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-8 rounded-2xl border border-white/20 card-shadow"
            >
                <h1 className="text-3xl font-bold gradient-text mb-2">Welcome back, Admin! 👋</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Here's what's happening with your compliance system today.
                </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass p-6 rounded-2xl border border-white/20 card-shadow hover:card-shadow-hover transition-all duration-300 group cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                                    {stat.change}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.name}</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Query Volume */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass p-6 rounded-2xl border border-white/20 card-shadow"
                >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Query Volume (Last 7 Days)
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={queryData}>
                            <defs>
                                <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                                    border: "1px solid #e0e7ff",
                                    borderRadius: "12px",
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="queries"
                                stroke="#667eea"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorQueries)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Accuracy Trend */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass p-6 rounded-2xl border border-white/20 card-shadow"
                >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Accuracy Trend (Last 4 Weeks)
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={accuracyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                                    border: "1px solid #e0e7ff",
                                    borderRadius: "12px",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="accuracy"
                                stroke="#10b981"
                                strokeWidth={3}
                                dot={{ fill: "#10b981", r: 6 }}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass p-6 rounded-2xl border border-white/20 card-shadow"
            >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Activity
                </h3>
                <div className="space-y-4">
                    {[
                        { action: "New document uploaded", doc: "GDPR Compliance Guide.pdf", time: "2 minutes ago" },
                        { action: "Query answered", doc: "What are the GDPR penalties?", time: "15 minutes ago" },
                        { action: "Document indexed", doc: "Financial Regulations 2024.pdf", time: "1 hour ago" },
                        { action: "Chat session started", doc: "User inquiry about data storage", time: "2 hours ago" },
                    ].map((activity, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-4 p-4 hover:bg-white/10 rounded-xl transition-colors"
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{activity.doc}</p>
                            </div>
                            <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
