"use client";

import { useState } from "react";
import { Search, Filter, Grid3x3, List, FileText, Download, Trash2, Tag, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface Document {
    id: string;
    name: string;
    size: string;
    pages: number;
    uploadDate: string;
    tags: string[];
    status: "processed" | "processing" | "failed";
}

const mockDocuments: Document[] = [
    {
        id: "1",
        name: "GDPR Compliance Guide.pdf",
        size: "2.4 MB",
        pages: 156,
        uploadDate: "2024-03-15",
        tags: ["GDPR", "Privacy", "EU"],
        status: "processed",
    },
    {
        id: "2",
        name: "Financial Regulations 2024.pdf",
        size: "3.1 MB",
        pages: 230,
        uploadDate: "2024-03-14",
        tags: ["Finance", "Regulations"],
        status: "processed",
    },
    {
        id: "3",
        name: "Healthcare Compliance.pdf",
        size: "1.8 MB",
        pages: 98,
        uploadDate: "2024-03-13",
        tags: ["Healthcare", "HIPAA"],
        status: "processing",
    },
    {
        id: "4",
        name: "Data Protection Act.pdf",
        size: "4.2 MB",
        pages: 312,
        uploadDate: "2024-03-12",
        tags: ["Data", "Protection"],
        status: "processed",
    },
];

export default function DocumentsPage() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [documents] = useState<Document[]>(mockDocuments);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredDocuments = documents.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case "processed":
                return "bg-green-100 text-green-700";
            case "processing":
                return "bg-yellow-100 text-yellow-700";
            case "failed":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="glass p-6 rounded-2xl border border-white/20">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold gradient-text mb-2">Documents Library</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage your regulatory documents and compliance files
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-gradient-primary text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow font-medium"
                    >
                        Upload Document
                    </motion.button>
                </div>

                {/* Search and Filters */}
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search documents..."
                            className="w-full pl-12 pr-4 py-3 glass rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder-gray-500"
                        />
                    </div>
                    <button className="px-4 py-3 glass rounded-xl border border-white/20 hover:bg-white/10 transition-colors flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        <span className="font-medium">Filters</span>
                    </button>
                    <div className="flex gap-2 glass rounded-xl p-1">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white/20" : "hover:bg-white/10"
                                }`}
                        >
                            <Grid3x3 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-white/20" : "hover:bg-white/10"
                                }`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Documents Grid/List */}
            {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDocuments.map((doc, index) => (
                        <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="glass p-6 rounded-2xl border border-white/20 card-shadow hover:card-shadow-hover transition-all cursor-pointer group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => toast.success("Download started")}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        title="Download"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => toast.success("Document deleted")}
                                        className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                {doc.name}
                            </h3>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <FileText className="w-4 h-4" />
                                    <span>{doc.pages} pages • {doc.size}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {doc.tags.map((tag, tagIndex) => (
                                    <span
                                        key={tagIndex}
                                        className="px-2 py-1 text-xs font-medium glass rounded-lg"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between">
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                                    {doc.status}
                                </span>
                                <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
                                    View Details →
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="glass p-6 rounded-2xl border border-white/20 space-y-4">
                    {filteredDocuments.map((doc, index) => (
                        <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-6 p-4 hover:bg-white/10 rounded-xl transition-colors cursor-pointer group"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                <FileText className="w-6 h-6 text-white" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                                    {doc.name}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                    <span>{doc.pages} pages</span>
                                    <span>•</span>
                                    <span>{doc.size}</span>
                                    <span>•</span>
                                    <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {doc.tags.map((tag, tagIndex) => (
                                    <span
                                        key={tagIndex}
                                        className="px-2 py-1 text-xs font-medium glass rounded-lg"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getStatusColor(doc.status)}`}>
                                {doc.status}
                            </span>

                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => toast.success("Download started")}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => toast.success("Document deleted")}
                                    className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
