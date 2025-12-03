import React from 'react';
import { ViralAnalysis } from '../types';

interface AnalysisCardProps {
  analysis: ViralAnalysis;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white">성공 유전자(DNA) 분석 결과</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hook Strategy */}
        <div className="space-y-2">
          <h3 className="text-sm uppercase tracking-wider text-slate-400 font-semibold">후킹(Hook) 전략</h3>
          <p className="text-indigo-300 font-medium">{analysis.hookStrategy}</p>
        </div>

        {/* Structure */}
        <div className="space-y-2">
          <h3 className="text-sm uppercase tracking-wider text-slate-400 font-semibold">스토리 구조</h3>
          <p className="text-pink-300 font-medium">{analysis.structureType}</p>
        </div>

        {/* Pacing */}
        <div className="space-y-2">
          <h3 className="text-sm uppercase tracking-wider text-slate-400 font-semibold">편집/진행 호흡</h3>
          <p className="text-cyan-300">{analysis.pacing}</p>
        </div>

         {/* CTA */}
         <div className="space-y-2">
          <h3 className="text-sm uppercase tracking-wider text-slate-400 font-semibold">구독/좋아요 유도 (CTA)</h3>
          <p className="text-emerald-300">{analysis.callToActionType}</p>
        </div>

        {/* Retention Techniques */}
        <div className="md:col-span-2 space-y-2">
          <h3 className="text-sm uppercase tracking-wider text-slate-400 font-semibold">이탈 방지 기술 (Retention)</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.retentionTechniques.map((tech, idx) => (
              <span key={idx} className="bg-slate-700 text-slate-200 px-3 py-1 rounded-full text-sm border border-slate-600">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="md:col-span-2 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
           <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">3줄 요약</h3>
           <p className="text-slate-300 italic text-sm">"{analysis.summary}"</p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisCard;