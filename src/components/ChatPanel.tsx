import React from 'react';
import type { ChatMessage, ClaimElement } from '../types';
import { Send, Bot, User, CornerDownLeft, Check, X, Upload } from 'lucide-react';

interface ChatPanelProps {
  messages: ChatMessage[];
  activeElement: ClaimElement | null;
  onSendMessage: (text: string) => void;
  onAcceptSuggestion: (messageId: string) => void;
  onRejectSuggestion: (messageId: string) => void;
  onUploadDocClick?: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  activeElement,
  onSendMessage,
  onAcceptSuggestion,
  onRejectSuggestion,
  onUploadDocClick,
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
                className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed space-y-2 ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : 'bg-slate-100/90 text-slate-800 border border-slate-200/80 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* Inline Action: Upload Doc edge-case */}
                {msg.requiresUploadDoc && (
                  <div className="pt-1">
                    <button
                      onClick={onUploadDocClick}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      Upload Document / Spec
                    </button>
                  </div>
                )}

                {/* Inline Action: Accept / Reject Suggestion */}
                {msg.suggestedChange && (
                  <div className="pt-2 border-t border-slate-200/60">
                    {msg.suggestedChange.status === 'pending' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onAcceptSuggestion(msg.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Accept Change
                        </button>
                        <button
                          onClick={() => onRejectSuggestion(msg.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded transition-colors"
                        >
                          <X className="w-3.5 h-3.5 text-slate-400" />
                          Reject
                        </button>
                      </div>
                    ) : msg.suggestedChange.status === 'accepted' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <Check className="w-3 h-3" /> Change Applied
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded">
                        Suggestion Rejected
                      </span>
                    )}
                  </div>
                )}

                <div
                  className={`text-[10px] text-right ${
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
                ? `Ask to strengthen evidence, clarify reasoning, or undo...`
                : 'Type instructions for the AI...'
            }
            className="w-full text-xs pl-3 pr-10 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 bg-slate-50/50"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="absolute right-1.5 p-1.5 text-white bg-slate-900 rounded-md hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-1">
          <span>Try: "strengthen evidence", "weak reasoning", "temperature sensor", or "undo"</span>
          <span className="flex items-center gap-0.5">
            <CornerDownLeft className="w-2.5 h-2.5" /> Send
          </span>
        </div>
      </form>
    </div>
  );
};
