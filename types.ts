// types.ts

export enum LoadingState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  GENERATING = 'GENERATING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export interface ViralAnalysis {
  hookStrategy: string;
  pacing: string;
  emotionalTriggers: string[];
  structureType: string;
  retentionTechniques: string[];
  callToActionType: string;
  summary: string;
  suggestedTopics: string[]; // New field for AI suggestions
}

export interface GeneratedScript {
  title: string;
  content: string; // Markdown content
}