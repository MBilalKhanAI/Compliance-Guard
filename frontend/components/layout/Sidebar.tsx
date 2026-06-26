"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    MessageSquare,
    FileText,
    History,
    BarChart3,
    Settings,
    Shield,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Chat", href: "/dashboard/chat", icon: MessageSquare },
    { name: "Documents", href: "/dashboard/documents", icon: FileText },
    { name: "History", href: "/dashboard/history", icon: History },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0, width: collapsed ? 80 : 280 }}
            transition={{ duration: 0.3 }}
            className="fixed left-0 top-0 h-screen backdrop-blur-xl bg-white/10 border-r border-gray-200/20 flex flex-col z-50 shadow-2xl"
        >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-gray-200/20">
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-gray-900 text-lg">ComplianceGuard</h1>
                            <p className="text-xs text-gray-600">Enterprise RAG</p>
                        </div>
                    </motion.div>
                )}
                {collapsed && (
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 hover:bg-gray-200/20 rounded-lg transition-colors"
                >
                    {collapsed ? (
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                    ) : (
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        pathname === item.href ||
                        (item.href !== "/dashboard" && pathname?.startsWith(item.href));

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg"
                                    : "hover:bg-gray-200/30 text-gray-700"
                            )}
                        >
                            <Icon className="w-5 h-5 relative z-10" />
                            {!collapsed && <span className="font-medium relative z-10">{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200/20">
                {!collapsed && (
                    <div className="backdrop-blur-xl bg-white/10 p-4 rounded-xl border border-gray-200/20">
                        <p className="text-xs text-gray-600 mb-1 font-medium">Storage Used</p>
                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "65%" }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">6.5 GB / 10 GB</p>
                    </div>
                )}
            </div>
        </motion.aside>
    );
}
