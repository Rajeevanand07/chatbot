import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function App() {
  const [socket, setSocket] = useState();
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "bot",
      text: "Welcome to the Tailwind dark chat UI. Type a message and press Enter to send.",
      time: new Date().toLocaleTimeString(),
    },
    {
      id: 2,
      role: "bot",
      text: "This is UI-only — responsive, beautiful and uses Tailwind.",
      time: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    const socketInstance = io("http://localhost:3000");
    setSocket(socketInstance);

    socketInstance.on("ai-response-message", (response) => {
      setIsBotTyping(true);
      const botMessage = {
        id: Date.now() + 1,
        role: "bot",
        text: `${response}`,
        time: new Date().toLocaleTimeString(),
      };
      console.log(botMessage);
      setMessages((b) => [...b, botMessage]);
      setIsBotTyping(false);
      
    });

    // scroll to bottom on new messages
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isBotTyping]);

  function sendMessage(text) {
    const trimmed = (text || "").trim();
    if (!trimmed) return;
    const userMsg = {
      id: Date.now(),
      role: "user",
      text: trimmed,
      time: new Date().toLocaleTimeString(),
    };
    setMessages((s) => [...s, userMsg]);

    socket.emit("ai-message", trimmed);
    setInput("");

  }


  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07090c] via-[#0b0f14] to-[#071018] flex items-center justify-center p-6">
      <div className="w-full max-w-3xl h-[82vh] bg-gradient-to-b from-white/2 to-transparent border border-white/5 rounded-2xl shadow-2xl overflow-hidden flex">
        {/* Left decorative / info column (optional) */}
        <aside className="hidden md:flex w-64 flex-col gap-4 px-5 py-6 bg-gradient-to-b from-white/3 to-transparent border-r border-white/3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#7c5cff] to-[#39d6b6] flex items-center justify-center text-white font-semibold shadow-lg">
              CB
            </div>
            <div>
              <div className="text-white font-semibold">Tailwind Chat</div>
              <div className="text-sm text-white/60">Dark UI • Demo</div>
            </div>
          </div>

          <nav className="flex flex-col gap-2 mt-4">
            <button className="text-left text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-md px-3 py-2">
              General
            </button>
            <button className="text-left text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-md px-3 py-2">
              Design
            </button>
            <button className="text-left text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-md px-3 py-2">
              Support
            </button>
            <button className="text-left text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-md px-3 py-2">
              Random
            </button>
          </nav>
        </aside>

        {/* Main chat */}
        <main className="flex-1 flex flex-col">
          <header className="flex items-center gap-4 px-5 py-4 border-b border-white/5">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#7c5cff] to-[#39d6b6] flex items-center justify-center text-2xl">
              🤖
            </div>
            <div>
              <div className="text-white font-semibold">Chatbot</div>
              <div className="text-sm text-white/60">
                Dark theme • Tailwind UI
              </div>
            </div>
          </header>

          <div
            ref={listRef}
            className="flex-1 overflow-auto px-6 py-5 space-y-4"
          >
            {messages.map((m) =>
              m.role === "bot" ? (
                <div key={m.id} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center text-white/90">
                    🤖
                  </div>

                  <div className="flex flex-col">
                    <div className="inline-block max-w-[50vw] px-4 py-3 rounded-2xl bg-[#0f1620] border border-white/5 text-white text-sm shadow-md break-words whitespace-normal leading-relaxed">
                      {m.text}
                    </div>
                    <span className="text-xs text-white/50 mt-2">{m.time}</span>
                  </div>
                </div>
              ) : (
                <div key={m.id} className="flex flex-col items-end gap-1">
                  <div className="flex items-end gap-3">
                    <div className="flex flex-col items-end">
                      <div className="inline-block max-w-[50vw] px-4 py-3 rounded-2xl bg-gradient-to-br from-[#6bffb1] to-[#39d6b6] text-[#07121a] text-sm shadow-md break-words whitespace-normal leading-relaxed">
                        {m.text}
                      </div>
                      <span className="text-xs text-white/50 mt-2">
                        {m.time}
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7c5cff] to-[#39d6b6] flex items-center justify-center text-white font-medium">
                      U
                    </div>
                  </div>
                </div>
              )
            )}

            {isBotTyping && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center text-white/90">
                  🤖
                </div>
                <div>
                  <div className="inline-block max-w-[30%] px-3 py-2 rounded-2xl bg-[#0f1620] border border-white/5 text-white text-sm">
                    <div className="flex gap-2 items-center">
                      <span
                        className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
                        style={{ animationDelay: "0s" }}
                      />
                      <span
                        className="w-2 h-2 bg-white/30 rounded-full animate-bounce"
                        style={{ animationDelay: "0.12s" }}
                      />
                      <span
                        className="w-2 h-2 bg-white/20 rounded-full animate-bounce"
                        style={{ animationDelay: "0.24s" }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-white/50 mt-2 block">
                    typing…
                  </span>
                </div>
              </div>
            )}
          </div>

          <form
            className="px-5 py-4 border-t border-white/5 bg-gradient-to-t from-white/2 to-transparent flex gap-3 items-center"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Type a message"
              className="flex-1 resize-none min-h-[48px] max-h-36 bg-transparent border border-white/6 px-4 py-3 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#7c5cff]/30"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-4 py-3 rounded-xl bg-gradient-to-br from-[#7c5cff] to-[#39d6b6] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
