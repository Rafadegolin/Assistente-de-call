import { useState, useEffect } from "react";
import { TranscriptionView } from "./components/TranscriptionView";
import { AnalysisPanel } from "./components/AnalysisPanel";
import { audioService } from "./services/tauri";
import { Transcription, Analysis } from "./types";

// IMPORTANTE: Nunca commitar a chave real no código!
// Use variáveis de ambiente em produção
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

function App() {
  const [isRealtimeActive, setIsRealtimeActive] = useState(false);
  const [isOpenAIReady, setIsOpenAIReady] = useState(false);
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string>("");
  const [chunkCount, setChunkCount] = useState(0);

  // Inicializar OpenAI ao carregar
  useEffect(() => {
    const initOpenAI = async () => {
      try {
        await audioService.initializeOpenAI(OPENAI_API_KEY);
        setIsOpenAIReady(true);
        console.log("✅ OpenAI inicializado");
      } catch (err) {
        console.error("❌ Erro ao inicializar OpenAI:", err);
        setError("Erro ao inicializar OpenAI. Verifique a chave API.");
      }
    };

    initOpenAI();
  }, []);

  // Setup de listeners
  useEffect(() => {
    let unlistenChunk: any;
    let unlistenTranscription: any;
    let unlistenAnalysis: any;

    const setupListeners = async () => {
      unlistenChunk = await audioService.onNewChunk((chunkPath) => {
        console.log("📦 Novo chunk:", chunkPath);
        setChunkCount((prev) => prev + 1);
      });

      unlistenTranscription = await audioService.onNewTranscription((data) => {
        console.log("📝 Nova transcrição:", data);

        const newTranscription: Transcription = {
          id: Date.now().toString(),
          text: data.text,
          timestamp: new Date(data.timestamp * 1000),
          speaker: data.speaker,
        };

        setTranscriptions((prev) => [...prev, newTranscription]);
      });

      unlistenAnalysis = await audioService.onNewAnalysis((data) => {
        console.log("🔍 Nova análise:", data);
        setAnalysis(data);
      });
    };

    setupListeners();

    return () => {
      if (unlistenChunk) unlistenChunk();
      if (unlistenTranscription) unlistenTranscription();
      if (unlistenAnalysis) unlistenAnalysis();
    };
  }, []);

  const handleStartRealtime = async () => {
    if (!isOpenAIReady) {
      setError("OpenAI ainda não está pronto. Aguarde...");
      return;
    }

    try {
      setError("");
      setTranscriptions([]);
      setAnalysis(null);
      setChunkCount(0);

      const result = await audioService.startRealtimeCapture();
      console.log(result);
      setIsRealtimeActive(true);
    } catch (err) {
      setError(`Erro ao iniciar real-time: ${err}`);
    }
  };

  const handleStopRealtime = async () => {
    try {
      const result = await audioService.stopRealtimeCapture();
      console.log(result);
      setIsRealtimeActive(false);
    } catch (err) {
      setError(`Erro ao parar real-time: ${err}`);
    }
  };

  return (
    <div className="h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 h-full flex flex-col p-8">
        <div className="max-w-[1920px] mx-auto w-full h-full flex flex-col">
          {/* Modern Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-linear-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                      AI Call Assistant
                    </h1>
                    <p className="text-purple-300 text-sm mt-1">
                      Transcrição e análise inteligente em tempo real
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Card */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-3 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        isOpenAIReady
                          ? "bg-emerald-400"
                          : "bg-yellow-400 animate-pulse"
                      }`}
                    ></div>
                    {isOpenAIReady && (
                      <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
                    )}
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">
                      {isOpenAIReady ? "OpenAI Connected" : "Connecting..."}
                    </div>
                    <div className="text-purple-300 text-xs">
                      {isOpenAIReady ? "Ready to analyze" : "Please wait"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="mb-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={
                      isRealtimeActive
                        ? handleStopRealtime
                        : handleStartRealtime
                    }
                    disabled={!isOpenAIReady}
                    className={`group relative px-10 py-5 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden ${
                      isRealtimeActive
                        ? "bg-linear-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg shadow-red-500/50"
                        : "bg-linear-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg shadow-emerald-500/50"
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      {isRealtimeActive ? (
                        <>
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <rect x="6" y="4" width="3" height="12" rx="1" />
                            <rect x="11" y="4" width="3" height="12" rx="1" />
                          </svg>
                          Parar Análise
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M6 4l12 6-12 6V4z" />
                          </svg>
                          Iniciar Análise
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                  </button>

                  {isRealtimeActive && (
                    <div className="flex items-center gap-6 bg-linear-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm border border-red-500/30 px-6 py-4 rounded-xl animate-pulse-slow">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                          <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                        </div>
                        <span className="text-white font-bold text-lg">
                          RECORDING
                        </span>
                      </div>
                      <div className="h-8 w-px bg-white/20"></div>
                      <div className="flex flex-col">
                        <span className="text-white/60 text-xs uppercase tracking-wider">
                          Chunks Processed
                        </span>
                        <span className="text-white font-bold text-xl">
                          {chunkCount}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {!isRealtimeActive && transcriptions.length > 0 && (
                  <div className="flex items-center gap-3 text-purple-300">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-medium">Session completed</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-5 shadow-2xl animate-shake">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-red-200 font-bold text-lg mb-1">Error</h3>
                  <p className="text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
            <TranscriptionView transcriptions={transcriptions} />
            <AnalysisPanel analysis={analysis} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </div>
  );
}

export default App;
