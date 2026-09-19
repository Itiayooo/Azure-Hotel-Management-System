import React, { useState, useEffect, useRef } from 'react';

const MessagesPanel = () => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const bottomRef = useRef(null);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('azure_token');
            const res = await fetch('/api/messages/my', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) setMessages(data);
        } catch (err) {
            console.error('Failed to load messages:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // poll every 5s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        try {
            const token = localStorage.getItem('azure_token');
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ text }),
            });
            const newMessage = await res.json();
            if (res.ok) {
                setMessages((prev) => [...prev, newMessage]);
                setText('');
            }
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    return (
        <div className="flex flex-col h-[500px]">
            <h2 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-100 pb-3">
                Messages
            </h2>

            <div className="flex-1 overflow-y-auto space-y-3 px-1 py-2">
                {loading ? (
                    <p className="text-sm text-gray-400 text-center pt-8">Loading messages...</p>
                ) : messages.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center pt-8">
                        No messages yet. Say hello to the front desk!
                    </p>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg._id}
                            className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${msg.sender === 'customer'
                                    ? 'bg-[#8C6D46] text-white rounded-br-sm'
                                    : 'bg-[#F5F5F3] text-gray-800 rounded-bl-sm'
                                    }`}
                            >
                                <p>{msg.text}</p>
                                <p className={`text-[10px] mt-1 ${msg.sender === 'customer' ? 'text-white/60' : 'text-gray-400'}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2 pt-4 border-t border-gray-100 mt-2">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-[#F5F5F3] border-0 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#8C6D46]"
                />
                <button
                    type="submit"
                    className="bg-[#8C6D46] hover:bg-[#785C3A] text-white p-2.5 rounded-full transition-colors"
                    aria-label="Send message"
                >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default MessagesPanel;