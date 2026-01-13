import React, { useState, useRef } from 'react';
import { InputMode } from '../types';

interface InputSectionProps {
  onAnalyze: (input: string | File, mode: InputMode, backgroundContext?: string) => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading }) => {
  const [mode, setMode] = useState<InputMode>('text');
  const [textInput, setTextInput] = useState('');
  const [backgroundContext, setBackgroundContext] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Updated limit to 200MB
      if (file.size > 200 * 1024 * 1024) {
        alert("文件过大，请压缩后上传");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = () => {
    if (mode === 'text' && textInput.trim()) {
      onAnalyze(textInput, 'text', backgroundContext);
    } else if ((mode === 'audio' || mode === 'video') && selectedFile) {
      onAnalyze(selectedFile, mode, backgroundContext);
    }
  };

  return (
    <div className="mb-8 animate-fade-in-up">
      <h2 className="text-sm uppercase tracking-wider text-slate-400 font-bold mb-4">2. 上传素材与背景</h2>
      
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          <button
            onClick={() => setMode('text')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'text' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-750'}`}
          >
            💬 文字/聊天记录
          </button>
          <button
            onClick={() => setMode('audio')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'audio' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-750'}`}
          >
            🎙️ 语音录音
          </button>
          <button
            onClick={() => setMode('video')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'video' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-750'}`}
          >
            🎥 视频片段
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {mode === 'text' && (
            <div className="mb-4">
              <label className="block text-xs text-slate-400 mb-2 uppercase font-bold">对话内容</label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="请在此粘贴微信聊天记录、邮件内容或对话文本..."
                className="w-full h-40 bg-slate-900 border border-slate-600 rounded-lg p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono text-sm"
                disabled={isLoading}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-slate-500">{textInput.length}/5000 字</span>
              </div>
            </div>
          )}

          {(mode === 'audio' || mode === 'video') && (
            <div className="mb-4">
               <label className="block text-xs text-slate-400 mb-2 uppercase font-bold">上传文件</label>
              <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-slate-600 rounded-lg bg-slate-900/50 hover:bg-slate-900 transition-colors relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept={mode === 'audio' ? "audio/*" : "video/*"}
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  disabled={isLoading}
                />
                {selectedFile ? (
                  <div className="text-center">
                    <div className="text-indigo-400 font-medium mb-1">{selectedFile.name}</div>
                    <div className="text-xs text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedFile(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                      className="mt-2 text-xs text-red-400 hover:text-red-300 z-10 relative"
                    >
                      移除文件
                    </button>
                  </div>
                ) : (
                  <div className="text-center pointer-events-none">
                    <div className="text-2xl mb-2">{mode === 'audio' ? '🎙️' : '🎥'}</div>
                    <div className="text-sm text-slate-300 font-medium">点击上传 {mode === 'audio' ? '音频' : '视频'}</div>
                    <div className="text-xs text-slate-500 mt-1">支持 MP3, WAV, MP4 (最大 200MB)</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Background Context Input */}
          <div className="mb-6">
            <label className="block text-xs text-slate-400 mb-2 uppercase font-bold">补充背景 (可选)</label>
            <textarea
              value={backgroundContext}
              onChange={(e) => setBackgroundContext(e.target.value)}
              placeholder="例如：这是我和相亲对象的第一次见面；或者，这是老板在周会上的发言，平时他很严厉..."
              className="w-full h-20 bg-slate-900 border border-slate-600 rounded-lg p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isLoading || (mode === 'text' ? !textInput : !selectedFile)}
              className={`
                px-8 py-3 rounded-lg font-bold text-white shadow-lg transition-all w-full md:w-auto
                ${isLoading || (mode === 'text' ? !textInput : !selectedFile)
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/25 active:scale-95'
                }
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  正在深度解码...
                </span>
              ) : (
                "开始解码"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputSection;
