import React from 'react';
import { ExperimentState, SelfAssessment } from '../types';
import { computeThermalEquilibrium, formatNum, C_WATER } from '../utils/physics';
import { Printer, CheckCircle, Award } from 'lucide-react';

interface PrintableReportProps {
  state: ExperimentState;
  assessment: SelfAssessment;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({
  state,
  assessment,
}) => {
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
      {/* Top action bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Зертханалық жұмыстың ресми есебі (Хаттама)
          </h3>
          <p className="text-xs text-slate-500">
            Мұғалімге тапсыру үшін немесе дәптерге басып жапсыруға дайын парақ
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs transition"
        >
          <Printer className="w-4 h-4" />
          <span>Басып шығару (Печать / PDF)</span>
        </button>
      </div>

      {/* Official Lab Paper Canvas */}
      <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-10 shadow-sm text-slate-900 font-sans max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
        
        {/* Header */}
        <div className="border-b-2 border-slate-900 pb-4 text-center">
          <span className="text-xs uppercase tracking-widest text-slate-500 font-bold block mb-1">
            Физика пәні бойынша оқушының зертханалық жұмысы
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            №1 ЗЕРТХАНАЛЫҚ ЖҰМЫС
          </h1>
          <h2 className="text-sm sm:text-base font-semibold text-slate-700 mt-1">
            «Температуралары әр түрлі суды араластырғандағы жылу мөлшерлерін салыстыру»
          </h2>
          <div className="text-xs text-slate-500 mt-1">
            8-сынып · Жылу құбылыстары
          </div>
        </div>

        {/* Student metadata row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-b border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block">Оқушы:</span>
            <span className="font-bold text-slate-900 text-sm">
              {assessment.studentName || 'Оқушы'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Сынып:</span>
            <span className="font-bold text-slate-900 text-sm">8 «А» сыныбы</span>
          </div>
          <div>
            <span className="text-slate-500 block">Күні:</span>
            <span className="font-bold text-slate-900 text-sm">{currentDate}</span>
          </div>
        </div>

        {/* Purpose and Equipment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-b border-slate-200 text-xs leading-relaxed">
          <div>
            <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wide mb-1">
              Жұмыстың мақсаты:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>Температуралары әртүрлі суды араластыру арқылы жылу алмасуды зерттеу</li>
              <li>Жылу мөлшерін формула бойынша есептеу</li>
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
            <div className="mt-2 text-slate-600 font-mono text-[11px]">
              Негізгі формула: Q = c · m · Δt, мұндағы c = {C_WATER} Дж/(кг·°C)
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="py-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wide mb-2">
            Өлшеу және есептеу нәтижелері кестесі:
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 font-bold border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300">Шамалар атауы</th>
                  <th className="p-2 border-r border-slate-300">Суық су (1)</th>
                  <th className="p-2 border-r border-slate-300">Ыстық су (2)</th>
                  <th className="p-2">Қоспа (калориметр)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                <tr>
                  <td className="p-2 font-sans font-medium border-r border-slate-300">Масса (m), кг</td>
                  <td className="p-2 border-r border-slate-300">{calc.m1_kg} кг</td>
                  <td className="p-2 border-r border-slate-300">{calc.m2_kg} кг</td>
                  <td className="p-2 font-bold">{calc.m_total_kg} кг</td>
                </tr>
                <tr>
                  <td className="p-2 font-sans font-medium border-r border-slate-300">Бастапқы температура (t), °C</td>
                  <td className="p-2 border-r border-slate-300">{calc.t1} °C</td>
                  <td className="p-2 border-r border-slate-300">{calc.t2} °C</td>
                  <td className="p-2 text-slate-400">—</td>
                </tr>
                <tr>
                  <td className="p-2 font-sans font-medium border-r border-slate-300">Соңғы температура (t), °C</td>
                  <td className="p-2 text-slate-400 border-r border-slate-300">—</td>
                  <td className="p-2 text-slate-400 border-r border-slate-300">—</td>
                  <td className="p-2 font-bold text-emerald-800">{calc.t_mix} °C</td>
                </tr>
                <tr className="bg-slate-50 font-semibold">
                  <td className="p-2 font-sans font-bold border-r border-slate-300">Жылу мөлшері (Q), Дж</td>
                  <td className="p-2 border-r border-slate-300 text-sky-800">Q₁ = {calc.q_absorbed} Дж</td>
                  <td className="p-2 border-r border-slate-300 text-rose-800">Q₂ = {calc.q_released} Дж</td>
                  <td className="p-2 text-slate-400">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Calculations breakdown */}
        <div className="py-4 border-b border-slate-200 text-xs">
          <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wide mb-2">
            Есептеу жолы:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="font-bold text-slate-800 mb-1">1. Суық судың алған жылуы:</div>
              <div>Qсуық = c · m₁ · (t − t₁)</div>
              <div>Q₁ = {C_WATER} · {calc.m1_kg} · ({calc.t_mix} − {calc.t1}) = <strong>{calc.q_absorbed} Дж</strong></div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="font-bold text-slate-800 mb-1">2. Ыстық судың берген жылуы:</div>
              <div>Qыстық = c · m₂ · (t₂ − t)</div>
              <div>Q₂ = {C_WATER} · {calc.m2_kg} · ({calc.t2} − {calc.t_mix}) = <strong>{calc.q_released} Дж</strong></div>
            </div>
          </div>
        </div>

        {/* Conclusion */}
        <div className="py-4 border-b border-slate-200 text-xs leading-relaxed">
          <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wide mb-1">
            Зертханалық қорытынды:
          </h3>
          <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-800">
            Тәжірибе барысында температуралары әр түрлі екі су араластырылды. 
            Нәтижесінде температурасы жоғары ыстық су жылу бөліп шығарып салқындады, 
            ал температурасы төмен суық су сол жылуды қабылдап қызды. Жылулық тепе-теңдік орнаған кезде 
            қоспаның температурасы <strong>{calc.t_mix}°C</strong> болды. 
            Жылу балансы теңдеуіне сәйкес, идеал жағдайда <strong>Qберген ≈ Qалған</strong>. 
            (Тәжірибедегі жылу шығыны ΔQ = {calc.delta_q} Дж құрады).
          </p>
        </div>

        {/* Teacher Grade Sheet */}
        <div className="pt-4 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 block">Оқушының рефлексиясы:</span>
            <span className="font-bold text-slate-800">
              {assessment.comprehensionLevel === 'understood'
                ? '🟢 Материалды толық түсіндім'
                : assessment.comprehensionLevel === 'has_questions'
                ? '🟡 Сұрақтарым бар'
                : 'Критерийлер орындалды'}
            </span>
          </div>

          <div className="text-right">
            <span className="text-slate-500 block">Мұғалімнің қолы / Бағасы:</span>
            <div className="w-32 border-b border-slate-400 mt-4"></div>
          </div>
        </div>

      </div>
    </div>
  );
};
