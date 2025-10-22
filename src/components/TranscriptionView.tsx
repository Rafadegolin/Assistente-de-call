import React from "react";
import { Transcription } from "../types";

interface Props {
  transcriptions: Transcription[];
}

export const TranscriptionView: React.FC<Props> = ({ transcriptions }) => {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 bg-linear-to-r from-purple-500/10 to-pink-500/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Live Transcription</h2>
            <p className="text-purple-300 text-sm">
              Real-time conversation flow
            </p>
          </div>
        </div>
      </div>

      {/* Transcriptions */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {transcriptions.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
              <p className="text-purple-300 text-lg">Waiting for audio...</p>
              <p className="text-purple-400 text-sm mt-2">
                Start recording to see transcriptions
              </p>
            </div>
          </div>
        ) : (
          transcriptions.map((item, index) => (
            <div
              key={item.id}
              className={`transform transition-all duration-300 animate-fadeIn ${
                item.speaker === "user" ? "ml-12" : "mr-12"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`group relative p-4 rounded-2xl backdrop-blur-sm border shadow-lg transition-all duration-300 hover:scale-[1.02] ${
                  item.speaker === "user"
                    ? "bg-linear-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30 hover:shadow-cyan-500/25"
                    : "bg-linear-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30 hover:shadow-purple-500/25"
                }`}
              >
                {/* Speaker Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.speaker === "user"
                          ? "bg-cyan-500 shadow-lg shadow-cyan-500/50"
                          : "bg-purple-500 shadow-lg shadow-purple-500/50"
                      }`}
                    >
                      {item.speaker === "user" ? (
                        <svg
                          className="w-5 h-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                      )}
                    </div>
                    <span className="font-bold text-white">
                      {item.speaker === "user" ? "You" : "Client"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-purple-300 bg-white/5 px-3 py-1 rounded-full">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {item.timestamp.toLocaleTimeString()}
                  </div>
                </div>

                {/* Text */}
                <p className="text-white leading-relaxed">{item.text}</p>

                {/* Decorative Element */}
                <div
                  className={`absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 blur-2xl ${
                    item.speaker === "user" ? "bg-cyan-500" : "bg-purple-500"
                  }`}
                ></div>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.4);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.6);
        }
      `}</style>
    </div>
  );
};
