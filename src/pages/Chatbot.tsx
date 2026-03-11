import React, { useState } from "react";

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const HF_TOKEN = "PASTE_YOUR_HF_TOKEN_HERE";

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            inputs: `You are a compassionate psychologist who listens carefully and gives supportive advice.\nUser: ${input}\nAssistant:`
          })
        }
      );

      const data = await response.json();

      const reply =
        data?.[0]?.generated_text?.split("Assistant:").pop() ||
        "Sorry, I couldn't respond.";

      setMessages([...newMessages, { role: "assistant", content: reply }]);

    } catch (error) {
      console.error(error);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Error contacting AI." }
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto max-w-xl p-4">

      <h1 className="text-3xl font-bold mb-4">
        MindEase AI Therapist
      </h1>

      <div className="border rounded p-4 h-96 overflow-y-scroll bg-gray-50">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-3 ${msg.role === "user" ? "text-right" : "text-left"
              }`}
          >
            <span
              className={`inline-block p-2 rounded ${msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
                }`}
            >
              {msg.content}
            </span>
          </div>
        ))}

        {loading && (
          <p className="text-gray-500">AI is typing...</p>
        )}

      </div>

      <div className="flex mt-4">

        <input
          className="flex-grow border rounded p-2"
          placeholder="Tell me how you're feeling..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>

      </div>

      <p className="text-xs text-gray-500 mt-3">
        This AI is not a licensed therapist. If you are in crisis,
        please contact a professional.
      </p>

    </div>
  );
};

export default Chatbot;