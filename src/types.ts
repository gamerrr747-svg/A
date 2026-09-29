export interface ExperimentState {
  // Cold water parameters
  coldVolumeMl: number; // e.g. 100 ml
  coldTempC: number; // e.g. 20 °C
  
  // Hot water parameters
  hotVolumeMl: number; // e.g. 100 ml
  hotTempC: number; // e.g. 70 °C

  // Calorimeter state
  coldPoured: boolean;
  hotPoured: boolean;
  isStirring: boolean;
  stirProgress: number; // 0 to 1
  isEquilibriumReached: boolean;
  
  // Environment & physics mode
  mode: 'ideal' | 'realistic'; // realistic includes slight ambient/cup heat loss (~5%)
  ambientTempC: number;
  
  // Active tool in hand
  activeTool: 'none' | 'thermometer' | 'pour-cold' | 'pour-hot' | 'stirrer';
  thermometerLocation: 'bench' | 'cold' | 'hot' | 'calorimeter';
  
  // Step in guided tour (1..7)
  currentStep: number;
  guideMode: boolean;
}

export interface StudentAnswers {
  q1: string; // Қай су төмендеді
  q2: string; // Қай су көтерілді
  q3: string; // Қай бағытта
  q4: string; // Неге арасында
  q5: string; // Неге дәл бірдей емес
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SelfAssessment {
  usedTools: boolean;
  measuredTemp: boolean;
  filledTable: boolean;
  calculatedHeat: boolean;
  madeConclusion: boolean;
  comprehensionLevel: 'understood' | 'has_questions' | 'needs_reexplanation' | null;
  studentName: string;
}
