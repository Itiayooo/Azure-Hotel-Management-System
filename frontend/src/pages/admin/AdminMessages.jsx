import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FiSearch,
    FiSmile,
    FiPaperclip,
    FiSend
} from 'react-icons/fi';
import AdminHeader from '../../components/admin/AdminHeader';

const AdminMessages = () => {
    const [threads, setThreads] = useState([]);
    const [activeThread, setActiveThread] = useState(null);
    const [activeMessages, setActiveMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingThread, setLoadingThread] = useState(false);

    const token = localStorage.getItem('azure_token');
    const headers = { Authorization: `Bearer ${token}` };

    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.trim().split(/\s+/);
        return parts.length >= 2
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : parts[0][0].toUpperCase();
    };

    const fetchThreads = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8006/api/messages/threads', { headers });
            setThreads(response.data);
            if (response.data.length > 0 && !activeThread) {
                setActiveThread(response.data[0]);
            }
        } catch (error) {
            console.error('Failed to fetch message threads:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchThreads();
        const interval = setInterval(fetchThreads, 8000); // refresh sidebar periodically
        return () => clearInterval(interval);
    }, []);

    const fetchThreadMessages = async (customerId) => {
        setLoadingThread(true);
        try {
            const response = await axios.get(
                `http://127.0.0.1:8006/api/messages/thread/${customerId}`,
                { headers }
            );
            setActiveMessages(response.data);
        } catch (error) {
            console.error('Failed to fetch thread messages:', error);
        } finally {
            setLoadingThread(false);
        }
    };

    useEffect(() => {
        if (activeThread?.customer?._id) {
            fetchThreadMessages(activeThread.customer._id);
        }
    }, [activeThread]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !activeThread) return;

        try {
            const res = await axios.post(
                `http://127.0.0.1:8006/api/messages/${activeThread.customer._id}/reply`,
                { text: messageInput.trim() },
                { headers }
            );
            setActiveMessages((prev) => [...prev, res.data]);
            setMessageInput('');
        } catch (error) {
            console.error('Failed to send reply:', error);
        }
    };

    const filteredThreads = threads.filter((t) =>
        t.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="font-['Mona_Sans',sans-serif] p-6 space-y-6">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 h-[calc(100vh-160px)] min-h-[600px]">

                {/* Left Conversations Sidebar */}
                <div className="lg:col-span-4 bg-white rounded-[13px] p-4 border border-gray-100 shadow-none flex flex-col justify-between">
                    <div className="space-y-4 overflow-hidden flex flex-col flex-1">
                        <div className="relative">
                            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#F7F5F0]/60 border-none rounded-xl pl-9 pr-4 py-2 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#8C6D46]"
                            />
                        </div>

                        <div className="overflow-y-auto space-y-1 flex-1 pr-1 custom-scrollbar">
                            {loading ? (
                                <p className="text-xs text-gray-400 text-center pt-8">Loading conversations...</p>
                            ) : filteredThreads.length === 0 ? (
                                <p className="text-xs text-gray-400 text-center pt-8">No messages yet.</p>
                            ) : (
                                filteredThreads.map((thread) => {
                                    const isActive = activeThread?.customer?._id === thread.customer?._id;
                                    return (
                                        <div
                                            key={thread.customer._id}
                                            onClick={() => setActiveThread(thread)}
                                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${isActive ? 'bg-[#EFECE6]' : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-[#8C6D46] text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                                                {getInitials(thread.customer?.name)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="text-xs font-semibold text-gray-900 truncate">
                                                        {thread.customer?.name}
                                                    </h4>
                                                    <span className="text-[10px] text-gray-400">
                                                        {new Date(thread.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[11px] text-gray-400 truncate pr-2">
                                                        {thread.lastMessage}
                                                    </p>
                                                    {thread.hasUnread && (
                                                        <span className="w-2 h-2 rounded-full bg-[#EA4335] flex-shrink-0" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Chat Pane */}
                <div className="lg:col-span-8 bg-white rounded-[13px] border border-gray-100 shadow-none flex flex-col justify-between overflow-hidden">
                    {activeThread ? (
                        <>
                            <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white">
                                <div className="w-9 h-9 rounded-full bg-[#8C6D46] text-white flex items-center justify-center text-xs font-semibold">
                                    {getInitials(activeThread.customer?.name)}
                                </div>
                                <div>
                                    <h3 className="text-xs font-semibold text-gray-900">
                                        {activeThread.customer?.name}
                                    </h3>
                                    <p className="text-[10px] text-gray-400">{activeThread.customer?.email}</p>
                                </div>
                            </div>

                            {/* Messages Body Area */}
                            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#F9F9F9]">
                                {loadingThread ? (
                                    <p className="text-xs text-gray-400 text-center pt-8">Loading messages...</p>
                                ) : activeMessages.length === 0 ? (
                                    <p className="text-xs text-gray-400 text-center pt-8">No messages in this thread yet.</p>
                                ) : (
                                    activeMessages.map((msg) => {
                                        const isAdmin = msg.sender === 'admin';
                                        return (
                                            <div
                                                key={msg._id}
                                                className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[70%] p-3.5 text-xs leading-relaxed ${isAdmin
                                                        ? 'bg-[#8C6D46] text-white rounded-2xl rounded-tr-none'
                                                        : 'bg-[#EFECE6] text-gray-800 rounded-2xl rounded-tl-none'
                                                        }`}
                                                >
                                                    {msg.text}
                                                </div>
                                                <span className="text-[9px] text-gray-400 mt-1 px-1">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <form
                                onSubmit={handleSendMessage}
                                className="p-4 bg-white flex items-center gap-3 border-t border-gray-100"
                            >
                                <div className="flex items-center gap-2 text-gray-400">
                                    <button type="button" className="p-1 hover:text-gray-600 transition text-base">
                                        <FiSmile />
                                    </button>
                                    <button type="button" className="p-1 hover:text-gray-600 transition text-base">
                                        <FiPaperclip />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    className="flex-1 bg-transparent text-xs text-gray-800 focus:outline-none px-2"
                                />
                                <button
                                    type="submit"
                                    className="w-9 h-9 bg-[#8C6D46] text-white rounded-xl flex items-center justify-center hover:opacity-90 transition"
                                >
                                    <FiSend className="text-xs" />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-xs text-gray-400 bg-[#F9F9F9]">
                            Select a conversation to start messaging
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminMessages;