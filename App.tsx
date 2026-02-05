
import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Upload, 
  Languages, 
  History, 
  Activity,
  FileAudio,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  Waves
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, MOCK_API_KEY, APP_NAME } from './constants';
import { Language, DetectionRequest, DetectionResponse, HistoryItem } from './types';
import { VoiceDetectionService } from './services/voiceService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scan' | 'logs'>('scan');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('English');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<DetectionResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDetect = async () => {
    if (!file) return;
    setIsProcessing(true);
    setResult(null);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const request: DetectionRequest = {
          language: selectedLanguage,
          audioFormat: 'mp3',
          audioBase64: base64
        };
        const response = await VoiceDetectionService.detect(request, MOCK_API_KEY);
        setResult(response);
        if (response.status === 'success') {
          setHistory(prev => [{ 
            ...response, 
            id: Math.random().toString(36).substr(2, 9), 
            timestamp: Date.now(), 
            fileName: file.name 
          }, ...prev]);
        }
        setIsProcessing(false);
      };
    } catch (error) {
      setResult({ status: 'error', message: 'Something went wrong. Please check your connection.' });
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
              <Waves className="text-white h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">{APP_NAME}</span>
          </div>
          
          <div className="bg-white/5 p-1 rounded-2xl hidden sm:flex">
            <button 
              onClick={() => setActiveTab('scan')}
              className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'scan' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              Scanner
            </button>
            <button 
              onClick={() => setActiveTab('logs')}
              className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'logs' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              History
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden lg:flex flex-col items-end mr-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase">System Status</span>
              <span className="text-xs font-semibold text-emerald-400">All Nodes Active</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20">
              <div className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 max-w-7xl mx-auto px-6">
        {activeTab === 'scan' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Input */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
                  Find out if a voice is <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400 italic">truly human</span>.
                </h2>
                <p className="text-lg text-slate-400 max-w-xl">
                  Our advanced AI model analyzes subtle vocal patterns to distinguish between real human speech and synthetic generations.
                </p>
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 space-y-8">
                {/* Language Picker */}
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Languages className="h-4 w-4" /> 1. Select Language
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLanguage(lang)}
                        className={`px-5 py-2.5 rounded-full text-sm font-bold border transition-all ${
                          selectedLanguage === lang 
                          ? 'bg-indigo-600 border-indigo-500 text-white' 
                          : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Audio Input */}
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Upload className="h-4 w-4" /> 2. Upload Audio Sample
                  </span>
                  <div className="grid grid-cols-1 gap-4">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="h-48 flex flex-col items-center justify-center gap-5 rounded-3xl border-2 border-white/5 bg-white/[0.02] hover:border-indigo-500/40 text-slate-400 hover:text-white transition-all group active:scale-[0.99]"
                    >
                      <div className="p-5 rounded-2xl bg-white/5 group-hover:bg-indigo-500/10 transition-colors">
                        <Upload className="h-10 w-10 text-indigo-400" />
                      </div>
                      <div className="text-center">
                        <span className="block text-base font-bold">Select MP3 File</span>
                        <span className="block text-xs text-slate-500 mt-1 uppercase tracking-widest">Click to browse your device</span>
                      </div>
                      <input type="file" ref={fileInputRef} onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setFile(f);
                      }} className="hidden" accept=".mp3" />
                    </button>
                  </div>
                </div>

                {file && (
                  <div className="flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-indigo-500/20 rounded-xl">
                        <FileAudio className="h-6 w-6 text-indigo-400" />
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-white max-w-[240px] truncate">{file.name}</span>
                        <span className="block text-[10px] text-indigo-300/60 uppercase font-black tracking-widest">Ready for analysis</span>
                      </div>
                    </div>
                    <button onClick={() => setFile(null)} className="px-4 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-400/10 transition-colors">Remove</button>
                  </div>
                )}

                <button
                  disabled={!file || isProcessing}
                  onClick={handleDetect}
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-white font-bold transition-all shadow-xl shadow-indigo-900/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {isProcessing ? <><Loader2 className="h-5 w-5 animate-spin" /> Verifying Sample...</> : <><Sparkles className="h-5 w-5" /> Analyze Voice</>}
                </button>
              </div>
            </div>

            {/* Right Column: Result */}
            <div className="lg:col-span-5">
              {result ? (
                <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 space-y-8 animate-in zoom-in-95 duration-500 sticky top-32">
                  {result.status === 'error' ? (
                    <div className="text-center space-y-6">
                      <div className="h-20 w-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="h-10 w-10 text-red-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Oops! Something went wrong</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{result.message}</p>
                    </div>
                  ) : (
                    <div className="space-y-10">
                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verification Result</span>
                        <div className="flex items-center gap-4">
                          <h3 className={`text-5xl font-extrabold italic tracking-tighter ${result.classification === 'AI_GENERATED' ? 'text-amber-400' : 'text-indigo-400'}`}>
                            {result.classification === 'AI_GENERATED' ? 'AI GENERATED' : 'HUMAN'}
                          </h3>
                          <div className={`p-3 rounded-2xl ${result.classification === 'AI_GENERATED' ? 'bg-amber-400/10 text-amber-400' : 'bg-indigo-400/10 text-indigo-400'}`}>
                            {result.classification === 'AI_GENERATED' ? <ShieldAlert className="h-8 w-8" /> : <ShieldCheck className="h-8 w-8" />}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">Analysis Confidence</span>
                          <span className="text-2xl font-black text-white italic">{result.confidenceScore?.toFixed(2)}</span>
                        </div>
                        <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${result.classification === 'AI_GENERATED' ? 'bg-amber-400' : 'bg-indigo-500'}`}
                            style={{ width: `${(result.confidenceScore || 0) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                        <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2 italic">
                          <Sparkles className="h-3 w-3" /> The Verdict
                        </span>
                        <p className="text-slate-300 text-sm leading-relaxed font-medium">
                          {result.explanation}
                        </p>
                      </div>

                      <div className="pt-8 border-t border-white/5 flex items-center justify-between text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                        <span>VeriVoice Engine v3.1</span>
                        <CheckCircle2 className="h-5 w-5 text-indigo-500" />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-[500px] bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center group">
                  <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Activity className="h-10 w-10 text-slate-600 opacity-20" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-500 uppercase italic">Standby Mode</h3>
                  <p className="text-xs mt-3 text-slate-600 font-medium max-w-[240px] leading-relaxed">
                    Upload a sample and click Analyze to begin the verification process.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold text-white tracking-tight italic">Scan Archive</h2>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-widest">Previous analysis records</p>
              </div>
              <button 
                onClick={() => setHistory([])}
                className="text-[10px] font-black text-slate-500 hover:text-red-400 uppercase tracking-widest border border-white/5 px-4 py-2 rounded-xl"
              >
                Flush Logs
              </button>
            </div>

            {history.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {history.map((item) => (
                  <div key={item.id} className="bg-white/[0.03] border border-white/10 p-6 rounded-[2rem] flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:bg-white/[0.05] transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-2xl border ${item.classification === 'AI_GENERATED' ? 'bg-amber-400/10 border-amber-400/20 text-amber-400' : 'bg-indigo-400/10 border-indigo-400/20 text-indigo-400'}`}>
                        <FileAudio className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-white italic truncate max-w-[180px]">{item.fileName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">{new Date(item.timestamp).toLocaleTimeString()}</span>
                          <span className="h-1 w-1 rounded-full bg-slate-700"></span>
                          <span className="text-[10px] font-black text-indigo-400 uppercase">{item.language}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right">
                         <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            item.classification === 'AI_GENERATED' ? 'bg-amber-400 text-amber-950' : 'bg-indigo-400 text-indigo-950'
                          }`}>
                            {item.classification === 'AI_GENERATED' ? 'AI' : 'Human'}
                          </span>
                      </div>
                      <div className="text-right min-w-[60px]">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-0.5">Confidence</p>
                        <p className="text-xl font-black text-white italic">{item.confidenceScore?.toFixed(2)}</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-slate-600 group-hover:text-white transition-colors">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[3rem] py-40 flex flex-col items-center justify-center text-slate-700">
                <History className="h-12 w-12 mb-4 opacity-5" />
                <p className="text-sm font-bold uppercase tracking-widest opacity-20">No Records Found</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#020617] py-20 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Waves className="h-6 w-6 text-indigo-500" />
              <span className="text-xl font-bold text-white italic">{APP_NAME}</span>
            </div>
            <p className="text-sm text-slate-500 font-medium max-w-sm">
              Empowering users to navigate the era of synthetic media with high-precision vocal authentication.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-12 gap-y-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 md:justify-end">
            <div className="space-y-2">
              <p className="text-slate-500 mb-4 not-italic font-bold tracking-normal text-xs uppercase">Engine</p>
              <p>v3.1 Production</p>
              <p className="text-indigo-500">99.4% Precision</p>
            </div>
            <div className="space-y-2">
              <p className="text-slate-500 mb-4 not-italic font-bold tracking-normal text-xs uppercase">Privacy</p>
              <p>GDPR Compliant</p>
              <p>Zero-Retention</p>
            </div>
            <div className="space-y-2">
              <p className="text-slate-500 mb-4 not-italic font-bold tracking-normal text-xs uppercase">Contact</p>
              <p>Security Team</p>
              <p>Partners</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
           <p className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">© 2024 VeriVoice AI Laboratory. All Rights Reserved.</p>
           <div className="flex gap-4">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] font-bold text-slate-800 uppercase tracking-tighter">Global Relay 04 Active</span>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
