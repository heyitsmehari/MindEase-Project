import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Heart, RefreshCw, AlertTriangle } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────
interface Message {
    role: "user" | "assistant";
    content: string;
    time: string;
    error?: boolean;
}

// ── Gemini setup ──────────────────────────────────────────────────────────
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are Dr. AIna, a warm, deeply empathetic virtual psychologist and mental wellness companion built into MindEase — a student mental health platform. You are trained in Cognitive Behavioural Therapy (CBT), mindfulness-based therapy, and supportive counselling.

YOUR CORE PRINCIPLES:
- You listen first, advice second. Validate feelings before offering perspective.
- You NEVER dismiss, minimise, or judge what a user shares.
- You ask gentle, open-ended follow-up questions to help users explore their feelings.
- You use the user's own words back to them so they feel truly heard.
- You are calm, grounded, and non-clinical — like a wise, caring friend who also happens to have a psychology degree.
- You acknowledge when something sounds really hard without catastrophising.
- You celebrate small wins and normalise struggles.

TONE RULES:
- Warm, conversational, and human. Never robotic or scripted.
- Use short paragraphs — never walls of text.
- Don't start responses with phrases like "I understand that..." or "Certainly!" or "Of course!" — be more natural.
- Avoid giving long lists of tips unless the user explicitly asks for strategies.
- Mirror the user's energy: if they are distressed, be soft and slow. If they seem lighter, you can be gently encouraging.

MENTAL HEALTH APPROACH:
- For anxiety: acknowledge the physical and mental experience, then offer grounding (5-4-3-2-1 technique, breathing) only when appropriate.
- For depression/low mood: validate without toxic positivity. Gently explore what's shifted recently.
- For academic stress: normalise the pressure students face; explore perfectionism if relevant.
- For loneliness: make the user feel genuinely seen and connected in this conversation first.
- For grief/loss: sit with them in the pain. Don't rush to silver linings.
- For anger: validate the anger, explore what it's protecting underneath.
- For relationships: be non-judgmental; explore the user's feelings, not who is right/wrong.

CRISIS PROTOCOL:
If someone mentions suicide, self-harm, or being in immediate danger:
1. Respond with warmth and urgency — acknowledge their pain directly.
2. ALWAYS share this: "iCall Helpline: 9152987821 (Mon–Sat, 8am–10pm)" and "Vandrevala Foundation: 1860-2662-345 (24/7)"
3. Encourage them to reach out to MindEase's appointment page to talk to a real counsellor.
4. Stay present — don't abruptly end the conversation.

BOUNDARIES:
- You are not a replacement for professional therapy. When appropriate (not too often), gently encourage professional support.
- You do not diagnose conditions.
- If asked to do something outside your role (homework, coding, etc.), kindly redirect: "I'm here just for your emotional wellbeing — that's where I can truly help."

Keep responses concise (3–6 sentences ideally) unless the topic warrants more depth. Always end with either a gentle question, a reflection, or a warm invitation to share more.`;

// ── Helpers ───────────────────────────────────────────────────────────────
function nowTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

async function callGemini(history: Message[]): Promise<string> {
    // Build Gemini message array (user/model alternating)
    const contents = history.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
    }));

    const body = {
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
            temperature: 0.85,
            topP: 0.95,
            maxOutputTokens: 512,
        },
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
        const msg = (err as any)?.error?.message || `HTTP ${res.status}`;
        throw new Error(msg);
    }

    const data = await res.json();
    const text: string =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I'm having trouble finding my words right now. Can you try again in a moment?";
    return text.trim();
}

// ── Suggestion chips ──────────────────────────────────────────────────────
const SUGGESTIONS = [
    "I'm feeling really anxious today",
    "I'm so stressed about my exams",
    "I feel lonely and disconnected",
    "I can't seem to focus on anything",
    "I've been feeling really low lately",
    "I'm struggling with a relationship",
];

// ── Component ─────────────────────────────────────────────────────────────
const Chatbot: React.FC = () => {
    const WELCOME: Message = {
        role: "assistant",
        content:
            "Hi, I'm Dr. AIna — your MindEase wellness companion. This is a safe, private space where you can share anything on your mind without judgment. How are you feeling right now?",
        time: nowTime(),
    };

    const [messages, setMessages] = useState<Message[]>([WELCOME]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [apiKeyMissing, setApiKeyMissing] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
            setApiKeyMissing(true);
        }
    }, []);

useEffect(() => {
    if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
}, [messages, loading]);

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || loading) return;

        const userMsg: Message = { role: "user", content: text, time: nowTime() };
        const updatedHistory = [...messages, userMsg];

        setMessages(updatedHistory);
        setInput("");
        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
        setLoading(true);

        try {
            const reply = await callGemini(updatedHistory);
            setMessages([...updatedHistory, { role: "assistant", content: reply, time: nowTime() }]);
        } catch (err: any) {
            const errMsg =
                err?.message?.includes("API_KEY_INVALID") || err?.message?.includes("API key")
                    ? "API key is invalid. Please add your Gemini key to .env.local"
                    : "I'm having a moment of difficulty connecting. Please try again.";
            setMessages([
                ...updatedHistory,
                { role: "assistant", content: errMsg, time: nowTime(), error: true },
            ]);
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

    const handleSuggestion = (s: string) => {
        setInput(s);
        textareaRef.current?.focus();
    };

    const resetChat = () => {
        setMessages([{ ...WELCOME, time: nowTime() }]);
        setInput("");
    };

    const hasOnlyWelcome = messages.length === 1;

    return (
        <div
            className="min-h-screen flex flex-col items-center py-10 px-4"
            style={{
                background: "linear-gradient(160deg, #FFF5F7 0%, #ffffff 55%, #FFF0F4 100%)",
            }}
        >
            {/* Page heading */}
            <div className="w-full max-w-2xl mb-6 text-center">
                <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-3"
                    style={{
                        background: "rgba(212,97,122,0.08)",
                        color: "#D4617A",
                        border: "1.5px solid #F9C5CC",
                    }}
                >
                    <Heart size={13} className="fill-current" />
                    Safe · Private · Confidential
                </div>

                <h1
                    className="text-3xl md:text-4xl font-black tracking-tight"
                    style={{ color: "#3D1520" }}
                >
                    Dr. AIna —{" "}
                    <span
                        style={{
                            background: "linear-gradient(135deg, #D4617A, #C44A6A)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        AI Wellness Companion
                    </span>
                </h1>
                <p
                    className="text-sm mt-2 font-medium max-w-md mx-auto"
                    style={{ color: "#7A3545", opacity: 0.75 }}
                >
                    Trained in CBT, mindfulness & supportive counselling. Talk freely — you deserve to be heard.
                </p>
            </div>

            {/* API key warning banner */}
            {apiKeyMissing && (
                <div
                    className="w-full max-w-2xl mb-4 px-5 py-4 rounded-2xl flex items-start gap-3"
                    style={{
                        background: "rgba(251,146,60,0.10)",
                        border: "1.5px solid rgba(251,146,60,0.35)",
                    }}
                >
                    <AlertTriangle size={18} className="shrink-0 mt-0.5" style={{ color: "#EA580C" }} />
                    <div>
                        <p className="text-sm font-bold" style={{ color: "#9A3412" }}>
                            Gemini API key not configured
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "#C2410C" }}>
                            Get a free key at{" "}
                            <a
                                href="https://aistudio.google.com/app/apikey"
                                target="_blank"
                                rel="noreferrer"
                                className="underline font-semibold"
                            >
                                aistudio.google.com
                            </a>{" "}
                            then add it to <code className="bg-orange-100 px-1 rounded">.env.local</code> as{" "}
                            <code className="bg-orange-100 px-1 rounded">VITE_GEMINI_API_KEY=your_key</code> and
                            restart the dev server.
                        </p>
                    </div>
                </div>
            )}

            {/* Chat window */}
            <div
                className="w-full max-w-2xl rounded-[2rem] overflow-hidden flex flex-col"
                style={{
                    background: "rgba(255,255,255,0.94)",
                    border: "1.5px solid #F9C5CC",
                    boxShadow:
                        "0 24px 70px rgba(212,97,122,0.12), 0 4px 20px rgba(0,0,0,0.04)",
                    backdropFilter: "blur(14px)",
                    height: "clamp(520px, 72vh, 720px)",
                }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-6 py-4 shrink-0"
                    style={{ background: "linear-gradient(135deg, #D4617A, #C44A6A)" }}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="w-11 h-11 rounded-2xl flex items-center justify-center relative"
                            style={{ background: "rgba(255,255,255,0.22)" }}
                        >
                            <Bot size={22} className="text-white" />
                            {/* Online dot */}
                            <span
                                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
                                style={{ background: "#4ade80" }}
                            />
                        </div>
                        <div>
                            <p className="text-white font-black text-sm leading-tight">Dr. AIna</p>
                            <p className="text-white text-xs" style={{ opacity: 0.82 }}>
                                MindEase AI · Always here
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={resetChat}
                        title="Start new conversation"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                        style={{
                            background: "rgba(255,255,255,0.18)",
                            color: "white",
                            border: "1px solid rgba(255,255,255,0.30)",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "rgba(255,255,255,0.30)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "rgba(255,255,255,0.18)")
                        }
                    >
                        <RefreshCw size={12} />
                        New Chat
                    </button>
                </div>

                {/* Messages */}
                <div
                    className="flex-1 overflow-y-auto px-5 py-5 space-y-5"
                    style={{ scrollbarWidth: "thin", scrollbarColor: "#F4A0B0 transparent" }}
                >
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex items-end gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                }`}
                        >
                            {/* Avatar */}
                            <div
                                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mb-5"
                                style={{
                                    background:
                                        msg.role === "assistant"
                                            ? "linear-gradient(135deg, #D4617A, #C44A6A)"
                                            : "rgba(212,97,122,0.08)",
                                    border:
                                        msg.role === "user" ? "1.5px solid #F9C5CC" : "none",
                                }}
                            >
                                {msg.role === "assistant" ? (
                                    <Bot size={15} className="text-white" />
                                ) : (
                                    <User size={15} style={{ color: "#D4617A" }} />
                                )}
                            </div>

                            {/* Bubble */}
                            <div
                                className={`flex flex-col gap-1 max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"
                                    }`}
                            >
                                <div
                                    className="px-4 py-3 text-sm leading-relaxed font-medium whitespace-pre-wrap"
                                    style={
                                        msg.role === "assistant"
                                            ? {
                                                background: msg.error ? "rgba(251,146,60,0.08)" : "#FFF0F4",
                                                color: "#3D1520",
                                                border: `1.5px solid ${msg.error ? "rgba(251,146,60,0.35)" : "#F9C5CC"}`,
                                                borderRadius: "1.4rem 1.4rem 1.4rem 4px",
                                            }
                                            : {
                                                background: "linear-gradient(135deg, #D4617A, #C44A6A)",
                                                color: "white",
                                                borderRadius: "1.4rem 1.4rem 4px 1.4rem",
                                                boxShadow: "0 4px 18px rgba(212,97,122,0.35)",
                                            }
                                    }
                                >
                                    {msg.content}
                                </div>
                                <span
                                    className="text-[10px] font-semibold px-1"
                                    style={{ color: "#7A3545", opacity: 0.45 }}
                                >
                                    {msg.time}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {loading && (
                        <div className="flex items-end gap-2.5">
                            <div
                                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                                style={{ background: "linear-gradient(135deg, #D4617A, #C44A6A)" }}
                            >
                                <Bot size={15} className="text-white" />
                            </div>
                            <div
                                className="px-4 py-3.5 flex items-center gap-1.5"
                                style={{
                                    background: "#FFF0F4",
                                    border: "1.5px solid #F9C5CC",
                                    borderRadius: "1.4rem 1.4rem 1.4rem 4px",
                                }}
                            >
                                {[0, 1, 2].map((d) => (
                                    <div
                                        key={d}
                                        className="w-2 h-2 rounded-full animate-bounce"
                                        style={{
                                            background: "#D4617A",
                                            animationDelay: `${d * 0.18}s`,
                                            animationDuration: "0.75s",
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                {/* Suggestion chips — shown only at the start */}
                {hasOnlyWelcome && !loading && (
                    <div
                        className="px-5 pb-3 shrink-0"
                        style={{ borderTop: "1.5px solid #FEE8EE" }}
                    >
                        <p
                            className="text-[10px] font-black uppercase tracking-widest mt-3 mb-2"
                            style={{ color: "#7A3545", opacity: 0.5 }}
                        >
                            Quick start
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {SUGGESTIONS.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => handleSuggestion(s)}
                                    className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                                    style={{
                                        background: "rgba(212,97,122,0.07)",
                                        color: "#D4617A",
                                        border: "1.5px solid #F9C5CC",
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.background = "rgba(212,97,122,0.15)")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.background = "rgba(212,97,122,0.07)")
                                    }
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input area */}
                <div
                    className="px-5 py-4 shrink-0"
                    style={{
                        borderTop: "1.5px solid #F9C5CC",
                        background: "rgba(255,255,255,0.75)",
                    }}
                >
                    <div className="flex items-end gap-3">
                        <textarea
                            ref={textareaRef}
                            className="flex-1 resize-none rounded-2xl px-4 py-3 text-sm font-medium outline-none transition-all"
                            placeholder="Share how you're feeling…"
                            rows={1}
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                e.target.style.height = "auto";
                                e.target.style.height =
                                    Math.min(e.target.scrollHeight, 130) + "px";
                            }}
                            onKeyDown={handleKey}
                            disabled={loading}
                            style={{
                                background: "#FFF5F7",
                                border: "1.5px solid #F9C5CC",
                                color: "#3D1520",
                                maxHeight: 130,
                            }}
                        />
                        <button
                            type="button"
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0"
                            style={{
                                background:
                                    !input.trim() || loading
                                        ? "rgba(212,97,122,0.15)"
                                        : "linear-gradient(135deg, #D4617A, #C44A6A)",
                                color:
                                    !input.trim() || loading ? "#F4A0B0" : "white",
                                boxShadow:
                                    !input.trim() || loading
                                        ? "none"
                                        : "0 4px 18px rgba(212,97,122,0.40)",
                                cursor: !input.trim() || loading ? "not-allowed" : "pointer",
                            }}
                        >
                            <Send size={18} />
                        </button>
                    </div>

                    <p
                        className="text-[10px] mt-2.5 text-center font-medium"
                        style={{ color: "#7A3545", opacity: 0.45 }}
                    >
                        Not a licensed therapist. Crisis? iCall: 9152987821 · Vandrevala: 1860-2662-345
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;