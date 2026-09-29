import React, { useState, useEffect } from 'react';
import {
  ExperimentState,
} from '../types';
import {
  computeThermalEquilibrium,
  formatNum,
  C_WATER,
} from '../utils/physics';
import {
  Thermometer,
  Scale,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  Waves,
} from 'lucide-react';
import { ThermalGraph } from './ThermalGraph';

interface LabStageProps {
  state: ExperimentState;
  setState: React.Dispatch<React.SetStateAction<ExperimentState>>;
  onGoToTable: () => void;
}

export const LabStage: React.FC<LabStageProps> = ({
  state,
  setState,
  onGoToTable,
}) => {
  const [scaleBeaker, setScaleBeaker] = useState<'none' | 'cold' | 'hot' | 'calorimeter'>('none');
  const [isTare, setIsTare] = useState(false);
  const [pouringColdAnim, setPouringColdAnim] = useState(false);
  const [pouringHotAnim, setPouringHotAnim] = useState(false);

  const calc = computeThermalEquilibrium(
    state.coldVolumeMl,
    state.coldTempC,
    state.hotVolumeMl,
    state.hotTempC,
    state.mode,
    state.ambientTempC
  );

  // Stirring simulation timer
  useEffect(() => {
    let timer: any;
    if (state.isStirring) {
      timer = setInterval(() => {
        setState((prev) => {
          if (prev.stirProgress >= 1) {
            return {
              ...prev,
              isStirring: false,
              stirProgress: 1,
              isEquilibriumReached: true,
              currentStep: Math.max(prev.currentStep, 6),
            };
          }
          return {
            ...prev,
            stirProgress: Math.min(1, prev.stirProgress + 0.08),
          };
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [state.isStirring, setState]);

  // Thermometer measured value depending on where it is dipped
  const getThermometerTemp = () => {
    switch (state.thermometerLocation) {
      case 'cold':
        return state.coldTempC;
      case 'hot':
        return state.hotTempC;
      case 'calorimeter':
        if (!state.coldPoured && !state.hotPoured) return state.ambientTempC;
        if (state.coldPoured && !state.hotPoured) return state.coldTempC;
        if (!state.coldPoured && state.hotPoured) return state.hotTempC;
        // Mixed!
        const currentT = state.coldTempC + (calc.t_mix - state.coldTempC) * state.stirProgress;
        return Math.round(currentT * 10) / 10;
      default:
        return state.ambientTempC;
    }
  };

  const currentTempReading = getThermometerTemp();

  // Scale mass display
  const getScaleReading = () => {
    const beakerEmptyMass = 80; // 80 grams tare
    switch (scaleBeaker) {
      case 'cold':
        return isTare ? state.coldVolumeMl : state.coldVolumeMl + beakerEmptyMass;
      case 'hot':
        return isTare ? state.hotVolumeMl : state.hotVolumeMl + beakerEmptyMass;
      case 'calorimeter':
        const innerCup = 45;
        const totalWater = (state.coldPoured ? state.coldVolumeMl : 0) + (state.hotPoured ? state.hotVolumeMl : 0);
        return isTare ? totalWater : totalWater + innerCup;
      default:
        return 0;
    }
  };

  const handlePourCold = () => {
    if (state.coldPoured) return;
    setPouringColdAnim(true);
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        coldPoured: true,
        currentStep: Math.max(prev.currentStep, 3),
      }));
      setPouringColdAnim(false);
    }, 900);
  };

  const handlePourHot = () => {
    if (state.hotPoured) return;
    setPouringHotAnim(true);
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        hotPoured: true,
        currentStep: Math.max(prev.currentStep, 5),
      }));
      setPouringHotAnim(false);
    }, 900);
  };

  const handleStartStirring = () => {
    if (!state.coldPoured || !state.hotPoured) return;
    setState((prev) => ({
      ...prev,
      isStirring: true,
      thermometerLocation: 'calorimeter',
    }));
  };

  // Steps descriptions matching Slide 8
  const steps = [
    { num: 1, title: 'Суық судың массасын анықтау', desc: 'Суық суды өлшеуіш цилиндрге құйып, көлемін (массасын) бақылаңыз.' },
    { num: 2, title: 'Суық судың t₁ температурасы', desc: 'Термометрді суық суға батырып, t₁ көрсеткішін анықтаңыз.' },
    { num: 3, title: 'Суық суды калориметрге құю', desc: 'Суық суды жылу оқшаулағыш калориметрге құйыңыз.' },
    { num: 4, title: 'Ыстық судың массасын анықтау', desc: 'Ыстық судың көлемін өлшеңіз (m₂).' },
    { num: 5, title: 'Ыстық судың t₂ температурасы', desc: 'Термометрмен ыстық судың бастапқы t₂ температурасын өлшеңіз.' },
    { num: 6, title: 'Екі суды араластыру', desc: 'Ыстық суды құйып, араластырғышпен араластырып, t теңесуін күтіңіз.' },
    { num: 7, title: 'Кесте мен Есептеулер', desc: 'Тәжірибе нәтижелерін кестеге енгізіп, жылу мөлшерлерін есептеңіз.' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Step Tracker & Safety Warning */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-700">
              <span>Тәжірибе барысы</span>
              <span aria-hidden="true">·</span>
              <span>{state.currentStep}-қадам / 7</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              {steps[state.currentStep - 1]?.title}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              {steps[state.currentStep - 1]?.desc}
            </p>
          </div>

          {/* Stepper bubbles */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {steps.map((st) => (
              <button
                key={st.num}
                onClick={() => setState((prev) => ({ ...prev, currentStep: st.num }))}
                className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                  state.currentStep === st.num
                    ? 'bg-sky-600 text-white shadow-xs'
                    : st.num < state.currentStep
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
                title={st.title}
              >
                {st.num < state.currentStep ? '✓' : st.num}
              </button>
            ))}
          </div>
        </div>

        {/* Safety alert from Slide 7 */}
        <div className="mt-3 flex items-start gap-2.5 p-2.5 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold">Қауіпсіздік ережесі:</span> Ыстық суды асықпай құйыңыз. Термометрді ыдыстың түбіне тигізбей, сұйықтық ортасында ұстаңыз.
          </div>
        </div>
      </div>

      {/* Main Two-Zone Workbench Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive Laboratory Canvas (7 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-5 text-white shadow-md relative overflow-hidden min-h-[460px] flex flex-col justify-between">
            {/* Lab Bench Wall & Title */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-mono tracking-wide text-slate-300">
                  ВИРТУАЛДЫ ЗЕРТХАНА ҮСТЕЛІ
                </span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1 text-xs">
                <span className="text-slate-400">Орта t:</span>
                <span className="font-mono text-emerald-400 font-semibold">{state.ambientTempC}°C</span>
              </div>
            </div>

            {/* Interactive Apparatus Simulation Scene */}
            <div className="relative my-4 flex-1 flex items-end justify-around gap-2 px-2 pb-6 pt-4 border-b-4 border-slate-700/60">
              
              {/* 1. Cold Water Station (Суық су стақаны) */}
              <div className="flex flex-col items-center group">
                <div className="relative mb-2">
                  {/* Thermometer dipped indicator */}
                  {state.thermometerLocation === 'cold' && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center animate-bounce">
                      <div className="bg-sky-500 text-white font-mono text-[11px] px-2 py-0.5 rounded shadow font-bold">
                        {state.coldTempC}°C
                      </div>
                      <div className="w-1.5 h-8 bg-sky-200 border border-sky-400 rounded-full"></div>
                    </div>
                  )}

                  {/* Cold Glass Beaker */}
                  <div
                    onClick={() => {
                      setState((p) => ({ ...p, thermometerLocation: 'cold', currentStep: Math.max(p.currentStep, 2) }));
                    }}
                    className={`w-24 h-32 rounded-b-2xl border-2 border-sky-300/60 bg-sky-950/20 backdrop-blur-xs relative flex flex-col justify-end p-1.5 cursor-pointer transition-transform hover:scale-105 ${
                      scaleBeaker === 'cold' ? 'ring-2 ring-emerald-400' : ''
                    } ${state.coldPoured ? 'opacity-35' : ''}`}
                    title="Суық су стақаны (Басу арқылы температураны өлшеңіз)"
                  >
                    {/* Measurement graduation markings */}
                    <div className="absolute left-1 top-3 bottom-3 flex flex-col justify-between text-[8px] font-mono text-sky-200/60 select-none">
                      <span>250</span>
                      <span>200</span>
                      <span>150</span>
                      <span>100</span>
                      <span>50</span>
                    </div>

                    {/* Water Level */}
                    {!state.coldPoured ? (
                      <div
                        style={{ height: `${(state.coldVolumeMl / 250) * 85}%` }}
                        className="w-full bg-gradient-to-t from-sky-600/80 to-cyan-400/70 rounded-b-xl relative transition-all duration-500 overflow-hidden"
                      >
                        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]"></div>
                        {/* Cold surface ripple */}
                        <div className="h-1.5 w-full bg-cyan-200/60 animate-pulse"></div>
                      </div>
                    ) : (
                      <div className="text-[10px] text-center text-slate-400 font-mono py-2">
                        Бос (құйылды)
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-xs font-semibold text-sky-300 block">
                    Суық су (t₁)
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {state.coldVolumeMl} мл · {state.coldTempC}°C
                  </span>
                  <div className="mt-1 flex gap-1">
                    <button
                      disabled={state.coldPoured}
                      onClick={handlePourCold}
                      className="px-2 py-0.5 text-[10px] font-medium bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white rounded transition"
                    >
                      Құю
                    </button>
                    <button
                      onClick={() => setScaleBeaker(scaleBeaker === 'cold' ? 'none' : 'cold')}
                      className="px-2 py-0.5 text-[10px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition"
                    >
                      Таразы
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Calorimeter (Орталық Калориметр) */}
              <div className="flex flex-col items-center">
                <div className="relative mb-2">
                  {/* Stirrer mechanism */}
                  <div
                    className={`absolute -top-14 left-6 z-20 transition-transform ${
                      state.isStirring ? 'translate-y-2' : ''
                    }`}
                  >
                    <div className="w-2 h-14 bg-amber-400/90 rounded-t border border-amber-300 shadow flex flex-col items-center justify-end">
                      <div className="w-5 h-2 bg-amber-500 rounded-sm"></div>
                    </div>
                  </div>

                  {/* Thermometer in Calorimeter */}
                  {state.thermometerLocation === 'calorimeter' && (
                    <div className="absolute -top-16 right-6 z-20 flex flex-col items-center animate-pulse">
                      <div className="bg-emerald-500 text-white font-mono text-[11px] px-2 py-0.5 rounded shadow font-bold">
                        {currentTempReading}°C
                      </div>
                      <div className="w-2 h-16 bg-red-100 border border-red-400 rounded-full flex flex-col justify-end p-0.5">
                        <div
                          style={{ height: `${(currentTempReading / 100) * 100}%` }}
                          className="w-full bg-rose-600 rounded-full transition-all duration-300"
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Outer Calorimeter Body with thermal insulation layer */}
                  <div
                    onClick={() => {
                      setState((p) => ({ ...p, thermometerLocation: 'calorimeter' }));
                    }}
                    className={`w-36 h-40 rounded-b-3xl border-4 border-slate-600 bg-slate-800/90 relative flex flex-col justify-end p-2 cursor-pointer shadow-lg transition-transform hover:scale-102 ${
                      scaleBeaker === 'calorimeter' ? 'ring-2 ring-emerald-400' : ''
                    }`}
                    title="Калориметр (Жылу оқшаулағыш қабаты бар)"
                  >
                    {/* Insulation foam / air layer label */}
                    <div className="absolute inset-x-1.5 top-1 bottom-1.5 border border-dashed border-amber-500/30 rounded-b-2xl pointer-events-none flex items-start justify-center">
                      <span className="text-[8px] uppercase tracking-wider text-amber-300/40 mt-1 font-mono">
                        Оқшаулағыш қабат
                      </span>
                    </div>

                    {/* Inner Aluminum Vessel */}
                    <div className="w-full h-32 rounded-b-2xl border-2 border-slate-400 bg-slate-900/90 relative flex flex-col justify-end overflow-hidden p-1">
                      {/* Mixed or Partial Water Level */}
                      {(state.coldPoured || state.hotPoured) ? (
                        <div
                          style={{
                            height: `${
                              (((state.coldPoured ? state.coldVolumeMl : 0) +
                                (state.hotPoured ? state.hotVolumeMl : 0)) /
                                400) *
                              90
                            }%`,
                          }}
                          className={`w-full rounded-b-xl relative transition-all duration-700 overflow-hidden ${
                            state.coldPoured && state.hotPoured
                              ? 'bg-gradient-to-t from-emerald-600/80 via-teal-500/80 to-sky-400/80'
                              : state.coldPoured
                              ? 'bg-gradient-to-t from-sky-600/80 to-cyan-400/80'
                              : 'bg-gradient-to-t from-rose-600/80 to-amber-500/80'
                          }`}
                        >
                          {/* Liquid surface wave */}
                          <div className="h-1.5 w-full bg-white/40 animate-pulse"></div>

                          {/* Steam if hot or warm */}
                          {(state.hotPoured || state.stirProgress > 0) && (
                            <div className="absolute top-0 inset-x-0 flex justify-center gap-2 opacity-50">
                              <span className="w-1 h-3 bg-white/30 rounded-full animate-ping"></span>
                              <span className="w-1 h-3 bg-white/30 rounded-full animate-ping delay-100"></span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-[10px] text-center text-slate-500 font-mono py-6">
                          Калориметр бос
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-xs font-semibold text-emerald-300 block">
                    Калориметр (Қоспа)
                  </span>
                  <span className="text-[11px] font-mono text-slate-300">
                    Көлем:{' '}
                    {(state.coldPoured ? state.coldVolumeMl : 0) +
                      (state.hotPoured ? state.hotVolumeMl : 0)}{' '}
                    мл
                  </span>
                  <div className="mt-1 flex items-center justify-center gap-1.5">
                    <button
                      disabled={!state.coldPoured || !state.hotPoured || state.isStirring}
                      onClick={handleStartStirring}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                        state.isEquilibriumReached
                          ? 'bg-emerald-600 text-white'
                          : state.coldPoured && state.hotPoured
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 animate-pulse'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Waves className="w-3.5 h-3.5" />
                      {state.isStirring
                        ? 'Араласуда...'
                        : state.isEquilibriumReached
                        ? 'Тепе-теңдік орнады'
                        : 'Араластыру'}
                    </button>
                    <button
                      onClick={() => setScaleBeaker(scaleBeaker === 'calorimeter' ? 'none' : 'calorimeter')}
                      className="px-2 py-1 text-[10px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition"
                    >
                      Таразы
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. Hot Water Station (Ыстық су стақаны) */}
              <div className="flex flex-col items-center group">
                <div className="relative mb-2">
                  {/* Thermometer dipped indicator */}
                  {state.thermometerLocation === 'hot' && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center animate-bounce">
                      <div className="bg-rose-500 text-white font-mono text-[11px] px-2 py-0.5 rounded shadow font-bold">
                        {state.hotTempC}°C
                      </div>
                      <div className="w-1.5 h-8 bg-rose-200 border border-rose-400 rounded-full"></div>
                    </div>
                  )}

                  {/* Hot Glass Beaker */}
                  <div
                    onClick={() => {
                      setState((p) => ({ ...p, thermometerLocation: 'hot', currentStep: Math.max(p.currentStep, 4) }));
                    }}
                    className={`w-24 h-32 rounded-b-2xl border-2 border-rose-300/60 bg-rose-950/20 backdrop-blur-xs relative flex flex-col justify-end p-1.5 cursor-pointer transition-transform hover:scale-105 ${
                      scaleBeaker === 'hot' ? 'ring-2 ring-emerald-400' : ''
                    } ${state.hotPoured ? 'opacity-35' : ''}`}
                    title="Ыстық су стақаны (Басу арқылы температураны өлшеңіз)"
                  >
                    {/* Measurement markings */}
                    <div className="absolute left-1 top-3 bottom-3 flex flex-col justify-between text-[8px] font-mono text-rose-200/60 select-none">
                      <span>250</span>
                      <span>200</span>
                      <span>150</span>
                      <span>100</span>
                      <span>50</span>
                    </div>

                    {/* Steam effects */}
                    {!state.hotPoured && (
                      <div className="absolute -top-6 inset-x-0 flex justify-center gap-1.5 pointer-events-none">
                        <span className="w-1 h-4 bg-white/20 rounded-full animate-pulse"></span>
                        <span className="w-1 h-6 bg-white/30 rounded-full animate-pulse delay-75"></span>
                        <span className="w-1 h-3 bg-white/20 rounded-full animate-pulse delay-150"></span>
                      </div>
                    )}

                    {/* Water Level */}
                    {!state.hotPoured ? (
                      <div
                        style={{ height: `${(state.hotVolumeMl / 250) * 85}%` }}
                        className="w-full bg-gradient-to-t from-rose-700/80 to-amber-500/70 rounded-b-xl relative transition-all duration-500 overflow-hidden"
                      >
                        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]"></div>
                        {/* Hot surface ripple */}
                        <div className="h-1.5 w-full bg-amber-200/70 animate-pulse"></div>
                      </div>
                    ) : (
                      <div className="text-[10px] text-center text-slate-400 font-mono py-2">
                        Бос (құйылды)
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-xs font-semibold text-rose-300 block">
                    Ыстық су (t₂)
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {state.hotVolumeMl} мл · {state.hotTempC}°C
                  </span>
                  <div className="mt-1 flex gap-1">
                    <button
                      disabled={state.hotPoured}
                      onClick={handlePourHot}
                      className="px-2 py-0.5 text-[10px] font-medium bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white rounded transition"
                    >
                      Құю
                    </button>
                    <button
                      onClick={() => setScaleBeaker(scaleBeaker === 'hot' ? 'none' : 'hot')}
                      className="px-2 py-0.5 text-[10px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition"
                    >
                      Таразы
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Accessories on Lab Bench: Digital Scale & Thermometer Selector */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800">
              
              {/* Digital Scale Display */}
              <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between gap-2">
                    <span>Электронды таразы:</span>
                    <button
                      onClick={() => setIsTare(!isTare)}
                      className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                        isTare ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                      }`}
                      title="Ыдыс массасын шегеру (Тара)"
                    >
                      TARA: {isTare ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <div className="font-mono text-emerald-400 font-bold text-sm tracking-wider">
                    {getScaleReading()} г{' '}
                    <span className="text-[10px] text-slate-400">
                      ({formatNum(getScaleReading() / 1000, 3)} кг)
                    </span>
                  </div>
                </div>
              </div>

              {/* Lab Thermometer Selector */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium mr-1">
                  <Thermometer className="w-4 h-4 text-sky-400" />
                  <span>Термометр:</span>
                </div>
                <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
                  <button
                    onClick={() => setState((p) => ({ ...p, thermometerLocation: 'cold' }))}
                    className={`px-2 py-1 text-xs rounded transition ${
                      state.thermometerLocation === 'cold'
                        ? 'bg-sky-600 text-white font-semibold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Суық суда
                  </button>
                  <button
                    onClick={() => setState((p) => ({ ...p, thermometerLocation: 'calorimeter' }))}
                    className={`px-2 py-1 text-xs rounded transition ${
                      state.thermometerLocation === 'calorimeter'
                        ? 'bg-emerald-600 text-white font-semibold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Калориметрде
                  </button>
                  <button
                    onClick={() => setState((p) => ({ ...p, thermometerLocation: 'hot' }))}
                    className={`px-2 py-1 text-xs rounded transition ${
                      state.thermometerLocation === 'hot'
                        ? 'bg-rose-600 text-white font-semibold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Ыстық суда
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Flow Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200">
            <div className="text-xs text-slate-600">
              {state.isEquilibriumReached ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Жылу алмасу аяқталды! Тұрақты соңғы температура: {calc.t_mix}°C
                </span>
              ) : (
                <span>
                  Тәжірибе шарты: Суық суға ({state.coldTempC}°C) ыстық су ({state.hotTempC}°C) қосылды.
                </span>
              )}
            </div>

            <button
              onClick={onGoToTable}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition"
            >
              <span>Кесте мен Есептеулерге өту</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Parameters Deck & Live Graph (5 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Controls Deck */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Тәжірибе параметрлері
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">
                8-сынып зертханасы
              </span>
            </div>

            {/* Cold Water Sliders */}
            <div className="space-y-3 bg-sky-50/60 p-3 rounded-xl border border-sky-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-900">
                  1. Суық су (V₁, t₁)
                </span>
                <span className="text-xs font-mono font-semibold text-sky-700">
                  {state.coldVolumeMl} мл · {state.coldTempC} °C
                </span>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>Көлемі (V₁ = m₁):</span>
                  <span className="font-mono">{state.coldVolumeMl} мл ({formatNum(state.coldVolumeMl / 1000, 2)} кг)</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="10"
                  value={state.coldVolumeMl}
                  disabled={state.coldPoured}
                  onChange={(e) =>
                    setState((p) => ({ ...p, coldVolumeMl: Number(e.target.value) }))
                  }
                  className="w-full accent-sky-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>Бастапқы t₁:</span>
                  <span className="font-mono">{state.coldTempC} °C</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={state.coldTempC}
                  disabled={state.coldPoured}
                  onChange={(e) =>
                    setState((p) => ({ ...p, coldTempC: Number(e.target.value) }))
                  }
                  className="w-full accent-sky-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                />
              </div>
            </div>

            {/* Hot Water Sliders */}
            <div className="space-y-3 bg-rose-50/60 p-3 rounded-xl border border-rose-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-900">
                  2. Ыстық су (V₂, t₂)
                </span>
                <span className="text-xs font-mono font-semibold text-rose-700">
                  {state.hotVolumeMl} мл · {state.hotTempC} °C
                </span>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>Көлемі (V₂ = m₂):</span>
                  <span className="font-mono">{state.hotVolumeMl} мл ({formatNum(state.hotVolumeMl / 1000, 2)} кг)</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="10"
                  value={state.hotVolumeMl}
                  disabled={state.hotPoured}
                  onChange={(e) =>
                    setState((p) => ({ ...p, hotVolumeMl: Number(e.target.value) }))
                  }
                  className="w-full accent-rose-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>Бастапқы t₂:</span>
                  <span className="font-mono">{state.hotTempC} °C</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="90"
                  step="1"
                  value={state.hotTempC}
                  disabled={state.hotPoured}
                  onChange={(e) =>
                    setState((p) => ({ ...p, hotTempC: Number(e.target.value) }))
                  }
                  className="w-full accent-rose-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                />
              </div>
            </div>

            {/* Pre-sets shortcuts */}
            <div className="border-t border-slate-100 pt-3">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Тәжірибе үлгілері (Пресеттер):
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  disabled={state.coldPoured || state.hotPoured}
                  onClick={() => {
                    setState((p) => ({
                      ...p,
                      coldVolumeMl: 100,
                      coldTempC: 20,
                      hotVolumeMl: 100,
                      hotTempC: 70,
                    }));
                  }}
                  className="p-2 text-left rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition disabled:opacity-50"
                >
                  <div className="font-medium text-slate-800">Тең массалар</div>
                  <div className="text-[10px] text-slate-500">100мл (20°) + 100мл (70°)</div>
                </button>
                <button
                  type="button"
                  disabled={state.coldPoured || state.hotPoured}
                  onClick={() => {
                    setState((p) => ({
                      ...p,
                      coldVolumeMl: 150,
                      coldTempC: 15,
                      hotVolumeMl: 75,
                      hotTempC: 85,
                    }));
                  }}
                  className="p-2 text-left rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition disabled:opacity-50"
                >
                  <div className="font-medium text-slate-800">2:1 қатынасы</div>
                  <div className="text-[10px] text-slate-500">150мл (15°) + 75мл (85°)</div>
                </button>
              </div>
            </div>

          </div>

          {/* Real-time Dynamic Temperature Graph */}
          <ThermalGraph
            t1={state.coldTempC}
            t2={state.hotTempC}
            t_mix={calc.t_mix}
            progress={state.stirProgress}
            isMixed={state.coldPoured && state.hotPoured}
          />
        </div>
      </div>
    </div>
  );
};
