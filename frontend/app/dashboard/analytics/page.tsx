"use client";

import { TrendingUp, Users, FileText, Zap } from "lucide-react";
import { motion } from "framer-motion";
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

const queryTrendData = [
    { date: "Mar 1", queries: 45, accuracy: 92 },
    { date: "Mar 8", queries: 52, accuracy: 93 },
    { date: "Mar 15", queries: 61, accuracy: 94 },
    { date: "Mar 22", queries: 58, accuracy: 95 },
    { date: "Mar 29", queries: 65, accuracy: 94 },
];

const topicsData = [
    { name: "GDPR", value: 35 },
    { name: "Finance", value: 25 },
    { name: "Healthcare", value: 20 },
    { name: "Security", value: 15 },
    { name: "Other", value: 5 },
];

const responseTimeData = [
    { hour: "00:00", avgTime: 2.1 },
    { hour: "04:00", avgTime: 1.9 },
    { hour: "08:00", avgTime: 2.5 },
    { hour: "12:00", avgTime: 2.8 },
    { hour: "16:00", avgTime: 2.6 },
    { hour: "20:00", avgTime: 2.3 },
];

const COLORS = ["#667eea", "#764ba2", "#f093fb", "#4facfe", "#43e97b"];

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="glass p-6 rounded-2xl border border-white/20">
                <h1 className="text-3xl font-bold gradient-text mb-2">Analytics Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Deep insights into your compliance system's performance and usage patterns
                </p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Queries", value: "1,284", change: "+12.5%", icon: Zap, color: "from-blue-500 to-cyan-500" },
                    { label: "Unique Users", value: "47", change: "+8.2%", icon: Users, color: "from-purple-500 to-pink-500" },
                    { label: "Documents", value: "24", change: "+4", icon: FileText, color: "from-orange-500 to-red-500" },
                    { label: "Avg Accuracy", value: "94.2%", change: "+2.1%", icon: TrendingUp, color: "from-green-500 to-emerald-500" },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass p-6 rounded-2xl border border-white/20 card-shadow"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Query Trend */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass p-6 rounded-2xl border border-white/20 card-shadow"
                >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Query Volume & Accuracy Trend
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={queryTrendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                            <XAxis dataKey="date" stroke="#6b7280" />
                            <YAxis yAxisId="left" stroke="#6b7280" />
                            <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                                    border: "1px solid #e0e7ff",
                                    borderRadius: "12px",
                                }}
                            />
                            <Legend />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="queries"
                                stroke="#667eea"
                                strokeWidth={2}
                                name="Queries"
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="accuracy"
                                stroke="#10b981"
                                strokeWidth={2}
                                name="Accuracy %"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Topics Distribution */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass p-6 rounded-2xl border border-white/20 card-shadow"
                >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Query Topics Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={topicsData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {topicsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Response Time */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="glass p-6 rounded-2xl border border-white/20 card-shadow lg:col-span-2"
                >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Average Response Time by Hour
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={responseTimeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                            <XAxis dataKey="hour" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" label={{ value: 'Seconds', angle: -90, position: 'insideLeft' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                                    border: "1px solid #e0e7ff",
                                    borderRadius: "12px",
                                }}
                            />
                            <Bar dataKey="avgTime" fill="url(#colorBar)" radius={[8, 8, 0, 0]} />
                            <defs>
                                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.9} />
                                    <stop offset="95%" stopColor="#764ba2" stopOpacity={0.9} />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>
        </div>
    );
}
