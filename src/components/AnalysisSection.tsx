import React, { useState } from 'react';
import { ExperimentState } from '../types';
import { computeThermalEquilibrium } from '../utils/physics';
import { HelpCircle, CheckCircle2, ChevronDown, ChevronUp, Sparkles, ArrowRight, Lightbulb } from 'lucide-react';

interface AnalysisSectionProps {
  state: ExperimentState;
  onGoToQuiz: () => void;
}

interface QuestionItem {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const AnalysisSection: React.FC<AnalysisSectionProps> = ({
  state,
  onGoToQuiz,
}) => {
  const calc = computeThermalEquilibrium(
    state.coldVolumeMl,
    state.coldTempC,
    state.hotVolumeMl,
    state.hotTempC,
    state.mode,
    state.ambientTempC
  );

  const questions: QuestionItem[] = [
    {
      id: 1,
      question: '1. Қай судың температурасы төмендеді?',
      options: [
        'Суық судың температурасы',
        'Ыстық судың температурасы (t₂ бастапқыдан қоспаның t соңғысына дейін)',
        'Екі судың да өзгермеді',
      ],
      correctIndex: 1,
      explanation: `Ыстық су өзінің ішкі энергиясының бір бөлігін беріп, оның температурасы ${calc.t2}°C-тан ${calc.t_mix}°C-қа дейін төмендеді.`,
    },
    {
      id: 2,
      question: '2. Қай судың температурасы көтерілді?',
      options: [
        'Суық судың температурасы (t₁ бастапқыдан қоспаның t соңғысына дейін)',
        'Ыстық судың температурасы',
        'Тек калориметрдің сырты',
      ],
      correctIndex: 0,
      explanation: `Суық су жылуды қабылдап, оның температурасы ${calc.t1}°C-тан ${calc.t_mix}°C-қа дейін көтерілді.`,
    },
    {
      id: 3,
      question: '3. Жылу қай бағытта берілді?',
      options: [
        'Суық судан ыстық суға қарай',
        'Ыстық судан (жоғары температуралы) суық суға (төмен температуралы) қарай',
        'Ауадан суға қарай ғана',
      ],
      correctIndex: 1,
      explanation: 'Термодинамиканың заңы бойынша жылу алмасу өздігінен әрқашан температурасы жоғары денеден температурасы төмен денеге қарай өтеді.',
    },
    {
      id: 4,
      question: '4. Қоспаның температурасы неге екі бастапқы температураның арасында болды?',
      options: [
        'Жылу алмасу кезінде жүйеде жылулық тепе-теңдік орнап, ортақ тұрақты температура қалыптасады (t₁ < t < t₂)',
        'Өйткені сулар бір-біріне еріп кетті',
        'Судың массасы азайғандықтан',
      ],
      correctIndex: 0,
      explanation: `Жылу алмасу процесі екі судың да температурасы бірдей мәнге (${calc.t_mix}°C) жеткенше жалғасады. Сондықтан қоспаның температурасы міндетті түрде бастапқы екі мәннің аралығында жатады.`,
    },
    {
      id: 5,
      question: '5. Екі жылу мөлшері (Qберген мен Qалған) неге дәл бірдей болмауы мүмкін?',
      options: [
        'Судың тығыздығы өзгергендіктен',
        'Жылудың бір бөлігі калориметр қабырғасын, термометрді жылытуға және қоршаған ауаға шығындалады',
        'Есептеу формуласы дұрыс болмағандықтан',
      ],
      correctIndex: 1,
      explanation: 'Нақты тәжірибеде абсолютті жылу оқшаулау мүмкін емес. Жылудың белгілі бір үлесі (ΔQ) калориметрдің ішкі ыдысына, араластырғышқа, термометрге және қоршаған ортаға тарайды (Qберген = Qалған + Qшығын).',
    },
  ];

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});

  const handleSelect = (qId: number, optIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIndex }));
    setShowExplanation((prev) => ({ ...prev, [qId]: true }));
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = questions.filter(
    (q) => selectedAnswers[q.id] === q.correctIndex
  ).length;

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-700">
            <span>3-бөлім</span>
            <span aria-hidden="true">·</span>
            <span>Слайд 11 & 12</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            Нәтижені талдау және ғылыми қорытынды
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Тәжірибеде бақыланған заңдылықтарды түсіндіруге арналған 5 негізгі талдау сұрағы
          </p>
        </div>

        {/* Progress pill */}
        <div className="flex items-center gap-2 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700">
          <span>Жауап берілгені:</span>
          <span className="font-bold text-sky-700 font-mono">
            {answeredCount} / {questions.length}
          </span>
        </div>
      </div>

      {/* The 5 Inquiry Questions from Slide 11 */}
      <div className="space-y-4">
        {questions.map((q) => {
          const isAnswered = selectedAnswers[q.id] !== undefined;
          const isCorrect = selectedAnswers[q.id] === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`bg-white rounded-2xl border transition-all p-5 shadow-xs ${
                isAnswered
                  ? isCorrect
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-amber-200 bg-amber-50/20'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {q.question}
                </h3>
                {isAnswered && (
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0 ${
                      isCorrect
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isCorrect ? 'Дұрыс ✓' : 'Қайта қараңыз'}
                  </span>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[q.id] === optIdx;
                  const isOptionCorrect = optIdx === q.correctIndex;

                  let btnStyle = 'border-slate-200 bg-white hover:border-sky-300 hover:bg-slate-50 text-slate-700';

                  if (isAnswered) {
                    if (isOptionCorrect) {
                      btnStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-medium';
                    } else if (isSelected && !isOptionCorrect) {
                      btnStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                    } else {
                      btnStyle = 'border-slate-200 text-slate-400 bg-slate-50/50';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(q.id, optIdx)}
                      className={`w-full text-left p-3 text-xs rounded-xl border transition-all flex items-start gap-2.5 ${btnStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="leading-relaxed">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation Card */}
              {showExplanation[q.id] && (
                <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block mb-0.5">
                      Физикалық түсіндірмесі:
                    </span>
                    <p className="leading-relaxed text-slate-600">{q.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Official Conclusion Box (Slide 12) */}
      <div className="bg-gradient-to-br from-sky-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md border border-sky-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-300 uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Слайд 12 · Зертханалық қорытынды</span>
        </div>

        <h3 className="text-lg font-bold text-white mb-3">
          Жылу алмасу туралы тұжырым:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-sky-100">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-xs border border-white/10">
            <h4 className="font-bold text-amber-300 mb-1">
              1. Жылу алмасу бағыты мен өзгерісі:
            </h4>
            <p>
              Температурасы жоғары дене жылу береді, ал температурасы төмен дене жылуды қабылдайды. 
              Жылу алмасу нәтижесінде температуралар теңесуге ұмтылады.
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-xs border border-white/10">
            <h4 className="font-bold text-emerald-300 mb-1">
              2. Жылу балансы теңдеуі:
            </h4>
            <p className="font-mono text-emerald-200 mb-1">
              Qберген = Qалған
            </p>
            <p>
              Тұйық жылу оқшауланған жүйеде ыстық судың берген барлық жылу мөлшері 
              суық судың қабылдаған жылу мөлшеріне тең болады.
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onGoToQuiz}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition shadow-xs"
          >
            <span>4. Бекіту тестіне өту</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
