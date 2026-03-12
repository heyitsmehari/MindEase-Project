import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, User, X, MessageCircle, RefreshCw } from "lucide-react";

interface Message {
    role: "user" | "assistant";
    content: string;
    time: string;
    error?: boolean;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are Dr. AIna, a warm, deeply empathetic virtual psychologist and mental wellness companion built into MindEase — a student mental health platform. You are trained in Cognitive Behavioural Therapy (CBT), mindfulness-based therapy, and supportive counselling.

YOUR CORE PRINCIPLES:
- You listen first, advice second. Validate feelings before offering perspective.
- You NEVER dismiss, minimise, or judge what a user shares.
- You ask gentle, open-ended follow-up questions to help users explore their feelings.
- You are calm, grounded, and non-clinical — like a wise, caring friend who also happens to have a psychology degree.

TONE RULES:
- Warm, conversational, and human. Never robotic or scripted.
- Use short paragraphs — never walls of text.
- Don't start responses with phrases like "I understand that..." or "Certainly!" — be more natural.
- Mirror the user's energy: if they are distressed, be soft and slow.

CRISIS PROTOCOL:
If someone mentions suicide, self-harm, or being in immediate danger:
1. Respond with warmth and urgency.
2. ALWAYS share: "iCall Helpline: 9152987821 (Mon–Sat, 8am–10pm)" and "Vandrevala Foundation: 1860-2662-345 (24/7)"

Keep responses concise (2–4 sentences). Always end with a gentle question or warm invitation to share more.`;

function nowTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

async function callGemini(history: Message[]): Promise<string> {
    const contents = history.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
    }));

    const body = {
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { temperature: 0.85, topP: 0.95, maxOutputTokens: 300 },
        safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
        ],
    };

    const res = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any)?.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    return (data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble connecting. Please try again.").trim();
}

const WELCOME: Message = {
    role: "assistant",
    content: "Hi, I'm Dr. AIna 👋 Your MindEase wellness companion. How are you feeling right now?",
    time: nowTime(),
};

const FloatingChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([WELCOME]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPulse, setShowPulse] = useState(true);
    const bottomRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [messages, loading]);

    // Stop pulse after first open
    useEffect(() => {
        if (isOpen) setShowPulse(false);
    }, [isOpen]);

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || loading) return;

        const userMsg: Message = { role: "user", content: text, time: nowTime() };
        const updatedHistory = [...messages, userMsg];
        setMessages(updatedHistory);
        setInput("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
        setLoading(true);

        try {
            const reply = await callGemini(updatedHistory);
            setMessages([...updatedHistory, { role: "assistant", content: reply, time: nowTime() }]);
        } catch {
            setMessages([...updatedHistory, {
                role: "assistant",
                content: "I'm having a moment of difficulty connecting. Please try again.",
                time: nowTime(),
                error: true,
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const resetChat = () => {
        setMessages([{ ...WELCOME, time: nowTime() }]);
        setInput("");
    };

    return (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}>
            {/* Chat window */}
            {isOpen && (
                <div
                    style={{
                        position: "absolute",
                        bottom: 72,
                        right: 0,
                        width: 340,
                        height: 480,
                        borderRadius: 20,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        background: "rgba(255,255,255,0.98)",
                        border: "1.5px solid #F9C5CC",
                        boxShadow: "0 20px 60px rgba(212,97,122,0.18), 0 4px 20px rgba(0,0,0,0.08)",
                        animation: "slideUp 0.25s ease",
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            background: "linear-gradient(135deg, #D4617A, #C44A6A)",
                            padding: "12px 16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexShrink: 0,
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 10,
                                background: "rgba(255,255,255,0.22)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                position: "relative",
                            }}>
                                <Bot size={18} color="white" />
                                <span style={{
                                    position: "absolute", bottom: -1, right: -1,
                                    width: 10, height: 10, borderRadius: "50%",
                                    background: "#4ade80", border: "2px solid white",
                                }} />
                            </div>
                            <div>
                                <p style={{ color: "white", fontWeight: 800, fontSize: 13, margin: 0 }}>Dr. AIna</p>
                                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, margin: 0 }}>MindEase AI · Always here</p>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                            <button
                                type="button"
                                onClick={resetChat}
                                style={{
                                    background: "rgba(255,255,255,0.18)", border: "none",
                                    borderRadius: 8, padding: "4px 8px", cursor: "pointer",
                                    color: "white", display: "flex", alignItems: "center",
                                }}
                                title="New chat"
                            >
                                <RefreshCw size={13} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                style={{
                                    background: "rgba(255,255,255,0.18)", border: "none",
                                    borderRadius: 8, padding: "4px 8px", cursor: "pointer",
                                    color: "white", display: "flex", alignItems: "center",
                                }}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1, overflowY: "auto", padding: "12px",
                        display: "flex", flexDirection: "column", gap: 10,
                        scrollbarWidth: "thin", scrollbarColor: "#F4A0B0 transparent",
                    }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{
                                display: "flex",
                                flexDirection: msg.role === "user" ? "row-reverse" : "row",
                                alignItems: "flex-end", gap: 7,
                            }}>
                                <div style={{
                                    width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    marginBottom: 14,
                                    background: msg.role === "assistant"
                                        ? "linear-gradient(135deg, #D4617A, #C44A6A)"
                                        : "rgba(212,97,122,0.08)",
                                    border: msg.role === "user" ? "1.5px solid #F9C5CC" : "none",
                                }}>
                                    {msg.role === "assistant"
                                        ? <Bot size={13} color="white" />
                                        : <User size={13} color="#D4617A" />}
                                </div>
                                <div style={{
                                    display: "flex", flexDirection: "column",
                                    alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                                    maxWidth: "78%", gap: 3,
                                }}>
                                    <div style={msg.role === "assistant" ? {
                                        background: msg.error ? "rgba(251,146,60,0.08)" : "#FFF0F4",
                                        color: "#3D1520",
                                        border: `1.5px solid ${msg.error ? "rgba(251,146,60,0.35)" : "#F9C5CC"}`,
                                        borderRadius: "14px 14px 14px 3px",
                                        padding: "8px 12px", fontSize: 13, lineHeight: 1.55,
                                        whiteSpace: "pre-wrap",
                                    } : {
                                        background: "linear-gradient(135deg, #D4617A, #C44A6A)",
                                        color: "white",
                                        borderRadius: "14px 14px 3px 14px",
                                        padding: "8px 12px", fontSize: 13, lineHeight: 1.55,
                                        boxShadow: "0 3px 12px rgba(212,97,122,0.30)",
                                        whiteSpace: "pre-wrap",
                                    }}>
                                        {msg.content}
                                    </div>
                                    <span style={{ fontSize: 10, color: "#7A3545", opacity: 0.4 }}>{msg.time}</span>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div style={{ display: "flex", alignItems: "flex-end", gap: 7 }}>
                                <div style={{
                                    width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                                    background: "linear-gradient(135deg, #D4617A, #C44A6A)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <Bot size={13} color="white" />
                                </div>
                                <div style={{
                                    background: "#FFF0F4", border: "1.5px solid #F9C5CC",
                                    borderRadius: "14px 14px 14px 3px",
                                    padding: "10px 14px", display: "flex", gap: 5,
                                }}>
                                    {[0, 1, 2].map((d) => (
                                        <div key={d} style={{
                                            width: 7, height: 7, borderRadius: "50%",
                                            background: "#D4617A",
                                            animation: "bounce 0.75s infinite",
                                            animationDelay: `${d * 0.18}s`,
                                        }} />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div style={{
                        padding: "10px 12px",
                        borderTop: "1.5px solid #F9C5CC",
                        background: "rgba(255,255,255,0.9)",
                        flexShrink: 0,
                    }}>
                        <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                            <textarea
                                ref={textareaRef}
                                rows={1}
                                value={input}
                                placeholder="Share how you're feeling…"
                                onChange={(e) => {
                                    setInput(e.target.value);
                                    e.target.style.height = "auto";
                                    e.target.style.height = Math.min(e.target.scrollHeight, 80) + "px";
                                }}
                                onKeyDown={handleKey}
                                disabled={loading}
                                style={{
                                    flex: 1, resize: "none", borderRadius: 12,
                                    padding: "8px 12px", fontSize: 13,
                                    outline: "none", background: "#FFF5F7",
                                    border: "1.5px solid #F9C5CC", color: "#3D1520",
                                    maxHeight: 80, fontFamily: "inherit",
                                }}
                            />
                            <button
                                type="button"
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                                style={{
                                    width: 38, height: 38, borderRadius: 11, border: "none",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    flexShrink: 0,
                                    background: !input.trim() || loading
                                        ? "rgba(212,97,122,0.15)"
                                        : "linear-gradient(135deg, #D4617A, #C44A6A)",
                                    color: !input.trim() || loading ? "#F4A0B0" : "white",
                                    cursor: !input.trim() || loading ? "not-allowed" : "pointer",
                                    boxShadow: !input.trim() || loading ? "none" : "0 3px 12px rgba(212,97,122,0.35)",
                                }}
                            >
                                <Send size={15} />
                            </button>
                        </div>
                        <p style={{ fontSize: 9, textAlign: "center", color: "#7A3545", opacity: 0.4, margin: "6px 0 0" }}>
                            Crisis? iCall: 9152987821 · Vandrevala: 1860-2662-345
                        </p>
                    </div>
                </div>
            )}

            {/* Floating button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: 56, height: 56, borderRadius: "50%", border: "none",
                    background: "linear-gradient(135deg, #D4617A, #C44A6A)",
                    color: "white", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 20px rgba(212,97,122,0.45)",
                    position: "relative",
                }}
            >
                {isOpen ? <X size={22} /> : <MessageCircle size={22} />}

                {/* Pulse ring */}
                {showPulse && !isOpen && (
                    <span style={{
                        position: "absolute", inset: -4,
                        borderRadius: "50%",
                        border: "2px solid #D4617A",
                        animation: "ping 1.5s ease-out infinite",
                        opacity: 0.6,
                    }} />
                )}

                {/* Tooltip */}
                {!isOpen && (
                    <div style={{
                        position: "absolute", right: 64, top: "50%",
                        transform: "translateY(-50%)",
                        background: "#3D1520", color: "white",
                        padding: "6px 12px", borderRadius: 8,
                        fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                        pointerEvents: "none",
                    }}>
                        Need help? Chat with Dr. AIna
                        <span style={{
                            position: "absolute", right: -5, top: "50%",
                            transform: "translateY(-50%)",
                            width: 0, height: 0,
                            borderTop: "5px solid transparent",
                            borderBottom: "5px solid transparent",
                            borderLeft: "5px solid #3D1520",
                        }} />
                    </div>
                )}
            </button>

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                @keyframes ping {
                    0% { transform: scale(1); opacity: 0.6; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default FloatingChatWidget;
