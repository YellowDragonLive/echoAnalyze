import React from 'react';
import { AnalysisResult } from '../types';

interface AnalysisReportProps {
  result: AnalysisResult;
}

const ScoreGauge: React.FC<{ value: number; label: string; color: string }> = ({ value, label, color }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            className="text-slate-700"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            className={color}
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            strokeDasharray={251.2}
            strokeDashoffset={251.2 - (251.2 * value) / 100}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-white">{value}</span>
        </div>
      </div>
      <span className="mt-2 text-xs uppercase tracking-wider font-semibold text-slate-400">{label}</span>
    </div>
  );
};

const AnalysisReport: React.FC<AnalysisReportProps> = ({ result }) => {
  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-bold text-white">深度分析报告</h2>
        <div className="h-px flex-grow bg-gradient-to-r from-indigo-500/50 to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Scores */}
        <div className="col-span-1 bg-slate-800 rounded-xl p-6 border border-slate-700 flex flex-col justify-around">
          <div className="flex justify-between md:justify-around w-full">
            <ScoreGauge value={result.heartbreakIndex} label="扎心指数" color="text-pink-500" />
            <ScoreGauge value={result.euphemismLevel} label="委婉程度" color="text-amber-400" />
          </div>
          <div className="mt-6 pt-6 border-t border-slate-700">
             <div className="flex justify-between items-center mb-2">
               <span className="text-sm text-slate-400">沟通段位评分</span>
               <span className="text-sm font-bold text-indigo-400">{result.communicationScore}/100</span>
             </div>
             <div className="w-full bg-slate-700 rounded-full h-2">
               <div 
                 className="bg-indigo-500 h-2 rounded-full transition-all duration-1000" 
                 style={{ width: `${result.communicationScore}%` }}
               ></div>
             </div>
          </div>
        </div>

        {/* Intent Contrast */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
            <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span> 表面意思
            </h3>
            <p className="text-slate-300 italic">"{result.surfaceMeaning}"</p>
          </div>
          <div className="bg-indigo-900/20 rounded-xl p-5 border border-indigo-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
               <svg className="w-16 h-16 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            </div>
            <h3 className="text-sm font-bold text-indigo-400 uppercase mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span> 潜在动机 (潜台词)
            </h3>
            <p className="text-white font-medium">{result.hiddenMotive}</p>
          </div>
          
          {/* Tags */}
           <div className="col-span-1 md:col-span-2 flex flex-wrap gap-2">
             {result.emotionalTags.map((tag, idx) => (
               <span key={idx} className="px-3 py-1 rounded-full bg-slate-700 text-xs text-slate-300 border border-slate-600">
                 #{tag}
               </span>
             ))}
           </div>
        </div>
      </div>

      {/* Highlights / Timeline */}
      {( (result.keyExcerpts && result.keyExcerpts.length > 0) || (result.timelineAnalysis && result.timelineAnalysis.length > 0) ) && (
        <div className="mb-6 bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-sm font-bold text-amber-400 uppercase mb-4 flex items-center gap-2">
             ⚡ 关键线索捕捉
          </h3>
          
          {/* Text Highlights */}
          {result.keyExcerpts && result.keyExcerpts.length > 0 && (
            <div className="mb-4 space-y-2">
              <h4 className="text-xs font-semibold text-slate-500 uppercase">关键语句高亮</h4>
              {result.keyExcerpts.map((excerpt, idx) => (
                <div key={idx} className="bg-slate-900/50 p-3 rounded border-l-2 border-amber-500 text-slate-200 text-sm">
                  "{excerpt}"
                </div>
              ))}
            </div>
          )}

          {/* Timeline */}
          {result.timelineAnalysis && result.timelineAnalysis.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-500 uppercase">高能时间点</h4>
              {result.timelineAnalysis.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <span className="text-xs font-mono bg-slate-900 px-2 py-1 rounded text-slate-400 w-16 text-center">{item.timestamp}</span>
                  <div>
                    <span className={`text-xs font-bold uppercase mr-2 
                      ${item.type === 'tone' ? 'text-purple-400' : 
                        item.type === 'pause' ? 'text-amber-400' : 
                        item.type === 'expression' ? 'text-pink-400' : 'text-blue-400'}`}>
                      [{item.type === 'tone' ? '语气' : item.type === 'pause' ? '停顿' : item.type === 'expression' ? '表情' : '语速'}]
                    </span>
                    <span className="text-sm text-slate-300">{item.observation}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Advice Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
            💡 高情商回复建议
          </h3>
          <div className="bg-slate-900/50 p-4 rounded-lg border-l-4 border-emerald-500 text-slate-200">
             "{result.betterResponse}"
          </div>
          <p className="text-xs text-slate-500 mt-2">使用此话术可化解尴尬或澄清意图。</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
           <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
            🔍 深度解读与行动指南
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            {result.actionableAdvice}
          </p>
          {result.missedCues.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">被你忽略的信号</h4>
              <ul className="space-y-1">
                {result.missedCues.map((cue, i) => (
                  <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">•</span> {cue}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;
