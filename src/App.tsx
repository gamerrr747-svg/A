/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { LabStage } from './components/LabStage';
import { DataTable } from './components/DataTable';
import { AnalysisSection } from './components/AnalysisSection';
import { QuizReflection } from './components/QuizReflection';
import { PrintableReport } from './components/PrintableReport';
import { ExperimentState, SelfAssessment } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'lab' | 'table' | 'analysis' | 'quiz' | 'report'>('lab');

  const initialExperimentState: ExperimentState = {
    coldVolumeMl: 100,
    coldTempC: 20,
    hotVolumeMl: 100,
    hotTempC: 70,
    coldPoured: false,
    hotPoured: false,
    isStirring: false,
    stirProgress: 0,
    isEquilibriumReached: false,
    mode: 'ideal',
    ambientTempC: 20,
    activeTool: 'none',
    thermometerLocation: 'bench',
    currentStep: 1,
    guideMode: true,
  };

  const [state, setState] = useState<ExperimentState>(initialExperimentState);

  const [assessment, setAssessment] = useState<SelfAssessment>({
    usedTools: true,
    measuredTemp: true,
    filledTable: true,
    calculatedHeat: true,
    madeConclusion: true,
    comprehensionLevel: 'understood',
    studentName: '',
  });

  const handleReset = () => {
    setState({
      ...initialExperimentState,
      mode: state.mode,
    });
  };

  const handlePrint = () => {
    setActiveTab('report');
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mode={state.mode}
        setMode={(newMode) => setState((p) => ({ ...p, mode: newMode }))}
        onReset={handleReset}
        onPrint={handlePrint}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'lab' && (
          <LabStage
            state={state}
            setState={setState}
            onGoToTable={() => setActiveTab('table')}
          />
        )}

        {activeTab === 'table' && (
          <DataTable
            state={state}
            onGoToAnalysis={() => setActiveTab('analysis')}
          />
        )}

        {activeTab === 'analysis' && (
          <AnalysisSection
            state={state}
            onGoToQuiz={() => setActiveTab('quiz')}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizReflection
            assessment={assessment}
            setAssessment={setAssessment}
            onGoToReport={() => setActiveTab('report')}
          />
        )}

        {activeTab === 'report' && (
          <PrintableReport state={state} assessment={assessment} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-4 bg-white text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            8-сынып Физика · №1 Зертханалық жұмыс «Температуралары әр түрлі суды араластырғандағы жылу мөлшерлерін салыстыру»
          </span>
          <span className="text-slate-400">
            «Зерттеу арқылы — заңдылықты өзіміз ашамыз!»
          </span>
        </div>
      </footer>
    </div>
  );
}
