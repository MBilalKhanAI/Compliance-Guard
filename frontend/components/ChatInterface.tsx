"use client";

import { useState, useRef, useEffect } from "react";
import { Send, FileText, Shield, ShieldAlert, Paperclip } from "lucide-react";

interface Message {
    role: "user" | "assistant";
    content: string;
    sources?: Source[];
    latency?: number;
}

interface Source {
    file: string;
    page: string;
    content: string;
}

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [complianceMode, setComplianceMode] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const [selectedSource, setSelectedSource] = useState<Source | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
                setMessages(prev => [...prev, { role: "assistant", content: `Successfully uploaded ${file.name}. You can now ask questions about it.` }]);
            } else {
                setMessages(prev => [...prev, { role: "assistant", content: `Error uploading ${file.name}.` }]);
            }
        } catch (error) {
            console.error("Upload error:", error);
            setMessages(prev => [...prev, { role: "assistant", content: `Error uploading ${file.name}.` }]);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: "user", content: input };
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
                latency: data.latency
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prev) => [...prev, { role: "assistant", content: "Error: Could not connect to ComplianceGuard." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
            {/* Main Chat Area */}
            <div className={`flex flex-col flex-1 h-full transition-all duration-300 ${selectedSource ? "w-1/2" : "w-full"}`}>
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <Shield className="w-8 h-8 text-indigo-600" />
                        <h1 className="text-xl font-bold tracking-tight text-gray-900">ComplianceGuard</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleUpload}
                            className="hidden"
                            accept=".pdf"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-all disabled:opacity-50"
                        >
                            <Paperclip className="w-4 h-4" />
                            {uploading ? "Uploading..." : "Upload PDF"}
                        </button>

                        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => setComplianceMode(false)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${!complianceMode ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                                    }`}
                            >
                                Conversational
                            </button>
                            <button
                                onClick={() => setComplianceMode(true)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-1 ${complianceMode ? "bg-indigo-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-900"
                                    }`}
                            >
                                <ShieldAlert className="w-4 h-4" />
                                Strict Compliance
                            </button>
                        </div>
                    </div>
                </header>

                {/* Messages */}
                <main className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4">
                            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center">
                                <Shield className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900">Welcome to ComplianceGuard</h2>
                            <p className="max-w-md">
                                Your intelligent regulatory assistant. Upload documents and ask questions with strict citation requirements.
                            </p>
                        </div>
                    )}

                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-3xl rounded-2xl px-6 py-4 shadow-sm ${msg.role === "user"
                                        ? "bg-indigo-600 text-white"
                                        : "bg-white border border-gray-200 text-gray-900"
                                    }`}
                            >
                                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                                {msg.sources && msg.sources.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                                            Citations
                                        </p>
                                        <div className="grid grid-cols-1 gap-2">
                                            {msg.sources.map((source, sIdx) => (
                                                <div
                                                    key={sIdx}
                                                    onClick={() => setSelectedSource(source)}
                                                    className="flex items-start gap-2 text-sm bg-gray-50 p-2 rounded hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100"
                                                >
                                                    <FileText className="w-4 h-4 text-indigo-500 mt-0.5" />
                                                    <div>
                                                        <span className="font-medium text-indigo-700">
                                                            {source.file} (Page {source.page})
                                                        </span>
                                                        <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">
                                                            "{source.content}"
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {msg.latency && (
                                    <div className="mt-2 text-right">
                                        <span className="text-[10px] opacity-50">
                                            {msg.latency.toFixed(2)}s
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </main>

                {/* Input Area */}
                <footer className="bg-white border-t border-gray-200 p-6 flex-shrink-0">
                    <div className="max-w-4xl mx-auto relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Ask a regulatory question..."
                            disabled={loading}
                            className="w-full pl-6 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm text-gray-900 placeholder-gray-400"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            className="absolute right-3 top-3 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="text-center mt-2">
                        <p className="text-xs text-gray-400">ComplianceGuard v1.0 • Enterprise RAG System</p>
                    </div>
                </footer>
            </div>

            {/* PDF Viewer Side Panel */}
            {selectedSource && (
                <div className="w-1/2 border-l border-gray-200 bg-white flex flex-col h-full shadow-xl transition-all duration-300 ease-in-out">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-600" />
                            <span className="font-semibold text-gray-900 truncate max-w-xs">{selectedSource.file}</span>
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Page {selectedSource.page}</span>
                        </div>
                        <button
                            onClick={() => setSelectedSource(null)}
                            className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-200 rounded"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="flex-1 bg-gray-100 p-4">
                        <iframe
                            src={`http://localhost:8000/files/${selectedSource.file}#page=${selectedSource.page}`}
                            className="w-full h-full rounded-lg shadow-sm border border-gray-200 bg-white"
                            title="PDF Viewer"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
