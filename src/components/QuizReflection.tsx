import React, { useState } from 'react';
import { QuizQuestion, SelfAssessment } from '../types';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Award,
  BookOpen,
  ArrowRight,
  FileText,
  Sparkles,
  CheckSquare,
  Square,
} from 'lucide-react';

interface QuizReflectionProps {
  assessment: SelfAssessment;
  setAssessment: React.Dispatch<React.SetStateAction<SelfAssessment>>;
  onGoToReport: () => void;
}

export const QuizReflection: React.FC<QuizReflectionProps> = ({
  assessment,
  setAssessment,
  onGoToReport,
}) => {
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '1. Жылу мөлшерінің Халықаралық бірліктер жүйесіндегі (SI) өлшем бірлігі қандай?',
      options: ['Ватт (Вт)', 'Паскаль (Па)', 'Джоуль (Дж)', 'Ньютон (Н)'],
      correctIndex: 2,
      explanation: 'Жылу мөлшері энергия түрі болғандықтан, оның өлшем бірлігі — Джоуль (Дж).',
    },
    {
      id: 2,
      question: '2. Судың меншікті жылу сыйымдылығы (c) қаншаға тең?',
      options: [
        '4200 Дж/(кг·°C)',
        '2100 Дж/(кг·°C)',
        '380 Дж/(кг·°C)',
        '1000 Дж/(кг·°C)',
      ],
      correctIndex: 0,
      explanation: 'Судың меншікті жылу сыйымдылығы c = 4200 Дж/(кг·°C). Бұл 1 кг суды 1°C-қа қыздыру үшін 4200 Дж энергия қажет деген сөз.',
    },
    {
      id: 3,
      question: '3. Жылу алмасу кезінде жылу қай бағытта беріледі?',
      options: [
        'Температурасы төмен денеден жоғары денеге',
        'Температурасы жоғары денеден температурасы төмен денеге',
        'Денелердің тығыздығына ғана байланысты',
        'Кез келген бағытта кездейсоқ',
      ],
      correctIndex: 1,
      explanation: 'Жылу әрқашан ыстық (t жоғары) денеден салқын (t төмен) денеге өздігінен беріледі.',
    },
    {
      id: 4,
      question: '4. Жылу балансының негізгі теңдеуі қандай?',
      options: [
        'Q = m · g · h',
        'Qберген = Qалған',
        'E = m · c²',
        'F = m · a',
      ],
      correctIndex: 1,
      explanation: 'Оқшауланған жүйеде ыстық дененің берген жылуы суық дененің қабылдаған жылуына тең: Qберген = Qалған.',
    },
  ];

  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [homeworkText, setHomeworkText] = useState('');
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  const handleSelectQuiz = (qId: number, optIdx: number) => {
    setSelectedOptions((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleCheckQuiz = () => {
    setIsQuizSubmitted(true);
    const score = quizQuestions.filter((q) => selectedOptions[q.id] === q.correctIndex).length;
    if (score === quizQuestions.length) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const score = quizQuestions.filter((q) => selectedOptions[q.id] === q.correctIndex).length;

  return (
    <div className="space-y-6">
      {/* 1. Bekitu Quizi (Slide 13) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-700">
              <span>Слайд 13</span>
              <span aria-hidden="true">·</span>
              <span>Бекіту сұрақтары</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              Тақырыпты бекітуге арналған тест
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-600">
              Нәтиже: <strong className="text-sky-700 font-mono text-sm">{score} / {quizQuestions.length}</strong>
            </span>
            <button
              onClick={handleCheckQuiz}
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition"
            >
              Тестті тексеру
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizQuestions.map((q) => {
            const isSelected = selectedOptions[q.id] !== undefined;
            const isCorrect = selectedOptions[q.id] === q.correctIndex;

            return (
              <div
                key={q.id}
                className={`p-4 rounded-xl border transition-all ${
                  isQuizSubmitted
                    ? isCorrect
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-rose-200 bg-rose-50/20'
                    : 'border-slate-200 bg-slate-50/40'
                }`}
              >
                <div className="text-xs font-bold text-slate-900 mb-2.5">
                  {q.question}
                </div>

                <div className="space-y-1.5">
                  {q.options.map((opt, optIdx) => {
                    const chosen = selectedOptions[q.id] === optIdx;
                    let cls = 'border-slate-200 bg-white text-slate-700 hover:border-sky-300';

                    if (isQuizSubmitted) {
                      if (optIdx === q.correctIndex) {
                        cls = 'border-emerald-500 bg-emerald-100/70 text-emerald-950 font-semibold';
                      } else if (chosen && optIdx !== q.correctIndex) {
                        cls = 'border-rose-300 bg-rose-100/70 text-rose-950';
                      } else {
                        cls = 'border-slate-200 text-slate-400 bg-white/50';
                      }
                    } else if (chosen) {
                      cls = 'border-sky-500 bg-sky-50 text-sky-900 font-semibold';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectQuiz(q.id, optIdx)}
                        className={`w-full text-left p-2.5 text-xs rounded-lg border transition-all flex items-center justify-between ${cls}`}
                      >
                        <span>{opt}</span>
                        {isQuizSubmitted && optIdx === q.correctIndex && (
                          <span className="text-emerald-700 font-bold">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {isQuizSubmitted && (
                  <div className="mt-2 text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-800">Түсіндірме:</span> {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Slide 14: Bagalau jane Refleksiya */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-700 mb-1">
          <span>Слайд 14</span>
          <span aria-hidden="true">·</span>
          <span>Өзін-өзі бағалау және рефлексия</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Зертханалық жұмыстың орындалу критерийлері
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Checklist */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-800 block">
              Бағалау парағы (Чек-лист):
            </span>

            {[
              { key: 'usedTools', label: 'Құралдарды дұрыс пайдаландым' },
              { key: 'measuredTemp', label: 'Температураларды дәл өлшедім' },
              { key: 'filledTable', label: 'Кестені толық толтырдым' },
              { key: 'calculatedHeat', label: 'Жылу мөлшерлерін дұрыс есептедім' },
              { key: 'madeConclusion', label: 'Ғылыми қорытынды жасадым' },
            ].map(({ key, label }) => {
              const checked = assessment[key as keyof SelfAssessment] as boolean;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setAssessment((p) => ({
                      ...p,
                      [key]: !checked,
                    }))
                  }
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-xs text-left transition ${
                    checked
                      ? 'border-emerald-300 bg-emerald-50/40 text-emerald-950 font-medium'
                      : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                      checked
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {checked ? '✓' : ''}
                  </span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Traffic-light reflection */}
          <div className="flex flex-col justify-between space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-800 block mb-2">
                Рефлексия (Сабақты түсіну деңгейіңізді таңдаңыз):
              </span>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setAssessment((p) => ({ ...p, comprehensionLevel: 'understood' }))}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-xs transition ${
                    assessment.comprehensionLevel === 'understood'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-emerald-500 shrink-0"></span>
                  <div className="text-left">
                    <div className="font-bold">🟢 Түсіндім</div>
                    <div className="text-[11px] text-slate-500">
                      Жылу алмасу формуласы мен жылу балансын толық меңгердім.
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAssessment((p) => ({ ...p, comprehensionLevel: 'has_questions' }))}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-xs transition ${
                    assessment.comprehensionLevel === 'has_questions'
                      ? 'border-amber-500 bg-amber-50 text-amber-950 font-semibold ring-1 ring-amber-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-amber-500 shrink-0"></span>
                  <div className="text-left">
                    <div className="font-bold">🟡 Сұрағым бар</div>
                    <div className="text-[11px] text-slate-500">
                      Негізгі заңдылықты түсіндім, бірақ есептеулерде сұрақтар бар.
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAssessment((p) => ({ ...p, comprehensionLevel: 'needs_reexplanation' }))}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-xs transition ${
                    assessment.comprehensionLevel === 'needs_reexplanation'
                      ? 'border-rose-500 bg-rose-50 text-rose-950 font-semibold ring-1 ring-rose-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-rose-500 shrink-0"></span>
                  <div className="text-left">
                    <div className="font-bold">🔴 Қайта түсіндіру қажет</div>
                    <div className="text-[11px] text-slate-500">
                      Тақырыпты бекіту үшін мұғалімнің көмегі керек.
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Student Name Input */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Оқушының аты-жөні (Хаттама үшін):
              </label>
              <input
                type="text"
                placeholder="Мысалы: Арман Қалиев"
                value={assessment.studentName}
                onChange={(e) => setAssessment((p) => ({ ...p, studentName: e.target.value }))}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Slide 15: Homework Task (Үй тапсырмасы) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-700 mb-1">
          <BookOpen className="w-4 h-4 text-sky-600" />
          <span>Слайд 15 · Үй тапсырмасы</span>
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-2">
          «Жылу алмасудың күнделікті өмірдегі маңызы» (5–6 сөйлем)
        </h3>
        <p className="text-xs text-slate-600 mb-3 leading-relaxed">
          Термос құрылысы, үйді радиатормен жылыту, шайды салқындату немесе су мен ауаның жылу сыйымдылығы туралы ой толғап, төмендегі өріске жазыңыз:
        </p>

        <textarea
          rows={3}
          value={homeworkText}
          onChange={(e) => setHomeworkText(e.target.value)}
          placeholder="Мысалы: Жылу алмасу тұрмыста үлкен рөл атқарады. Мысалы, суық күндері үйімізді жылыту радиаторлары арқылы жылытамыз. Термоста жылу алмасуды азайту үшін вакуум қабаты қолданылады..."
          className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-sky-500 leading-relaxed font-sans"
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            «Зерттеу арқылы — заңдылықты өзіміз ашамыз!»
          </div>

          <button
            onClick={onGoToReport}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition shadow-xs"
          >
            <FileText className="w-4 h-4" />
            <span>5. Зертханалық хаттаманы дайындау</span>
          </button>
        </div>
      </div>
    </div>
  );
};
