export type CourseLevel = 'Principiante' | 'Intermedio' | 'Avanzado';
export type CourseFormat = 'Lecturas breves' | 'Lecturas + ejercicios' | 'Esquemas + problemas' | 'Mixto';

export interface UserInput {
  topic: string;
  level: CourseLevel;
  profile: string;
  goal: string;
  timeAvailable: string;
  format: CourseFormat;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctOptionIndex: number;
}

export interface LessonContent {
  title: string;
  keyIdea: string; // "Idea clave"
  appliedExample: string; // "Ejemplo aplicado"
  practicalActivity: string; // "Actividad práctica"
  quiz: QuizQuestion[]; // "Test rápido" (3 questions)
}

export interface Unit {
  title: string;
  summary: string;
  lessons: LessonContent[];
}

export interface FinalProject {
  title: string;
  description: string;
}

export interface CourseData {
  title: string;
  subtitle: string;
  tags: string[]; // [Level, Duration, Target Profile]
  objectives: string[];
  units: Unit[];
  finalAssessment: QuizQuestion[];
  finalProjects: FinalProject[];
  references: string[]; // Sources/Bibliography
}

export interface AppState {
  view: 'home' | 'loading' | 'course';
  userInput: UserInput;
  courseData: CourseData | null;
  currentUnitIndex: number; // -1 for overview
  currentLessonIndex: number; // -1 for unit overview (if applicable) or if showing final assessment
  completedLessons: Record<string, boolean>; // key: "unitIdx-lessonIdx"
  showFinalAssessment: boolean;
}
