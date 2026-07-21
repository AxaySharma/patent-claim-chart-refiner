import React from 'react';
import type { ChatMessage, ClaimElement } from '../types';
import { Send, Bot, User, CornerDownLeft } from 'lucide-react';

interface ChatPanelProps {
  messages: ChatMessage[];
  activeElement: ClaimElement | null;
  onSendMessage: (text: string) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  activeElement,
  onSendMessage,
}) => {
  const [inputText, setInputText] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[calc(100vh-140px)] min-h-[500px]">
      {/* Panel Header */}
      <div className="p-3.5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-900 text-white rounded-md">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-900">AI Refinement Assistant</h3>
            <p className="text-[11px] text-slate-500">Interactive Reasoning & Mapping Feedback</p>
          </div>
        </div>

        {activeElement && (
          <span className="text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded">
            Targeting Element #{activeElement.id.replace('elem-', '')}
          </span>
        )}
      </div>

      {/* Active Element Context Banner */}
      {activeElement ? (
        <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 text-xs text-slate-600 flex items-start justify-between gap-2">
          <div className="truncate">
            <span className="font-semibold text-slate-800">Focused Context: </span>
            <span className="italic text-slate-600 truncate">"{activeElement.patentClaimText}"</span>
          </div>
        </div>
      ) : (
        <div className="px-3 py-2 bg-slate-50/50 border-b border-slate-200 text-[11px] text-slate-400 italic">
          Click any claim element row on the left to set active context.
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  isUser ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[82%] rounded-xl p-3 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : 'bg-slate-100/90 text-slate-800 border border-slate-200/80 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <div
                  className={`mt-1.5 text-[10px] text-right ${
                    isUser ? 'text-slate-400' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-200 bg-white">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              activeElement
                ? `Ask about element #${activeElement.id.replace('elem-', '')}...`
                : 'Type instructions or questions for the AI...'
            }
            className="w-full text-xs pl-3 pr-10 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 bg-slate-50/50"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="absolute right-1.5 p-1.5 text-white bg-slate-900 rounded-md hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-1">
          <span>Press Enter to send</span>
          <span className="flex items-center gap-0.5">
            <CornerDownLeft className="w-2.5 h-2.5" /> Send
          </span>
        </div>
      </form>
    </div>
  );
};
