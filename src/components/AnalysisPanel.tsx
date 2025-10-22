import React from "react";
import { Analysis } from "../types";

interface Props {
  analysis: Analysis | null;
}

export const AnalysisPanel: React.FC<Props> = ({ analysis }) => {
  if (!analysis) {
    return (
      <div className="w-[480px] flex flex-col min-h-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 bg-linear-to-r from-emerald-500/10 to-cyan-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
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
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Analysis</h2>
              <p className="text-emerald-300 text-sm">Real-time insights</p>
            </div>
          </div>
        </div>

        {/* Waiting State */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-linear-to-br from-emerald-500/20 to-cyan-500/20 rounded-full animate-ping"></div>
              <div className="relative w-24 h-24 bg-linear-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50">
                <svg
                  className="w-12 h-12 text-white animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-emerald-300 text-lg font-medium">
              Waiting for AI analysis...
            </p>
            <p className="text-emerald-400 text-sm mt-2">
              Processing conversation data
            </p>
          </div>
        </div>
      </div>
    );
  }

  const sentimentConfig = {
    positive: {
      bg: "from-emerald-500/20 to-green-500/20",
      border: "border-emerald-500/40",
      icon: "😊",
      text: "Positive",
      glow: "shadow-emerald-500/25",
    },
    negative: {
      bg: "from-red-500/20 to-pink-500/20",
      border: "border-red-500/40",
      icon: "😟",
      text: "Negative",
      glow: "shadow-red-500/25",
    },
    neutral: {
      bg: "from-gray-500/20 to-slate-500/20",
      border: "border-gray-500/40",
      icon: "😐",
      text: "Neutral",
      glow: "shadow-gray-500/25",
    },
  };

  const sentiment =
    sentimentConfig[analysis.sentiment] || sentimentConfig.neutral;

  return (
    <div className="w-[480px] flex flex-col min-h-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 bg-linear-to-r from-emerald-500/10 to-cyan-500/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
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
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Analysis</h2>
            <p className="text-emerald-300 text-sm">
              Live conversation insights
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* Sentiment */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-bold text-white">Overall Sentiment</h3>
          </div>
          <div
            className={`p-4 rounded-xl backdrop-blur-sm border ${sentiment.bg} ${sentiment.border} ${sentiment.glow} shadow-lg`}
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl">{sentiment.icon}</span>
              <span className="text-2xl font-bold text-white">
                {sentiment.text}
              </span>
            </div>
          </div>
        </div>

        {/* Objections */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-red-400"
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
            <h3 className="text-lg font-bold text-white">
              Detected Objections
            </h3>
            {analysis.objections.length > 0 && (
              <span className="ml-auto bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs font-bold border border-red-500/30">
                {analysis.objections.length}
              </span>
            )}
          </div>
          {analysis.objections.length > 0 ? (
            <div className="space-y-2">
              {analysis.objections.map((obj, idx) => (
                <div
                  key={idx}
                  className="group p-4 bg-linear-to-br from-red-500/20 to-pink-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300 hover:scale-[1.02]"
                >
                  <p className="text-white text-sm leading-relaxed">{obj}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-purple-300 text-sm text-center">
                No objections detected
              </p>
            </div>
          )}
        </div>

        {/* Important Points */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <h3 className="text-lg font-bold text-white">Key Points</h3>
            {analysis.important_points.length > 0 && (
              <span className="ml-auto bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/30">
                {analysis.important_points.length}
              </span>
            )}
          </div>
          {analysis.important_points.length > 0 ? (
            <div className="space-y-2">
              {analysis.important_points.map((point, idx) => (
                <div
                  key={idx}
                  className="group p-4 bg-linear-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02]"
                >
                  <p className="text-white text-sm leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-purple-300 text-sm text-center">
                No key points yet
              </p>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {analysis.suggestions && analysis.suggestions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <h3 className="text-lg font-bold text-white">
                Response Suggestions
              </h3>
              <span className="ml-auto bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-bold border border-purple-500/30">
                {analysis.suggestions.length}
              </span>
            </div>
            <div className="space-y-2">
              {analysis.suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className="group p-4 bg-linear-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                >
                  <p className="text-white text-sm leading-relaxed">
                    {suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.4);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.6);
        }
      `}</style>
    </div>
  );
};
