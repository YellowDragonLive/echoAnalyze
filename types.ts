export interface Scenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  promptContext: string;
}

export interface TimelineEvent {
  timestamp: string; // e.g. "00:15"
  observation: string;
  type: 'speech_rate' | 'tone' | 'pause' | 'expression';
}

export interface AnalysisResult {
  surfaceMeaning: string;
  hiddenMotive: string;
  heartbreakIndex: number; // 0-100
  euphemismLevel: number; // 0-100
  emotionalTags: string[];
  communicationScore: number; // 0-100
  missedCues: string[];
  betterResponse: string;
  actionableAdvice: string;
  timelineAnalysis?: TimelineEvent[]; // For audio/video
  keyExcerpts?: string[]; // For text
  rawSummary?: string;
}

export type InputMode = 'text' | 'audio' | 'video';

export interface AnalysisState {
  isLoading: boolean;
  result: AnalysisResult | null;
  error: string | null;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
