import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { Analysis, TranscriptionResult } from "../types";

export const audioService = {
  async initializeOpenAI(apiKey: string): Promise<string> {
    return await invoke<string>("initialize_openai", { apiKey });
  },

  async startRealtimeCapture(): Promise<string> {
    return await invoke<string>("start_realtime_capture");
  },

  async stopRealtimeCapture(): Promise<string> {
    return await invoke<string>("stop_realtime_capture");
  },

  async transcribe(audioPath: string): Promise<TranscriptionResult> {
    return await invoke<TranscriptionResult>("transcribe_audio", { audioPath });
  },

  async analyzeText(text: string): Promise<Analysis> {
    return await invoke<Analysis>("analyze_text", { text });
  },

  onNewChunk(callback: (chunkPath: string) => void) {
    return listen<string>("new-chunk", (event) => {
      callback(event.payload);
    });
  },

  onNewTranscription(callback: (data: any) => void) {
    return listen("new-transcription", (event) => {
      callback(event.payload);
    });
  },

  onNewAnalysis(callback: (data: any) => void) {
    return listen("new-analysis", (event) => {
      callback(event.payload);
    });
  },
};
