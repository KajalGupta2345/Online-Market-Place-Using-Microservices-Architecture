import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { AI_BUDDY_URL } from '../../api/axios';
import { getToken } from '../../api/tokenStorage';

// Matches AI_Buddy/src/sockets/socket.js:
//   path: /api/socket/socket.io, auth via httpOnly "token" cookie,
//   client emits "message", server emits "message" back.
export default function AIBuddyWidget() {
  const user = useSelector((s) => s.auth.user);
  const [open, setOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  const socketRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (!open || !user || socketRef.current) return;

    const socket = io(AI_BUDDY_URL, {
      path: '/api/socket/socket.io',
      withCredentials: true,
      auth: { token: getToken() },
    });
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('message', (content) => {
      setThinking(false);
      setMessages((prev) => [...prev, { from: 'buddy', text: content }]);
    });
    socket.on('connect_error', () => {
      setThinking(false);
      setMessages((prev) => [
        ...prev,
        { from: 'buddy', text: 'Could not connect. Please sign in and try again.' },
      ]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [open, user]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking]);

  function sendMessage() {
    if (!draft.trim() || !socketRef.current) return;
    setMessages((prev) => [...prev, { from: 'me', text: draft }]);
    socketRef.current.emit('message', draft);
    setDraft('');
    setThinking(true);
  }

  if (!user) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="w-80 sm:w-96 h-[26rem] card flex flex-col mb-3 overflow-hidden">
          <div className="bg-pine-600 text-paper px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-display text-sm font-semibold">AI Buddy</p>
              <p className="text-[11px] text-pine-100">
                {connected ? 'Online' : 'Connecting…'}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-pine-100 hover:text-white text-lg leading-none"
              aria-label="Close AI Buddy"
            >
              ×
            </button>
          </div>
          <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-paper">
            {messages.length === 0 && (
              <p className="text-xs text-ink/50 text-center mt-6">
                Ask me about products, orders, or anything on VendEx.
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
                  m.from === 'me'
                    ? 'ml-auto bg-pine-600 text-paper'
                    : 'bg-white border border-line text-ink'
                }`}
              >
                {m.text}
              </div>
            ))}
            {thinking && (
              <div className="bg-white border border-line text-ink/50 text-sm px-3 py-2 rounded-lg w-fit">
                typing…
              </div>
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="border-t border-line p-2 flex gap-2 bg-white"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a message…"
              className="input"
            />
            <button type="submit" className="btn btn-accent px-3">
              Send
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="btn btn-primary rounded-full w-14 h-14 shadow-card text-xl font-display"
        aria-label="Toggle AI Buddy chat"
      >
        {open ? '×' : '💬'}
      </button>
    </div>
  );
}
