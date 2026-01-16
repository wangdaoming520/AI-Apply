export type Language = 'en' | 'zh';

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface MangaPanel {
  id: string;
  panelNumber: number;
  scriptDescription: string; // The visual description for the AI
  dialogue: string; // Text to overlay
  characterNotes: string; // Context for consistency
  imageUrl?: string;
  imageStatus: GenerationStatus;
}

export interface StoryProject {
  id: string;
  title: string;
  genre: string;
  artStyle: string; // Stores the ID of the style (e.g., 'shonen')
  panels: MangaPanel[];
  createdAt: number;
}

export interface ScriptGenerationResponse {
  panels: {
    description: string;
    dialogue: string;
    characterFocus: string;
  }[];
}