import { useState, useRef, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import "./FloatingChat.css";

function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  if (!isLoggedIn) return null;

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg = { role: "user", content: trimmed };
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await axiosInstance.post("/chat/general", {
        message: trimmed,
        history: messages, // history BEFORE this new message
      });
      setMessages([...updatedHistory, { role: "assistant", content: res.data.reply }]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message.");
      setMessages(messages); // roll back
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="floatingchat-root">
      {open && (
        <div className="floatingchat-panel">
          <div className="floatingchat-header">
            <h4>TripAI Assistant</h4>
            <button className="floatingchat-close" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>

          <div className="floatingchat-messages">
            {messages.length === 0 && (
              <p className="floatingchat-empty">
                Ask me anything — "how do I plan a trip?" or "best time to visit Goa?"
              </p>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-bubble-row ${msg.role === "user" ? "chat-bubble-row-user" : ""}`}
              >
                <div className={`chat-bubble ${msg.role === "user" ? "chat-bubble-user" : "chat-bubble-assistant"}`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-bubble-row">
                <div className="chat-bubble chat-bubble-assistant chat-bubble-typing">
                  <span className="mini-spinner" /> Typing...
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {error && <p className="floatingchat-error">{error}</p>}

          <div className="floatingchat-input-row">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()}>
              Send
            </button>
          </div>
        </div>
      )}

      <button className="floatingchat-toggle" onClick={() => setOpen((prev) => !prev)}>
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}

export default FloatingChat;