"use client";

import { useState } from "react";
import { Search, Filter, Bookmark, Trash2, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface HistoryItem {
    id: string;
    query: string;
    answer: string;
    timestamp: Date;
    compliance_mode: boolean;
    bookmarked: boolean;
    latency: number;
}

const mockHistory: HistoryItem[] = [
    {
        id: "1",
        query: "What are the GDPR data retention requirements?",
        answer: "According to GDPR Article 5(1)(e), personal data shall be kept in a form which permits identification of data subjects for no longer than is necessary...",
        timestamp: new Date(2024, 2, 15, 14, 30),
        compliance_mode: true,
        bookmarked: true,
        latency: 2.4,
    },
    {
        id: "2",
        query: "Explain financial reporting requirements",
        answer: "Financial reporting requirements mandate that organizations must prepare and submit financial statements that accurately reflect...",
        timestamp: new Date(2024, 2, 15, 13, 15),
        compliance_mode: false,
        bookmarked: false,
        latency: 3.1,
    },
    {
        id: "3",
        query: "What are the penalties for non-compliance?",
        answer: "Non-compliance penalties can vary significantly depending on the regulatory framework. Under GDPR, fines can reach up to €20 million or 4% of annual global turnover...",
        timestamp: new Date(2024, 2, 14, 16, 45),
        compliance_mode: true,
        bookmarked: true,
        latency: 2.8,
    },
];

export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryItem[]>(mockHistory);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterBookmarked, setFilterBookmarked] = useState(false);

    const filteredHistory = history.filter(item => {
        const matchesSearch = item.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesBookmark = !filterBookmarked || item.bookmarked;
        return matchesSearch && matchesBookmark;
    });

    const toggleBookmark = (id: string) => {
        setHistory(prev => prev.map(item =>
            item.id === id ? { ...item, bookmarked: !item.bookmarked } : item
        ));
        toast.success("Bookmark updated!");
    };

    const deleteItem = (id: string) => {
        setHistory(prev => prev.filter(item => item.id !== id));
        toast.success("History item deleted!");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="glass p-6 rounded-2xl border border-white/20">
                <h1 className="text-3xl font-bold gradient-text mb-2">Query History</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Review your past queries and bookmark important conversations
                </p>

                {/* Search and Filters */}
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search queries and answers..."
                            className="w-full pl-12 pr-4 py-3 glass rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder-gray-500"
                        />
                    </div>
                    <button
                        onClick={() => setFilterBookmarked(!filterBookmarked)}
                        className={`px-4 py-3 glass rounded-xl border border-white/20 hover:bg-white/10 transition-colors flex items-center gap-2 ${filterBookmarked ? "bg-primary-500/20 border-primary-500/50" : ""
                            }`}
                    >
                        <Bookmark className={`w-5 h-5 ${filterBookmarked ? "fill-current text-yellow-500" : ""}`} />
                        <span className="font-medium">Bookmarked Only</span>
                    </button>
                </div>
            </div>

            {/* History List */}
            <div className="space-y-4">
                {filteredHistory.length === 0 ? (
                    <div className="glass p-12 rounded-2xl border border-white/20 text-center">
                        <p className="text-gray-500">No history items found</p>
                    </div>
                ) : (
                    filteredHistory.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass p-6 rounded-2xl border border-white/20 card-shadow hover:card-shadow-hover transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {item.query}
                                        </h3>
                                        {item.compliance_mode && (
                                            <span className="px-2 py-1 text-xs font-semibold bg-primary-100 text-primary-700 rounded-lg flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                Strict Mode
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {item.timestamp.toLocaleDateString()} at {item.timestamp.toLocaleTimeString()}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {item.latency.toFixed(2)}s
                                        </div>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                                        {item.answer}
                                    </p>
                                </div>

                                <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => toggleBookmark(item.id)}
                                        className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${item.bookmarked ? "text-yellow-500" : ""
                                            }`}
                                        title="Bookmark"
                                    >
                                        <Bookmark className={item.bookmarked ? "fill-current" : ""} />
                                    </button>
                                    <button
                                        onClick={() => deleteItem(item.id)}
                                        className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <button className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                                View Full Conversation →
                            </button>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
