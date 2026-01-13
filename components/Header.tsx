import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 md:px-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">深度解码</h1>
            <p className="text-xs text-indigo-400 font-medium">AI 社交意图分析器</p>
          </div>
        </div>
        <div className="hidden md:flex space-x-4 text-sm font-medium text-slate-400">
          <span className="hover:text-white cursor-pointer transition">语气分析</span>
          <span className="hover:text-white cursor-pointer transition">潜台词解码</span>
          <span className="hover:text-white cursor-pointer transition">高情商回复</span>
        </div>
      </div>
    </header>
  );
};

export default Header;