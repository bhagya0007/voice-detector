
export type Language = 'Tamil' | 'English' | 'Hindi' | 'Malayalam' | 'Telugu';

export interface DetectionRequest {
  language: Language;
  audioFormat: 'mp3';
  audioBase64: string;
}

export interface DetectionResponse {
  status: 'success' | 'error';
  language?: Language;
  classification?: 'AI_GENERATED' | 'HUMAN';
  confidenceScore?: number;
  explanation?: string;
  message?: string;
}

export interface HistoryItem extends DetectionResponse {
  id: string;
  timestamp: number;
  fileName: string;
}
