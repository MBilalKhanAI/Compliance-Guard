"use client";

import { Search, Bell, User, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Header() {
    const [darkMode, setDarkMode] = useState(false);

    return (
        <header className="backdrop-blur-xl bg-white/50 border-b border-gray-200/50 px-8 py-4 flex items-center justify-between shadow-sm">
            {/* Search */}
            <div className="flex-1 max-w-xl">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search documents, queries..."
                        className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 ml-8">
                {/* Theme Toggle */}
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-3 hover:bg-gray-200/30 rounded-xl transition-colors relative overflow-hidden group"
                >
                    <motion.div animate={{ rotate: darkMode ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        {darkMode ? (
                            <Sun className="w-5 h-5 text-gray-700" />
                        ) : (
                            <Moon className="w-5 h-5 text-gray-700" />
                        )}
                    </motion.div>
                </button>

                {/* Notifications */}
                <button className="p-3 hover:bg-gray-200/30 rounded-xl transition-colors relative">
                    <Bell className="w-5 h-5 text-gray-700" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User Menu */}
                <button className="flex items-center gap-3 p-2 hover:bg-gray-200/30 rounded-xl transition-colors">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                        <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left hidden md:block">
                        <p className="text-sm font-semibold text-gray-900">Admin</p>
                        <p className="text-xs text-gray-500">admin@compliance.com</p>
                    </div>
                </button>
            </div>
        </header>
    );
}
