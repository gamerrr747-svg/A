import React, { useState } from 'react';
import { ExperimentState } from '../types';
import { computeThermalEquilibrium, formatNum, C_WATER } from '../utils/physics';
import { Calculator, CheckCircle2, AlertCircle, ArrowRight, HelpCircle } from 'lucide-react';

interface DataTableProps {
  state: ExperimentState;
  onGoToAnalysis: () => void;
}

export const DataTable: React.FC<DataTableProps> = ({ state, onGoToAnalysis }) => {
  const calc = computeThermalEquilibrium(
    state.coldVolumeMl,
    state.coldTempC,
    state.hotVolumeMl,
    state.hotTempC,
    state.mode,
    state.ambientTempC
  );

  const [mode, setMode] = useState<'auto' | 'interactive'>('auto');
  
  // Interactive inputs for student mode
  const [studentInput, setStudentInput] = useState({
    m1: '',
    m2: '',
    m_total: '',
    t1: '',
    t2: '',
    t_mix: '',
    q1: '',
    q2: '',
  });

  const [feedback, setFeedback] = useState<{
    submitted: boolean;
    errors: string[];
    correctCount: number;
  }>({
    submitted: false,
    errors: [],
    correctCount: 0,
  });

  const handleCheckAnswers = () => {
    const errs: string[] = [];
    let count = 0;

    const checkField = (inputVal: string, trueVal: number, fieldName: string, tol = 0.05) => {
      const parsed = parseFloat(inputVal);
      if (isNaN(parsed)) {
        errs.push(`${fieldName}: Мән енгізілмеді`);
        return;
      }
      const diff = Math.abs(parsed - trueVal);
      const allowed = Math.max(0.1, Math.abs(trueVal) * tol);
      if (diff <= allowed) {
        count++;
      } else {
        errs.push(`${fieldName}: Дұрыс мән ${trueVal}, сіз енгіздіңіз ${parsed}`);
      }
    };

    checkField(studentInput.m1, calc.m1_kg, 'Суық су массасы (m₁)', 0.01);
    checkField(studentInput.m2, calc.m2_kg, 'Ыстық су массасы (m₂)', 0.01);
    checkField(studentInput.m_total, calc.m_total_kg, 'Қоспа массасы (m₁+m₂)', 0.01);
    checkField(studentInput.t1, calc.t1, 'Суық су бастапқы t₁', 0.05);
    checkField(studentInput.t2, calc.t2, 'Ыстық су бастапқы t₂', 0.05);
    checkField(studentInput.t_mix, calc.t_mix, 'Қоспа соңғы t', 0.05);
    checkField(studentInput.q1, calc.q_absorbed, 'Суық су алған жылуы (Q₁)', 0.08);
    checkField(studentInput.q2, calc.q_released, 'Ыстық су берген жылуы (Q₂)', 0.08);

    setFeedback({
      submitted: true,
      errors: errs,
      correctCount: count,
    });
  };

  const handleFillFromLab = () => {
    setStudentInput({
      m1: calc.m1_kg.toString(),
      m2: calc.m2_kg.toString(),
      m_total: calc.m_total_kg.toString(),
      t1: calc.t1.toString(),
      t2: calc.t2.toString(),
      t_mix: calc.t_mix.toString(),
      q1: calc.q_absorbed.toString(),
      q2: calc.q_released.toString(),
    });
    setMode('auto');
  };

  return (
    <div className="space-y-6">
      {/* Header and Mode switcher */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-700">
            <span>2-бөлім</span>
            <span aria-hidden="true">·</span>
            <span>Слайд 9 & 10</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            Зертханалық жұмыс кестесі және есептеулер
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Өлшеу нәтижелерін тіркеу және формулалар арқылы жылу мөлшерлерін есептеу
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setMode('auto')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              mode === 'auto'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Автоматты кесте (Тәжірибеден)
          </button>
          <button
            onClick={() => setMode('interactive')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              mode === 'interactive'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Өз бетімен толтыру (Студент)
          </button>
        </div>
      </div>

      {/* Main Table Container (Exactly matches Slide 9) */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-sky-600" />
            <span className="text-sm font-bold text-slate-800">
              №1 Зертханалық кесте: Жылу алмасу параметрлері
            </span>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            c = {C_WATER} Дж/(кг·°C)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-xs font-semibold text-slate-700">
                <th className="py-3 px-4 sm:px-6">Шамалар атауы</th>
                <th className="py-3 px-4 text-sky-800">Суық су (1)</th>
                <th className="py-3 px-4 text-rose-800">Ыстық су (2)</th>
                <th className="py-3 px-4 text-emerald-800">Қоспа (калориметр)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {/* Row 1: Масса, кг */}
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 sm:px-6 font-medium text-slate-800">
                  <div>Масса, кг</div>
                  <div className="text-[11px] text-slate-400 font-mono">m = V · ρ</div>
                </td>
                <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                  {mode === 'auto' ? (
                    `${calc.m1_kg} кг`
                  ) : (
                    <input
                      type="number"
                      placeholder="0.100"
                      value={studentInput.m1}
                      onChange={(e) => setStudentInput({ ...studentInput, m1: e.target.value })}
                      className="w-24 px-2 py-1 text-xs border rounded font-mono"
                    />
                  )}
                </td>
                <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                  {mode === 'auto' ? (
                    `${calc.m2_kg} кг`
                  ) : (
                    <input
                      type="number"
                      placeholder="0.100"
                      value={studentInput.m2}
                      onChange={(e) => setStudentInput({ ...studentInput, m2: e.target.value })}
                      className="w-24 px-2 py-1 text-xs border rounded font-mono"
                    />
                  )}
                </td>
                <td className="py-3 px-4 font-mono font-semibold text-emerald-700">
                  {mode === 'auto' ? (
                    `${calc.m_total_kg} кг`
                  ) : (
                    <input
                      type="number"
                      placeholder="0.200"
                      value={studentInput.m_total}
                      onChange={(e) => setStudentInput({ ...studentInput, m_total: e.target.value })}
                      className="w-24 px-2 py-1 text-xs border rounded font-mono"
                    />
                  )}
                </td>
              </tr>

              {/* Row 2: Бастапқы t, °C */}
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 sm:px-6 font-medium text-slate-800">
                  <div>Бастапқы t, °C</div>
                  <div className="text-[11px] text-slate-400 font-mono">Термометр көрсеткіші</div>
                </td>
                <td className="py-3 px-4 font-mono font-semibold text-sky-700">
                  {mode === 'auto' ? (
                    `${calc.t1} °C`
                  ) : (
                    <input
                      type="number"
                      placeholder="20"
                      value={studentInput.t1}
                      onChange={(e) => setStudentInput({ ...studentInput, t1: e.target.value })}
                      className="w-24 px-2 py-1 text-xs border rounded font-mono"
                    />
                  )}
                </td>
                <td className="py-3 px-4 font-mono font-semibold text-rose-700">
                  {mode === 'auto' ? (
                    `${calc.t2} °C`
                  ) : (
                    <input
                      type="number"
                      placeholder="70"
                      value={studentInput.t2}
                      onChange={(e) => setStudentInput({ ...studentInput, t2: e.target.value })}
                      className="w-24 px-2 py-1 text-xs border rounded font-mono"
                    />
                  )}
                </td>
                <td className="py-3 px-4 font-mono text-slate-400">
                  —
                </td>
              </tr>

              {/* Row 3: Соңғы t, °C */}
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 sm:px-6 font-medium text-slate-800">
                  <div>Соңғы t, °C</div>
                  <div className="text-[11px] text-slate-400 font-mono">Жылулық тепе-теңдік</div>
                </td>
                <td className="py-3 px-4 font-mono text-slate-400">
                  —
                </td>
                <td className="py-3 px-4 font-mono text-slate-400">
                  —
                </td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-600">
                  {mode === 'auto' ? (
                    `${calc.t_mix} °C`
                  ) : (
                    <input
                      type="number"
                      placeholder="45"
                      value={studentInput.t_mix}
                      onChange={(e) => setStudentInput({ ...studentInput, t_mix: e.target.value })}
                      className="w-24 px-2 py-1 text-xs border rounded font-mono"
                    />
                  )}
                </td>
              </tr>

              {/* Row 4: Жылу мөлшері, Дж */}
              <tr className="hover:bg-slate-50/80 transition-colors bg-sky-50/30">
                <td className="py-3 px-4 sm:px-6 font-medium text-slate-800">
                  <div>Жылу мөлшері, Дж</div>
                  <div className="text-[11px] text-slate-400 font-mono">Q = c · m · Δt</div>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-sky-800">
                  {mode === 'auto' ? (
                    `${calc.q_absorbed} Дж`
                  ) : (
                    <input
                      type="number"
                      placeholder="10500"
                      value={studentInput.q1}
                      onChange={(e) => setStudentInput({ ...studentInput, q1: e.target.value })}
                      className="w-28 px-2 py-1 text-xs border rounded font-mono"
                    />
                  )}
                  <span className="block text-[10px] font-normal text-sky-600">
                    Q₁ (алған жылуы)
                  </span>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-rose-800">
                  {mode === 'auto' ? (
                    `${calc.q_released} Дж`
                  ) : (
                    <input
                      type="number"
                      placeholder="10500"
                      value={studentInput.q2}
                      onChange={(e) => setStudentInput({ ...studentInput, q2: e.target.value })}
                      className="w-28 px-2 py-1 text-xs border rounded font-mono"
                    />
                  )}
                  <span className="block text-[10px] font-normal text-rose-600">
                    Q₂ (берген жылуы)
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-slate-400">
                  —
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Student interactive mode controls */}
        {mode === 'interactive' && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              <button
                onClick={handleCheckAnswers}
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition"
              >
                Жауаптарды тексеру
              </button>
              <button
                onClick={handleFillFromLab}
                className="px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition"
              >
                Тәжірибе мәндерімен толтыру
              </button>
            </div>

            {feedback.submitted && (
              <div className="text-xs font-medium">
                {feedback.errors.length === 0 ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Керемет! Барлық 8 мән өте дұрыс есептелді ({feedback.correctCount}/8).
                  </span>
                ) : (
                  <span className="text-amber-800 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Дұрысы: {feedback.correctCount}/8. Қателерді төменнен қараңыз.
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Step-by-Step Mathematical Calculations (From Slide 10) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Cold water absorbed heat */}
        <div className="bg-white rounded-2xl border border-sky-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 text-sky-800 font-bold text-sm mb-3">
            <span className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center text-xs">
              1
            </span>
            <span>Суық судың алған жылуы (Qсуық):</span>
          </div>

          <div className="bg-sky-50/70 rounded-xl p-3.5 border border-sky-100 font-mono text-xs text-sky-950 space-y-2">
            <div>
              <span className="text-sky-600">Формула:</span>{' '}
              <span className="font-bold">Qсуық = c · m₁ · (t − t₁)</span>
            </div>
            <div>
              <span className="text-sky-600">Мәндері:</span>{' '}
              <span>
                Q₁ = {C_WATER} · {calc.m1_kg} · ({calc.t_mix} − {calc.t1})
              </span>
            </div>
            <div>
              <span className="text-sky-600">Температура өсімі:</span>{' '}
              <span>Δt₁ = {formatNum(calc.t_mix - calc.t1, 1)} °C</span>
            </div>
            <div className="pt-2 border-t border-sky-200/60 text-sm font-bold text-sky-900 flex justify-between">
              <span>Нәтижесі:</span>
              <span className="text-sky-700">{calc.q_absorbed} Дж</span>
            </div>
          </div>
        </div>

        {/* Hot water released heat */}
        <div className="bg-white rounded-2xl border border-rose-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-sm mb-3">
            <span className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-xs">
              2
            </span>
            <span>Ыстық судың берген жылуы (Qыстық):</span>
          </div>

          <div className="bg-rose-50/70 rounded-xl p-3.5 border border-rose-100 font-mono text-xs text-rose-950 space-y-2">
            <div>
              <span className="text-rose-600">Формула:</span>{' '}
              <span className="font-bold">Qыстық = c · m₂ · (t₂ − t)</span>
            </div>
            <div>
              <span className="text-rose-600">Мәндері:</span>{' '}
              <span>
                Q₂ = {C_WATER} · {calc.m2_kg} · ({calc.t2} − {calc.t_mix})
              </span>
            </div>
            <div>
              <span className="text-rose-600">Температура кемуі:</span>{' '}
              <span>Δt₂ = {formatNum(calc.t2 - calc.t_mix, 1)} °C</span>
            </div>
            <div className="pt-2 border-t border-rose-200/60 text-sm font-bold text-rose-900 flex justify-between">
              <span>Нәтижесі:</span>
              <span className="text-rose-700">{calc.q_released} Дж</span>
            </div>
          </div>
        </div>

      </div>

      {/* Heat Balance Comparison Box (Slide 10 & 5) */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 rounded-2xl p-5 text-white shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
              <span>ЖЫЛУ БАЛАНСЫНЫҢ ОРЫНДАЛУЫ</span>
              <span>·</span>
              <span>Qберген ≈ Qалған</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              Салыстыру: Qсуық ({calc.q_absorbed} Дж) және Qыстық ({calc.q_released} Дж)
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {state.mode === 'ideal' ? (
                <span>
                  Идеал жағдайда қоршаған ортамен жылу алмасу ескерілмейді: 
                  <strong className="text-emerald-400"> Qберген = Qалған</strong> (100% дәлдік).
                </span>
              ) : (
                <span>
                  Шынайы зертханалық тәжірибеде жылудың аздаған бөлігі (ΔQ = {calc.delta_q} Дж) 
                  калориметрдің ішкі қабырғасына, термометрге және ауаға тарайды. 
                  Тиімділік: <strong className="text-emerald-400">{calc.efficiency}%</strong>.
                </span>
              )}
            </p>
          </div>

          <button
            onClick={onGoToAnalysis}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition shadow-xs whitespace-nowrap self-start md:self-auto"
          >
            <span>3. Нәтижені талдауға көшу</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
