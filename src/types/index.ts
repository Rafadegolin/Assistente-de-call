export interface Transcription {
  id: string;
  text: string;
  timestamp: Date;
  speaker: "user" | "other";
}

export interface Analysis {
  objections: string[];
  important_points: string[];
  sentiment: "positive" | "negative" | "neutral";
  suggestions: string[];
}

export interface TranscriptionResult {
  success: boolean;
  full_text?: string;
  segments?: TranscriptionSegment[];
  error?: string;
  language?: string;
  duration?: number;
}

export interface TranscriptionSegment {
  start: number;
  end: number;
  text: string;
}
