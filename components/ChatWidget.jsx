import React, { useState, useEffect, useRef } from 'react';

const cannedReplies = [
  {
    match: /medical|medical report|doctor|signature/i,
    reply: "For medical reports: ensure the report is signed, note any delay between incident and exam, and include the original signed report in the charge sheet.",
  },
  {
    match: /forensic|digital|device|cdr|chain of custody/i,
    reply: "For forensic evidence: secure devices, document chain of custody, and obtain hash values. If devices were wiped, highlight that in the charge sheet.",
  },
  {
    match: /judg|convict|admissibility|evidence/i,
    reply: "Judicial guidance: maintain timely records, corroborate victim statements, and prepare a well-documented charge sheet with chain of custody for evidentiary support.",
  },
  {
    match: /hello|hi|hey/i,
    reply: "Hello — I can help with medical/forensic/judicial guidance. Ask about 'medical report', 'forensic evidence' or 'judgment'.",
  },
];

const ChatWidget = ({ open = false, onClose = () => {} }) => {
  const [visible, setVisible] = useState(open);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi — I'm the Investigation Assistant (mock). Ask me about medical reports, forensic evidence, or judicial guidance." },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [isMax, setIsMax] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    setVisible(open);
  }, [open]);

  // Close maximize on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && isMax) setIsMax(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMax]);

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [messages, visible]);

  const addMessage = (msg) => setMessages((m) => [...m, msg]);

  const getReply = (text) => {
    for (const rule of cannedReplies) {
      if (rule.match.test(text)) return rule.reply;
    }
    // default fallback
    return "I can help with evidence collection, medical report checks, and procedural advice. Try asking about 'medical report' or 'forensic'.";
  };

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    addMessage({ from: 'user', text: trimmed });
    setInput('');
    setTyping(true);
    // simulate bot thinking
    setTimeout(() => {
      const reply = getReply(trimmed);
      addMessage({ from: 'bot', text: reply });
      setTyping(false);
    }, 700 + Math.random() * 700);
  };

  if (!visible) return null;

  // Container classes change when maximized
  const containerClass = isMax
    ? 'fixed inset-0 z-50 flex items-center justify-center p-6'
    : 'fixed bottom-6 right-6 w-80 max-w-full z-50';

  const panelClass = isMax
    ? 'w-full h-full max-w-4xl bg-white/6 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col'
    : 'bg-white/6 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl overflow-hidden';

  return (
    <div className={containerClass}>
      <div className={panelClass}>
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-700 to-purple-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">AI</div>
            <div className="text-white font-medium">Investigation Assistant (mock)</div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              title={isMax ? 'Restore' : 'Maximize'}
              onClick={() => setIsMax((s) => !s)}
              className="text-white/90 hover:text-white px-2 py-1 rounded"
              aria-label="Toggle maximize"
            >
              {isMax ? '🗗' : '🗖'}
            </button>
            <button
              className="text-white/90 hover:text-white px-2 py-1 rounded"
              onClick={() => { setVisible(false); setIsMax(false); onClose(); }}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>
        </div>

        <div ref={boxRef} className={`${isMax ? 'flex-1 h-auto overflow-auto' : 'h-56 overflow-auto'} px-4 py-3 space-y-3 bg-gradient-to-b from-black/20 to-transparent`}>
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`${m.from === 'user' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-200'} px-3 py-2 rounded-lg max-w-[85%]`}>{m.text}</div>
            </div>
          ))}
          {typing && (
            <div className="text-gray-300">...</div>
          )}
        </div>

        <div className="px-3 py-3 bg-black/20">
          <div className="flex items-center gap-2">
            <input
              aria-label="Chat input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
              placeholder="Ask about medical or forensic checks"
              className="flex-1 bg-transparent border border-white/10 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={send} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
