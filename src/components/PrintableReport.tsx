import React, { useState } from 'react';
import { ExperimentState, SelfAssessment } from '../types';
import { computeThermalEquilibrium, formatNum, C_WATER } from '../utils/physics';
import { Printer, FileDown, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

interface PrintableReportProps {
  state: ExperimentState;
  assessment: SelfAssessment;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({
  state,
  assessment,
}) => {
  // Default to 'blank' mode as explicitly requested by user!
  const [reportType, setReportType] = useState<'blank' | 'filled'>('blank');
  const [includeQuiz, setIncludeQuiz] = useState<boolean>(true);

  const calc = computeThermalEquilibrium(
    state.coldVolumeMl,
    state.coldTempC,
    state.hotVolumeMl,
    state.hotTempC,
    state.mode,
    state.ambientTempC
  );

  const currentDate = new Date().toLocaleDateString('kk-KZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Control Banner for PDF generation (Hidden on paper/print) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs print:hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-700">
              <span>PDF Хаттамасы</span>
              <span aria-hidden="true">·</span>
              <span>Басып шығару бланкі</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              Зертханалық жұмыс пен бекіту-рефлексия парағы
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Төмендегі үлгіні оқушыларға таратып беру үшін бос бланк түрінде немесе дайын жауаптарымен PDF-ке шығара аласыз.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Template Selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setReportType('blank')}
                className={`px-3 py-1.5 font-semibold rounded-lg transition-all ${
                  reportType === 'blank'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Бос жұмыс парағы (Бланк)
              </button>
              <button
                type="button"
                onClick={() => setReportType('filled')}
                className={`px-3 py-1.5 font-semibold rounded-lg transition-all ${
                  reportType === 'filled'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Толтырылған нұсқа
              </button>
            </div>

            {/* Print / Save to PDF Button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 active:scale-98 rounded-xl shadow-xs transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>PDF ретінде сақтау / Басып шығару</span>
            </button>
          </div>
        </div>

        {/* Helpful instructions */}
        <div className="mt-3 p-3 bg-sky-50 border border-sky-100 rounded-xl text-xs text-sky-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>
            💡 <strong>Нұсқаулық:</strong> Батырманы басқан соң ашылатын баспа терезесінде «Принтер» бөлімінен <strong>«PDF түрінде сақтау» (Сохранить как PDF)</strong> таңдаңыз.
          </span>
          <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
            <input
              type="checkbox"
              checked={includeQuiz}
              onChange={(e) => setIncludeQuiz(e.target.checked)}
              className="rounded accent-sky-600"
            />
            <span>Бекіту тесті мен рефлексияны қосу</span>
          </label>
        </div>
      </div>

      {/* Printable Sheet (Stylized like real school laboratory paper) */}
      <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-10 shadow-sm text-slate-900 font-sans max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none print:text-black">
        
        {/* Lab Header */}
        <div className="border-b-2 border-slate-900 pb-3 text-center">
          <span className="text-xs uppercase tracking-widest text-slate-600 font-bold block mb-1">
            Физика пәні · Оқушының зертханалық жұмыс парағы
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
            №1 ЗЕРТХАНАЛЫҚ ЖҰМЫС
          </h1>
          <h2 className="text-sm sm:text-base font-bold text-slate-800 mt-1">
            «Температуралары әр түрлі суды араластырғандағы жылу мөлшерлерін салыстыру»
          </h2>
          <div className="text-xs text-slate-500 mt-0.5">
            8-сынып · Жылу құбылыстары
          </div>
        </div>

        {/* Student identification line */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3 border-b border-slate-300 text-xs">
          <div>
            <span className="text-slate-600">Оқушының аты-жөні: </span>
            <span className="font-bold underline decoration-dotted underline-offset-4">
              {reportType === 'filled' && assessment.studentName
                ? assessment.studentName
                : '__________________________________'}
            </span>
          </div>
          <div>
            <span className="text-slate-600">Сыныбы: </span>
            <span className="font-bold underline decoration-dotted underline-offset-4">
              8 «_____»
            </span>
          </div>
          <div>
            <span className="text-slate-600">Күні: </span>
            <span className="font-bold underline decoration-dotted underline-offset-4">
              {reportType === 'filled' ? currentDate : '«____» ____________ 2026 ж.'}
            </span>
          </div>
        </div>

        {/* Objectives & Apparatus */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 border-b border-slate-300 text-xs leading-relaxed print-avoid-break">
          <div>
            <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wide mb-1">
              Жұмыстың мақсаты:
            </h3>
            <ul className="list-disc list-inside space-y-0.5 text-slate-700">
              <li>Температуралары әртүрлі суды араластыру арқылы жылу алмасуды зерттеу</li>
              <li>Жылу мөлшерін есептеу</li>
              <li>Ыстық судың берген және суық судың алған жылуын салыстыру</li>
              <li>Тәжірибе нәтижесі бойынша қорытынды жасау</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wide mb-1">
              Құрал-жабдықтар:
            </h3>
            <p className="text-slate-700">
              Калориметр (жылу оқшаулағыш ыдыс), зертханалық термометр, өлшеуіш цилиндр (мензурка),
              ыстық су, суық су, электронды таразы, араластырғыш.
            </p>
            <div className="mt-1 font-mono text-[11px] text-slate-800">
              <strong>Негізгі формула:</strong> Q = c · m · (t₂ − t₁), су үшін: c = {C_WATER} Дж/(кг·°C)
            </div>
          </div>
        </div>

        {/* Section 1: Laboratory Data Table (Blank or Filled) */}
        <div className="py-4 border-b border-slate-300 print-avoid-break">
          <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wide mb-2 flex items-center justify-between">
            <span>1. Зертханалық жұмыс кестесі:</span>
            {reportType === 'blank' && (
              <span className="text-[10px] font-normal text-slate-500 print:hidden">
                (Бос торкөздерге өлшеу мәндерін жазыңыз)
              </span>
            )}
          </h3>

          <table className="w-full text-xs text-left border border-slate-400 border-collapse">
            <thead>
              <tr className="bg-slate-100 font-bold border-b border-slate-400 text-slate-900">
                <th className="p-2 border-r border-slate-400 w-1/3">Шамалар атауы</th>
                <th className="p-2 border-r border-slate-400 text-center">Суық су (1)</th>
                <th className="p-2 border-r border-slate-400 text-center">Ыстық су (2)</th>
                <th className="p-2 text-center">Қоспа (калориметр)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 font-mono">
              <tr>
                <td className="p-2 font-sans font-medium border-r border-slate-400">
                  Масса, кг (m)
                </td>
                <td className="p-2 border-r border-slate-400 text-center">
                  {reportType === 'filled' ? `${calc.m1_kg} кг` : 'm₁ = _________ кг'}
                </td>
                <td className="p-2 border-r border-slate-400 text-center">
                  {reportType === 'filled' ? `${calc.m2_kg} кг` : 'm₂ = _________ кг'}
                </td>
                <td className="p-2 text-center">
                  {reportType === 'filled' ? `${calc.m_total_kg} кг` : 'm₁+m₂ = _________ кг'}
                </td>
              </tr>
              <tr>
                <td className="p-2 font-sans font-medium border-r border-slate-400">
                  Бастапқы t, °C
                </td>
                <td className="p-2 border-r border-slate-400 text-center">
                  {reportType === 'filled' ? `${calc.t1} °C` : 't₁ = _________ °C'}
                </td>
                <td className="p-2 border-r border-slate-400 text-center">
                  {reportType === 'filled' ? `${calc.t2} °C` : 't₂ = _________ °C'}
                </td>
                <td className="p-2 text-center text-slate-400">—</td>
              </tr>
              <tr>
                <td className="p-2 font-sans font-medium border-r border-slate-400">
                  Соңғы t, °C
                </td>
                <td className="p-2 border-r border-slate-400 text-center text-slate-400">—</td>
                <td className="p-2 border-r border-slate-400 text-center text-slate-400">—</td>
                <td className="p-2 text-center font-bold">
                  {reportType === 'filled' ? `${calc.t_mix} °C` : 't = _________ °C'}
                </td>
              </tr>
              <tr className="bg-slate-50 font-semibold">
                <td className="p-2 font-sans font-bold border-r border-slate-400">
                  Жылу мөлшері, Дж (Q)
                </td>
                <td className="p-2 border-r border-slate-400 text-center">
                  {reportType === 'filled' ? `Q₁ = ${calc.q_absorbed} Дж` : 'Q₁ = _________ Дж'}
                </td>
                <td className="p-2 border-r border-slate-400 text-center">
                  {reportType === 'filled' ? `Q₂ = ${calc.q_released} Дж` : 'Q₂ = _________ Дж'}
                </td>
                <td className="p-2 text-center text-slate-400">—</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 2: Mathematical Calculations (Blank or Filled) */}
        <div className="py-4 border-b border-slate-300 print-avoid-break text-xs">
          <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wide mb-2">
            2. Есептеу жолы:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cold water calculation */}
            <div className="p-3 border border-slate-300 rounded-lg bg-slate-50/50">
              <div className="font-bold text-slate-900 mb-1">
                1) Суық судың алған жылуы (Qалған):
              </div>
              <div className="font-mono text-[11px] text-slate-700 mb-1">
                Qсуық = c · m₁ · (t − t₁)
              </div>
              {reportType === 'filled' ? (
                <div className="font-mono text-xs text-slate-800 space-y-1">
                  <div>Q₁ = {C_WATER} · {calc.m1_kg} · ({calc.t_mix} − {calc.t1})</div>
                  <div className="font-bold text-sky-800">Q₁ = {calc.q_absorbed} Дж</div>
                </div>
              ) : (
                <div className="space-y-2 mt-2">
                  <div className="text-slate-500 font-mono">
                    Q₁ = 4200 · _______ · (_______ − _______)
                  </div>
                  <div className="border-b border-dashed border-slate-400 h-5"></div>
                  <div className="font-bold text-slate-900">
                    Жауабы: Q₁ = ____________________ Дж
                  </div>
                </div>
              )}
            </div>

            {/* Hot water calculation */}
            <div className="p-3 border border-slate-300 rounded-lg bg-slate-50/50">
              <div className="font-bold text-slate-900 mb-1">
                2) Ыстық судың берген жылуы (Qберген):
              </div>
              <div className="font-mono text-[11px] text-slate-700 mb-1">
                Qыстық = c · m₂ · (t₂ − t)
              </div>
              {reportType === 'filled' ? (
                <div className="font-mono text-xs text-slate-800 space-y-1">
                  <div>Q₂ = {C_WATER} · {calc.m2_kg} · ({calc.t2} − {calc.t_mix})</div>
                  <div className="font-bold text-rose-800">Q₂ = {calc.q_released} Дж</div>
                </div>
              ) : (
                <div className="space-y-2 mt-2">
                  <div className="text-slate-500 font-mono">
                    Q₂ = 4200 · _______ · (_______ − _______)
                  </div>
                  <div className="border-b border-dashed border-slate-400 h-5"></div>
                  <div className="font-bold text-slate-900">
                    Жауабы: Q₂ = ____________________ Дж
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Heat balance comparison line */}
          <div className="mt-3 p-2.5 border border-slate-300 rounded-lg text-xs">
            <span className="font-bold text-slate-900">Жылу балансын салыстыру: </span>
            {reportType === 'filled' ? (
              <span>
                Qберген ({calc.q_released} Дж) ≈ Qалған ({calc.q_absorbed} Дж). 
                Жылу шығыны: ΔQ = {calc.delta_q} Дж.
              </span>
            ) : (
              <span>
                Qберген мен Qалған шамаларын салыстырыңыз: ____________________________________________________________________
              </span>
            )}
          </div>
        </div>

        {/* Section 3: Lab Conclusion (Blank lined or Filled) */}
        <div className="py-4 border-b border-slate-300 print-avoid-break text-xs leading-relaxed">
          <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wide mb-2">
            3. Зертханалық қорытынды:
          </h3>

          {reportType === 'filled' ? (
            <p className="p-3 bg-slate-50 rounded-lg border border-slate-300 text-slate-800">
              Тәжірибе барысында температуралары әр түрлі екі суды араластырған кезде жылу алмасу процесі байқалды.
              Ыстық су өз энергиясын беріп салқындады, ал суық су жылуды қабылдап жылыды.
              Қоспаның соңғы тұрақты температурасы <strong>{calc.t_mix}°C</strong> құрады. 
              Жылу балансы заңы бойынша оқшауланған жүйеде: <strong>Qберген = Qалған</strong>.
            </p>
          ) : (
            <div className="space-y-3.5 pt-1">
              <div className="border-b border-slate-400 h-4"></div>
              <div className="border-b border-slate-400 h-4"></div>
              <div className="border-b border-slate-400 h-4"></div>
              <div className="border-b border-slate-400 h-4"></div>
            </div>
          )}
        </div>

        {/* Section 4 & 5: Consolidation Quiz & Reflection (Blank or Filled) */}
        {includeQuiz && (
          <div className="py-4 border-b border-slate-300 print-avoid-break text-xs">
            <div className="border-b border-slate-300 pb-2 mb-3">
              <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wide">
                4. Бекіту сұрақтары (Слайд 13):
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="p-2.5 border border-slate-200 rounded-lg">
                <div className="font-bold mb-1.5">1. Жылу мөлшерінің өлшем бірлігі қандай?</div>
                <div className="space-y-1 text-slate-700">
                  <div>□ Ватт (Вт)</div>
                  <div>□ Паскаль (Па)</div>
                  <div>
                    {reportType === 'filled' ? '☑ Джоуль (Дж) (Дұрыс)' : '□ Джоуль (Дж)'}
                  </div>
                  <div>□ Ньютон (Н)</div>
                </div>
              </div>

              <div className="p-2.5 border border-slate-200 rounded-lg">
                <div className="font-bold mb-1.5">2. Судың меншікті жылу сыйымдылығы (c) қанша?</div>
                <div className="space-y-1 text-slate-700">
                  <div>
                    {reportType === 'filled' ? '☑ 4200 Дж/(кг·°C) (Дұрыс)' : '□ 4200 Дж/(кг·°C)'}
                  </div>
                  <div>□ 2100 Дж/(кг·°C)</div>
                  <div>□ 380 Дж/(кг·°C)</div>
                  <div>□ 1000 Дж/(кг·°C)</div>
                </div>
              </div>

              <div className="p-2.5 border border-slate-200 rounded-lg">
                <div className="font-bold mb-1.5">3. Жылу қай бағытта беріледі?</div>
                <div className="space-y-1 text-slate-700">
                  <div>□ Температурасы төменнен жоғарыға</div>
                  <div>
                    {reportType === 'filled'
                      ? '☑ Температурасы жоғарыдан төменге (Дұрыс)'
                      : '□ Температурасы жоғарыдан төменге'}
                  </div>
                </div>
              </div>

              <div className="p-2.5 border border-slate-200 rounded-lg">
                <div className="font-bold mb-1.5">4. Жылу балансының теңдеуі қандай?</div>
                <div className="space-y-1 text-slate-700">
                  <div>□ Q = m · g · h</div>
                  <div>
                    {reportType === 'filled' ? '☑ Qберген = Qалған (Дұрыс)' : '□ Qберген = Qалған'}
                  </div>
                  <div>□ E = m · c²</div>
                </div>
              </div>
            </div>

            {/* Reflection checklist (Slide 14) */}
            <div className="border-t border-slate-200 pt-3">
              <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wide mb-2">
                5. Бағалау және рефлексия (Слайд 14):
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-slate-700">
                  <div className="font-semibold text-slate-900 mb-1">Бағалау чек-листі:</div>
                  <div>□ Құралдарды дұрыс пайдаландым</div>
                  <div>□ Температураларды өлшедім</div>
                  <div>□ Кестені толтырдым</div>
                  <div>□ Жылу мөлшерін есептедім</div>
                  <div>□ Қорытынды жасадым</div>
                </div>

                <div>
                  <div className="font-semibold text-slate-900 mb-1.5">Өзін-өзі бағалау (Түсіну деңгейі):</div>
                  <div className="space-y-1 text-slate-700">
                    <div>○ 🟢 Түсіндім (Тақырып пен есептерді толық меңгердім)</div>
                    <div>○ 🟡 Сұрағым бар (Кейбір есептеулерде сұрақтар бар)</div>
                    <div>○ 🔴 Қайта түсіндіру қажет</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Homework note (Slide 15) */}
            <div className="border-t border-slate-200 pt-3 mt-3">
              <div className="font-bold text-slate-900 mb-1">
                Үй тапсырмасы: «Жылу алмасудың күнделікті өмірдегі маңызы» (5–6 сөйлем)
              </div>
              {reportType === 'blank' ? (
                <div className="space-y-3 pt-1">
                  <div className="border-b border-slate-400 h-4"></div>
                  <div className="border-b border-slate-400 h-4"></div>
                </div>
              ) : (
                <p className="text-slate-600 italic">
                  (Оқушының дәптерінде немесе қосымша парақта жазылады)
                </p>
              )}
            </div>
          </div>
        )}

        {/* Teacher Signature & Grade */}
        <div className="pt-4 flex items-center justify-between text-xs print-avoid-break">
          <div>
            <span className="text-slate-600 block">Мұғалімнің ескертпесі / пікірі:</span>
            <div className="w-48 sm:w-64 border-b border-slate-400 h-5 mt-1"></div>
          </div>

          <div className="text-right">
            <span className="text-slate-600 block">Бағасы: [ ________ ] &nbsp;&nbsp;&nbsp; Қолы: ____________________</span>
          </div>
        </div>

      </div>
    </div>
  );
};
