"use client";

import { useState } from "react";
import { Moon, Sun, Shield, Bell, Database, Key, Download, Save } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function SettingsPage() {
    const [darkMode, setDarkMode] = useState(false);
    const [complianceDefault, setComplianceDefault] = useState(false);
    const [notifications, setNotifications] = useState(true);

    const saveSettings = () => {
        toast.success("Settings saved successfully!");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="glass p-6 rounded-2xl border border-white/20">
                <h1 className="text-3xl font-bold gradient-text mb-2">Settings</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage your preferences and system configuration
                </p>
            </div>

            {/* Settings Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Appearance */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-6 rounded-2xl border border-white/20 card-shadow"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <Sun className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Appearance</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Enable dark theme</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={darkMode}
                                    onChange={(e) => setDarkMode(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                        </div>
                    </div>
                </motion.div>

                {/* Defaults */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass p-6 rounded-2xl border border-white/20 card-shadow"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Default Settings</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Strict Compliance Mode</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Default to strict mode</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={complianceDefault}
                                    onChange={(e) => setComplianceDefault(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                        </div>
                    </div>
                </motion.div>

                {/* Notifications */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass p-6 rounded-2xl border border-white/20 card-shadow"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                            <Bell className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Enable Notifications</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Receive system alerts</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={notifications}
                                    onChange={(e) => setNotifications(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                        </div>
                    </div>
                </motion.div>

                {/* System */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass p-6 rounded-2xl border border-white/20 card-shadow"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                            <Database className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">System</h3>
                    </div>

                    <div className="space-y-3">
                        <button className="w-full px-4 py-3 glass rounded-xl border border-white/20 hover:bg-white/10 transition-colors text-left flex items-center gap-3">
                            <Download className="w-5 h-5" />
                            <span className="font-medium">Export Data</span>
                        </button>
                        <button className="w-full px-4 py-3 glass rounded-xl border border-white/20 hover:bg-white/10 transition-colors text-left flex items-center gap-3">
                            <Key className="w-5 h-5" />
                            <span className="font-medium">Manage API Keys</span>
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Save Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-end"
            >
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={saveSettings}
                    className="px-8 py-3 bg-gradient-primary text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow font-medium flex items-center gap-2"
                >
                    <Save className="w-5 h-5" />
                    Save Settings
                </motion.button>
            </motion.div>
        </div>
    );
}
