import React, { useState, useRef } from 'react';
import Header from './components/Header';
import ScenarioSelector from './components/ScenarioSelector';
import InputSection from './components/InputSection';
import AnalysisReport from './components/AnalysisReport';
import ChatSection from './components/ChatSection';
import { SCENARIOS } from './constants';
import { Scenario, InputMode, AnalysisState, ChatMessage } from './types';
import { analyzeIntent, createChatSession } from './services/geminiService';
import { Chat } from '@google/genai';

const App: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[0]);
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isLoading: false,
    result: null,
    error: null,
  });

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);

  const handleAnalyze = async (input: string | File, mode: InputMode, backgroundContext?: string) => {
    setAnalysisState({ isLoading: true, result: null, error: null });
    setChatMessages([]);
    chatSessionRef.current = null;
    
    try {
      const result = await analyzeIntent(input, selectedScenario, backgroundContext);
      setAnalysisState({ isLoading: false, result, error: null });

      // Initialize Chat Session automatically after analysis
      const chat = await createChatSession(input, selectedScenario, backgroundContext, result);
      chatSessionRef.current = chat;

    } catch (err: any) {
      setAnalysisState({ 
        isLoading: false, 
        result: null, 
        error: err.message || "分析过程中出现错误，请重试。" 
      });
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!chatSessionRef.current) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    setChatMessages(prev => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      // Use sendMessage from the initialized Chat session
      const response = await chatSessionRef.current.sendMessage({ message: text });
      
      // Use response.text property (not function)
      const aiText = response.text || "抱歉，我无法回答这个问题。";
      
      const aiMsg: ChatMessage = { role: 'model', content: aiText };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = { role: 'model', content: "网络连接似乎断开了，请重试。" };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-12 bg-[#0f172a]">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 md:px-8 pt-8">
        
        {/* Intro Banner */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-3">
            听懂言外之意，看透真实人心
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            上传语音、视频或粘贴文字，AI 帮你拆解潜台词、识别微表情，并提供得体的高情商应对策略。
          </p>
        </div>

        {/* Controls */}
        <ScenarioSelector 
          selectedScenario={selectedScenario} 
          onSelect={setSelectedScenario} 
          disabled={analysisState.isLoading}
        />

        <InputSection 
          onAnalyze={handleAnalyze} 
          isLoading={analysisState.isLoading}
        />

        {/* Error Message */}
        {analysisState.error && (
          <div className="mb-8 p-4 bg-red-900/30 border border-red-800 rounded-lg flex items-center gap-3 text-red-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{analysisState.error}</span>
          </div>
        )}

        {/* Results */}
        {analysisState.result && (
          <>
            <AnalysisReport result={analysisState.result} />
            <ChatSection 
              messages={chatMessages} 
              onSendMessage={handleSendMessage}
              isChatLoading={isChatLoading}
            />
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-slate-600 text-sm border-t border-slate-800">
        <p>Powered by Gemini 3.0 Flash • 隐私保护：所有媒体仅在内存中处理，不会保存。</p>
      </footer>
    </div>
  );
};

export default App;
