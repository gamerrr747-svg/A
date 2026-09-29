import React from 'react';
import { RotateCcw, Flame, Sparkles, Printer } from 'lucide-react';

interface HeaderProps {
  activeTab: 'lab' | 'table' | 'analysis' | 'quiz' | 'report';
  setActiveTab: (tab: 'lab' | 'table' | 'analysis' | 'quiz' | 'report') => void;
  mode: 'ideal' | 'realistic';
  setMode: (mode: 'ideal' | 'realistic') => void;
  onReset: () => void;
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  mode,
  setMode,
  onReset,
  onPrint,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-amber-500 flex items-center justify-center text-white shadow-sm shadow-sky-500/20">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                №1 Зертханалық жұмыс
              </span>
              <span className="text-xs text-slate-500 hidden sm:block">
                8-сынып · Жылу мөлшерлерін салыстыру
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation tabs with single-line labels */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab('lab')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'lab'
                  ? 'bg-sky-50 text-sky-700 shadow-sm border border-sky-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              1. Тәжірибе
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'table'
                  ? 'bg-sky-50 text-sky-700 shadow-sm border border-sky-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              2. Кесте & Есеп
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'analysis'
                  ? 'bg-sky-50 text-sky-700 shadow-sm border border-sky-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              3. Талдау
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'quiz'
                  ? 'bg-sky-50 text-sky-700 shadow-sm border border-sky-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              4. Бекіту & Тест
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'report'
                  ? 'bg-sky-50 text-sky-700 shadow-sm border border-sky-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              5. PDF Бланк & Хаттама
            </button>
          </nav>

          {/* Zone 3: Primary actions & mode */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setMode('ideal')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  mode === 'ideal'
                    ? 'bg-white text-slate-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Жылу шығыны жоқ (Идеал калориметр)"
              >
                Идеал жүйе
              </button>
              <button
                type="button"
                onClick={() => setMode('realistic')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  mode === 'realistic'
                    ? 'bg-white text-slate-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Шынайы жылу шығынымен (калориметр ыдысы және қоршаған орта)"
              >
                Шынайы тәжірибе
              </button>
            </div>

            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Тәжірибені қайта бастау"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Бастапқы күйге</span>
            </button>

            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition-colors"
              title="Бос бланкті немесе есепті PDF түрінде сақтау / басып шығару"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PDF / Баспа</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
