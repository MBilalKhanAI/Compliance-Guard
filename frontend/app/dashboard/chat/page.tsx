"use client";

import { useState, useRef, useEffect } from "react";
import { Send, FileText, Shield, ShieldAlert, Paperclip, Bookmark, Copy, RotateCcw, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";


interface Message {
    role: "user" | "assistant";
    content: string;
    sources?: Source[];
    latency?: number;
    bookmarked?: boolean;
    timestamp: Date;
}

interface Source {
    file: string;
    page: string;
    content: string;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [complianceMode, setComplianceMode] = useState(false);
    const [selectedSource, setSelectedSource] = useState<Source | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const file = e.target.files[0];
        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:8000/api/ingest", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                toast.success(`Successfully uploaded ${file.name}`);
                setMessages(prev => [...prev, {
                    role: "assistant",
                    content: `Successfully uploaded ${file.name}. You can now ask questions about it.`,
                    timestamp: new Date()
                }]);
            } else {
                toast.error(`Error uploading ${file.name}`);
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error(`Error uploading ${file.name}`);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: "user", content: input, timestamp: new Date() };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:8000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: userMessage.content, compliance_mode: complianceMode }),
            });

            const data = await response.json();

            const botMessage: Message = {
                role: "assistant",
                content: data.answer,
                sources: data.sources,
                latency: data.latency,
                timestamp: new Date()
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Could not connect to ComplianceGuard");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    const toggleBookmark = (index: number) => {
        setMessages(prev => prev.map((msg, i) =>
            i === index ? { ...msg, bookmarked: !msg.bookmarked } : msg
        ));
    };

    return (
        <div className="flex flex-1 gap-6 overflow-hidden">
            {/* Chat Section */}
            <div className="flex-1 flex flex-col h-full glass rounded-2xl border border-white/20 overflow-hidden">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold gradient-text">ComplianceGuard</h2>
                            <p className="text-xs text-gray-500">Regulatory Intelligence Assistant</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleUpload}
                            className="hidden"
                            accept=".pdf"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="flex items-center gap-2 px-4 py-2 glass rounded-xl border border-white/20 hover:bg-white/10 transition-colors disabled:opacity-50"
                        >
                            <Paperclip className="w-4 h-4" />
                            <span className="text-sm font-medium">{uploading ? "Uploading..." : "Upload PDF"}</span>
                        </motion.button>

                        <div className="flex items-center gap-2 glass p-1 rounded-xl">
                            <button
                                onClick={() => setComplianceMode(false)}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${!complianceMode ? "bg-white/20 shadow-lg" : "hover:bg-white/10"
                                    }`}
                            >
                                Conversational
                            </button>
                            <button
                                onClick={() => setComplianceMode(true)}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-1 ${complianceMode ? "bg-gradient-primary text-white shadow-lg" : "hover:bg-white/10"
                                    }`}
                            >
                                <ShieldAlert className="w-4 h-4" />
                                Strict
                            </button>
                        </div>
                    </div >
                </div >

                {/* Messages */}
                < div className="flex-1 overflow-y-auto p-6 space-y-6" >
                    {
                        messages.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center h-full text-center"
                            >
                                <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-2xl mb-6">
                                    <Shield className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold gradient-text mb-3">Start a Conversation</h3>
                                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                                    Upload regulatory documents and ask questions to get instant, citation-backed answers.
                                </p>
                            </motion.div>
                        )
                    }

                    <AnimatePresence>
                        {
                            messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-3xl rounded-2xl px-6 py-4 ${msg.role === "user"
                                            ? "bg-gradient-primary text-white shadow-lg"
                                            : "glass border border-white/20"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <p className="text-sm opacity-70">
                                                {msg.timestamp.toLocaleTimeString()}
                                            </p>
                                            {msg.role === "assistant" && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => copyToClipboard(msg.content)}
                                                        className="p-1 hover:bg-white/10 rounded transition-colors"
                                                        title="Copy"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => toggleBookmark(idx)}
                                                        className={`p-1 hover:bg-white/10 rounded transition-colors ${msg.bookmarked ? "text-yellow-500" : ""}`}
                                                        title="Bookmark"
                                                    >
                                                        <Bookmark className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                                        {msg.sources && msg.sources.length > 0 && (
                                            <div className="mt-4 pt-4 border-t border-white/10">
                                                <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-2">
                                                    Citations
                                                </p>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {msg.sources.map((source, sIdx) => (
                                                        <motion.div
                                                            key={sIdx}
                                                            whileHover={{ scale: 1.02 }}
                                                            onClick={() => setSelectedSource(source)}
                                                            className="flex items-start gap-2 text-sm glass p-3 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
                                                        >
                                                            <FileText className="w-4 h-4 text-primary-500 mt-0.5" />
                                                            <div>
                                                                <span className="font-medium text-primary-600 dark:text-primary-400">
                                                                    {source.file} (Page {source.page})
                                                                </span>
                                                                <p className="text-xs opacity-70 mt-0.5 line-clamp-2">
                                                                    "{source.content}"
                                                                </p>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {msg.latency && (
                                            <p className="text-xs opacity-50 mt-2 text-right">
                                                Response time: {msg.latency.toFixed(2)}s
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        }
                    </AnimatePresence >

                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                        >
                            <div className="glass border border-white/20 rounded-2xl px-6 py-4">
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                </div>
                            </div>
                        </motion.div>
                    )
                    }

                    <div ref={messagesEndRef} />
                </div >

                {/* Input Area */}
                < div className="p-6 border-t border-white/10" >
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                            placeholder="Ask a regulatory question..."
                            disabled={loading}
                            className="w-full pl-6 pr-14 py-4 glass rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder-gray-500"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            className="absolute right-3 top-3 p-2 bg-gradient-primary text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Send className="w-5 h-5" />
                        </motion.button>
                    </div>
                </div >
            </div >

            {/* PDF Viewer Side Panel */}
            <AnimatePresence>
                {
                    selectedSource && (
                        <motion.div
                            initial={{ opacity: 0, x: 300 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 300 }}
                            transition={{ duration: 0.3 }}
                            className="w-1/2 glass rounded-2xl border border-white/20 flex flex-col overflow-hidden"
                        >
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-primary-500" />
                                    <div>
                                        <p className="font-semibold">{selectedSource.file}</p>
                                        <p className="text-xs text-gray-500">Page {selectedSource.page}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedSource(null)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="flex-1 p-4">
                                <iframe
                                    src={`http://localhost:8000/files/${selectedSource.file}#page=${selectedSource.page}`}
                                    className="w-full h-full rounded-xl"
                                    title="PDF Viewer"
                                />
                            </div>
                        </motion.div>
                    )
                }
            </AnimatePresence >
        </div >
    );
}
