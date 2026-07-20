import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X } from 'lucide-react';
import { sendChatMessage } from '@/lib/api';
import { CHAT } from '@/constants/testIds';

const SESSION_KEY = 'theview_chat_session_v1';
const HISTORY_KEY = 'theview_chat_history_v1';

const greeting = {
        role: 'assistant',
        content:
                'Welcome to THE VIEW. I’m Aria, your digital concierge. Would you like to know about plot sizes, amenities, or arrange a site visit?',
};

export default function Chatbot() {
        const [open, setOpen] = useState(false);
        const [messages, setMessages] = useState(() => {
                try {
                        const cached = JSON.parse(localStorage.getItem(HISTORY_KEY) || 'null');
                        if (cached && Array.isArray(cached) && cached.length) return cached;
                } catch {
                        /* ignore */
                }
                return [greeting];
        });
        const [input, setInput] = useState('');
        const [loading, setLoading] = useState(false);
        const [sessionId] = useState(() => {
                const existing = localStorage.getItem(SESSION_KEY);
                if (existing) return existing;
                const fresh = `sess-${Math.random().toString(36).slice(2)}-${Date.now()}`;
                localStorage.setItem(SESSION_KEY, fresh);
                return fresh;
        });
        const scrollRef = useRef(null);

        useEffect(() => {
                localStorage.setItem(HISTORY_KEY, JSON.stringify(messages));
                if (scrollRef.current) {
                        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }
        }, [messages]);

        const send = async (e) => {
                e?.preventDefault();
                const text = input.trim();
                if (!text || loading) return;
                const next = [...messages, { role: 'user', content: text }];
                setMessages(next);
                setInput('');
                setLoading(true);
                try {
                        const data = await sendChatMessage({ session_id: sessionId, message: text });
                        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
                } catch (err) {
                        setMessages((prev) => [
                                ...prev,
                                {
                                        role: 'assistant',
                                        content:
                                                'Apologies — I’m unable to respond right now. Please share your number via our contact form and our team will call you back within the hour.',
                                },
                        ]);
                } finally {
                        setLoading(false);
                }
        };

        return (
                <>
                        <button
                                type="button"
                                data-testid={CHAT.toggle}
                                onClick={() => setOpen((v) => !v)}
                                aria-label="Chat with Aria"
                                className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-obsidian border border-[rgba(201,162,75,0.6)] shadow-[0_0_0_0_rgba(201,162,75,0.6)] transition-shadow animate-gold-pulse hover:border-gold-bright"
                        >
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                        <path
                                                d="M4 6 L12 3 L20 6 L20 14 L12 20 L4 14 Z"
                                                stroke="url(#chatGold)"
                                                strokeWidth="1.4"
                                                strokeLinejoin="round"
                                        />
                                        <circle cx="12" cy="11" r="1.6" fill="#E8C978" />
                                        <defs>
                                                <linearGradient id="chatGold" x1="0" y1="0" x2="1" y2="1">
                                                        <stop offset="0%" stopColor="#BF953F" />
                                                        <stop offset="60%" stopColor="#FCF6BA" />
                                                        <stop offset="100%" stopColor="#AA771C" />
                                                </linearGradient>
                                        </defs>
                                </svg>
                        </button>

                        <AnimatePresence>
                                {open && (
                                        <motion.div
                                                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                                data-testid={CHAT.panel}
                                                className="fixed bottom-24 right-6 z-50 flex h-[520px] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-sm border border-[rgba(201,162,75,0.4)] bg-obsidian-2 shadow-2xl"
                                        >
                                                <div className="flex items-start justify-between border-b border-[rgba(201,162,75,0.2)] bg-ink px-5 py-4">
                                                        <div>
                                                                <div className="font-display text-sm tracking-[0.24em] text-ivory">
                                                                        ARIA
                                                                </div>
                                                                <div className="mt-1 text-[0.6rem] uppercase tracking-[0.32em] text-gold">
                                                                        Digital Concierge · The View
                                                                </div>
                                                        </div>
                                                        <button
                                                                type="button"
                                                                onClick={() => setOpen(false)}
                                                                data-testid={CHAT.closeButton}
                                                                aria-label="Close chat"
                                                                className="text-ivory-dim hover:text-ivory"
                                                        >
                                                                <X size={18} />
                                                        </button>
                                                </div>

                                                <div
                                                        ref={scrollRef}
                                                        data-testid={CHAT.messagesContainer}
                                                        className="flex-1 space-y-4 overflow-y-auto bg-obsidian-2 px-4 py-5"
                                                >
                                                        {messages.map((m, i) => (
                                                                <div
                                                                        key={i}
                                                                        className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                                                >
                                                                        <div
                                                                                className={`max-w-[80%] rounded-sm px-3.5 py-2.5 text-sm leading-relaxed ${
                                                                                        m.role === 'user'
                                                                                                ? 'bg-gold/15 text-ivory border border-[rgba(201,162,75,0.35)]'
                                                                                                : 'bg-ink text-ivory-dim border border-[rgba(255,255,255,0.06)]'
                                                                                }`}
                                                                        >
                                                                                {m.content}
                                                                        </div>
                                                                </div>
                                                        ))}
                                                        {loading && (
                                                                <div className="flex items-center gap-2 text-xs text-ivory-dim">
                                                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
                                                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold [animation-delay:0.2s]" />
                                                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold [animation-delay:0.4s]" />
                                                                </div>
                                                        )}
                                                </div>

                                                <form
                                                        onSubmit={send}
                                                        className="flex items-center gap-2 border-t border-[rgba(201,162,75,0.2)] bg-ink px-3 py-3"
                                                >
                                                        <input
                                                                data-testid={CHAT.input}
                                                                value={input}
                                                                onChange={(e) => setInput(e.target.value)}
                                                                placeholder="Ask about plots, pricing, visit…"
                                                                className="flex-1 border-b border-[rgba(201,162,75,0.25)] bg-transparent px-2 py-2 text-sm text-ivory placeholder:text-ivory-dim/60 focus:border-gold focus:outline-none"
                                                        />
                                                        <button
                                                                type="submit"
                                                                data-testid={CHAT.sendButton}
                                                                disabled={loading || !input.trim()}
                                                                className="flex h-9 w-9 items-center justify-center border border-[rgba(201,162,75,0.5)] text-gold disabled:opacity-40 hover:bg-gold hover:text-ink"
                                                                aria-label="Send"
                                                        >
                                                                <Send size={15} />
                                                        </button>
                                                </form>
                                        </motion.div>
                                )}
                        </AnimatePresence>
                </>
        );
}
