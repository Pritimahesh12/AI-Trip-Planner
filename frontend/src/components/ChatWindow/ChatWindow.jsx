import { useState, useRef, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import "./ChatWindow.css";

function ChatWindow({ tripId, initialMessages = [], allPlaceNames = [], destination = "" }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg = { role: "user", content: trimmed, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      
      const mentionedPlaces = allPlaceNames.filter((name) =>
        trimmed.toLowerCase().includes(name.toLowerCase())
      );

      const placeContext = {};
      await Promise.all(
        mentionedPlaces.map(async (name) => {
          try {
            const res = await axiosInstance.get("/places/details", {
              params: { query: name, destination },
            });
            placeContext[name] = res.data;
          } catch {}
        })
      );

      const res = await axiosInstance.post(`/trips/${tripId}/chat`, {
        message: trimmed,
        placeContext,
      });
      setMessages(res.data.messages);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message. Please try again.");
      setMessages((prev) => prev.filter((m) => m !== userMsg));
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
    <div className="chatwindow-card">
      <div className="chatwindow-header">
        <h4>Trip Assistant</h4>
      </div>

      <div className="chatwindow-messages">
        {messages.length === 0 && (
          <p className="chatwindow-empty">
            Ask about your itinerary — try "make day 1 lighter"
          </p>
        )}

        {messages.map((msg, i) => (
          <div
            key={msg._id || i}
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

      {error && <p className="chatwindow-error">{error}</p>}

      <div className="chatwindow-input-row">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
        />
        <button
          className="chatwindow-send-btn"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;