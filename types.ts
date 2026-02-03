
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';

export interface Mission {
  id: number;
  type: 'math' | 'riddle' | 'story' | 'boss';
  title: string;
  completed: boolean;
}

export interface GameState {
  score: number;
  currentLevel: number;
  missions: Mission[];
  status: 'map' | 'challenge' | 'finished';
  difficulty: Difficulty;
  activeMissionId: number | null;
}

export interface AIRiddle {
  riddle: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface AIStoryQuest {
  story: string;
  question: string;
  answer: number;
  reward: string;
}

// Added Question interface used by MathArena.tsx
export interface Question {
  id: string;
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
  options: number[];
}

// Added AIProblem interface used by AIChallenge.tsx
export interface AIProblem {
  story: string;
  question: string;
  correctAnswer: number;
  hint: string;
}
