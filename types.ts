export enum AppView {
  HOME = 'HOME',
  ACTIVITIES = 'ACTIVITIES',
  QUIZ = 'QUIZ',
  GAMES = 'GAMES'
}

export enum TopicId {
  HUMAN_REPRO = 'HUMAN_REPRO',
  FETAL_DEV = 'FETAL_DEV',
  MENSTRUAL = 'MENSTRUAL',
  MALE_SYSTEM = 'MALE_SYSTEM',
  FEMALE_SYSTEM = 'FEMALE_SYSTEM'
}

export interface Topic {
  id: TopicId;
  title: string;
  icon: string;
  description: string;
}

export interface Definition {
  term: string;
  definition: string;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index 0-3
  explanation?: string;
}

export enum GameType {
  HANGMAN = 'HANGMAN',
  TICTACTOE = 'TICTACTOE',
  JEOPARDY = 'JEOPARDY',
  GALILEANS = 'GALILEANS'
}

export interface FamilyFeudQuestion {
  question: string;
  answers: { answer: string; points: number }[];
}
