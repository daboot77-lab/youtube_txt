import React, { useState, useRef, useEffect } from 'react';
import { analyzeViralScript, generateRemixedScript } from './services/geminiService';
import { LoadingState, ViralAnalysis } from './types';
import AnalysisCard from './components/AnalysisCard';

// Helper for auto-resizing textarea
const useAutosizeTextArea = (textAreaRef: HTMLTextAreaElement | null, value: string) => {
  useEffect(() => {
    if (textAreaRef) {
      textAreaRef.style.height = "0px";
      const scrollHeight = textAreaRef.scrollHeight;
      textAreaRef.style.height = scrollHeight + "px";
    }
  }, [textAreaRef, value]);
};

export default function App() {
  const [transcript, setTranscript] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [analysis, setAnalysis] = useState<ViralAnalysis | null>(null);
  const [generatedScript, setGeneratedScript] = useState<string>('');
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);

  const transcriptInputRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(transcriptInputRef.current, transcript);

  const handleAnalyze = async () => {
    if (!transcript.trim()) return;
    
    setLoadingState(LoadingState.ANALYZING);
    setError(null);
    setAnalysis(null);
    setGeneratedScript('');
    
    try {
      const result = await analyzeViralScript(transcript);
      setAnalysis(result);
      setLoadingState(LoadingState.IDLE);
    } catch (e: any) {
      setError(e.message || "분석 중 문제가 발생했습니다.");
      setLoadingState(LoadingState.ERROR);
    }
  };

  const handleGenerate = async () => {
    if (!analysis || !newTopic.trim()) return;

    setLoadingState(LoadingState.GENERATING);
    setError(null);
    setGeneratedScript('');

    try {
      const result = await generateRemixedScript(analysis, newTopic);
      setGeneratedScript(result);
      setLoadingState(LoadingState.SUCCESS);
    } catch (e: any) {
      setError(e.message || "대본 생성 중 문제가 발생했습니다.");
      setLoadingState(LoadingState.ERROR);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedScript);
    alert('대본이 클립보드에 복사되었습니다!');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-purple-500/20 mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            유튜브 바이럴 스튜디오
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto text-lg word-keep-all">
            떡상한 영상의 성공 공식을 복제하세요. 대본만 넣으면 DNA를 추출하여 당신의 채널에 맞는 새로운 대본으로 만들어드립니다.
          </p>
        </header>

        {/* Step 1: Input Transcript */}
        <section className={`transition-opacity duration-500 ${loadingState === LoadingState.ANALYZING ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
            <div className="relative bg-slate-800 rounded-lg p-6 border border-slate-700">
              <label htmlFor="transcript" className="block text-sm font-medium text-slate-300 mb-2">
                STEP 1: 떡상한 영상 대본 붙여넣기
              </label>
              <textarea
                ref={transcriptInputRef}
                id="transcript"
                className="w-full bg-slate-900 border-slate-700 text-slate-200 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[150px] p-4 font-mono text-sm resize-none overflow-hidden"
                placeholder="여기에 대본 전체를 붙여넣으세요..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
              />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleAnalyze}
                  disabled={!transcript || loadingState === LoadingState.ANALYZING}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loadingState === LoadingState.ANALYZING ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      성공 DNA 분석 중...
                    </>
                  ) : '구조 분석하기'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Step 2: Analysis Results */}
        {analysis && (
          <section className="animate-fade-in-up">
            <AnalysisCard analysis={analysis} />
          </section>
        )}

        {/* Step 3: New Topic & Generate */}
        {analysis && (
          <section className="animate-fade-in-up delay-100">
             <div className="relative bg-slate-800 rounded-lg p-6 border border-slate-700">
              
              {/* Suggested Topics */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  AI 추천 주제 (클릭하여 선택)
                </label>
                <div className="flex flex-wrap gap-2">
                  {analysis.suggestedTopics.map((topic, idx) => (
                    <button
                      key={idx}
                      onClick={() => setNewTopic(topic)}
                      className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm px-4 py-2 rounded-full border border-slate-600 hover:border-indigo-400 transition-colors text-left"
                    >
                      ✨ {topic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-700 my-6"></div>

              <label htmlFor="topic" className="block text-sm font-medium text-slate-300 mb-2">
                STEP 2: 새로운 영상 주제 입력
              </label>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  id="topic"
                  className="flex-1 bg-slate-900 border-slate-700 text-slate-200 rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 p-3"
                  placeholder="예: 초보자도 쉽게 따라하는 코딩 입문"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
                <button
                  onClick={handleGenerate}
                  disabled={!newTopic || loadingState === LoadingState.GENERATING}
                  className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 transition-all whitespace-nowrap"
                >
                  {loadingState === LoadingState.GENERATING ? (
                     <>
                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     대본 작성 중...
                   </>
                  ) : (
                    <>
                      대본 생성하기
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Step 4: Output */}
        {generatedScript && (
          <section className="animate-fade-in-up delay-200">
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
              <div className="bg-slate-900/50 p-4 border-b border-slate-700 flex justify-between items-center">
                <h3 className="font-bold text-slate-200">생성된 대본</h3>
                <button 
                  onClick={copyToClipboard}
                  className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  복사하기
                </button>
              </div>
              <div className="p-8 prose prose-invert max-w-none prose-headings:text-indigo-300 prose-blockquote:border-l-pink-500 prose-blockquote:bg-slate-900/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:text-slate-400">
                {/* 
                  Simple markdown rendering. 
                  In a production app, use react-markdown. 
                  Here we just preserving whitespace and basic structure. 
                */}
                <div className="whitespace-pre-wrap font-sans text-slate-300 leading-relaxed">
                  {generatedScript}
                </div>
              </div>
            </div>
          </section>
        )}
        
        {/* Footer */}
        <footer className="text-center text-slate-600 text-sm pb-8">
           Powered by Gemini 2.5 • 크리에이터를 위한 도구
        </footer>

      </div>
    </div>
  );
}