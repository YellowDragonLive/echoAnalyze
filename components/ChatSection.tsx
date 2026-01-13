import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';

interface ChatSectionProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isChatLoading: boolean;
}

const ChatSection: React.FC<ChatSectionProps> = ({ messages, onSendMessage, isChatLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isChatLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="mt-8 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg animate-fade-in-up">
      <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
          <span>💬</span> 追问细节
        </h3>
        <span className="text-xs text-slate-500">觉得分析不够？在这里继续提问</span>
      </div>

      <div className="h-64 overflow-y-auto p-4 space-y-4 bg-slate-900/30">
        {messages.length === 0 ? (
          <div className="text-center text-slate-500 text-sm mt-8">
            <p>对于刚才的分析，还有什么疑惑吗？</p>
            <p className="text-xs mt-1">试着问："他这句话到底是不是在暗示分手？" 或 "我刚才那个表情是不是太夸张了？"</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`
                  max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed
                  ${msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-slate-700 text-slate-200 rounded-bl-none'
                  }
                `}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {isChatLoading && (
          <div className="flex justify-start">
             <div className="bg-slate-700 text-slate-200 rounded-2xl rounded-bl-none px-4 py-2 text-sm">
                <div className="flex space-x-1 h-5 items-center">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-0"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入你的问题..."
          className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          disabled={isChatLoading}
        />
        <button 
          type="submit"
          disabled={!input.trim() || isChatLoading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          发送
        </button>
      </form>
    </div>
  );
};

export default ChatSection;
