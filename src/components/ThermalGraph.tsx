import React from 'react';

interface ThermalGraphProps {
  t1: number;
  t2: number;
  t_mix: number;
  progress: number; // 0 to 1
  isMixed: boolean;
}

export const ThermalGraph: React.FC<ThermalGraphProps> = ({
  t1,
  t2,
  t_mix,
  progress,
  isMixed,
}) => {
  const width = 420;
  const height = 180;
  const padding = { top: 20, right: 35, bottom: 30, left: 45 };

  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Y-axis range: 0 to 100 °C
  const yMin = 0;
  const yMax = 100;

  const getY = (temp: number) => {
    return padding.top + graphHeight - ((temp - yMin) / (yMax - yMin)) * graphHeight;
  };

  const getX = (tRatio: number) => {
    return padding.left + tRatio * graphWidth;
  };

  // Generate curve points
  const pointsCount = 40;
  const coldPoints: string[] = [];
  const hotPoints: string[] = [];

  const effectiveProgress = isMixed ? Math.max(0.1, progress) : 0;

  for (let i = 0; i <= pointsCount; i++) {
    const ratio = i / pointsCount;
    const x = getX(ratio);

    if (!isMixed) {
      // Flat initial lines
      coldPoints.push(`${x},${getY(t1)}`);
      hotPoints.push(`${x},${getY(t2)}`);
    } else {
      // Dynamic convergence
      const simRatio = Math.min(1, ratio / effectiveProgress);
      const ease = 1 - Math.exp(-4 * simRatio);
      
      const currentCold = t1 + (t_mix - t1) * ease;
      const currentHot = t2 - (t2 - t_mix) * ease;

      if (ratio <= effectiveProgress) {
        coldPoints.push(`${x},${getY(currentCold)}`);
        hotPoints.push(`${x},${getY(currentHot)}`);
      }
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="text-sm font-semibold text-slate-800">
            Жылу алмасу графигі (t — уақыт)
          </h4>
          <p className="text-xs text-slate-500">
            Температуралардың теңесу динамикасы
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-sky-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            Суық су ({t1}°C)
          </span>
          <span className="flex items-center gap-1.5 text-rose-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            Ыстық су ({t2}°C)
          </span>
          {isMixed && (
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Қоспа ({t_mix}°C)
            </span>
          )}
        </div>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((t) => (
            <g key={t}>
              <line
                x1={padding.left}
                y1={getY(t)}
                x2={width - padding.right}
                y2={getY(t)}
                stroke="#f1f5f9"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={getY(t) + 3}
                fill="#94a3b8"
                fontSize="10"
                textAnchor="end"
                className="font-mono tabular-nums"
              >
                {t}°C
              </text>
            </g>
          ))}

          {/* Equilibrium reference line if mixed */}
          {isMixed && (
            <g>
              <line
                x1={padding.left}
                y1={getY(t_mix)}
                x2={width - padding.right}
                y2={getY(t_mix)}
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text
                x={width - padding.right + 4}
                y={getY(t_mix) + 3}
                fill="#059669"
                fontSize="10"
                fontWeight="600"
                className="font-mono tabular-nums"
              >
                {t_mix}°C
              </text>
            </g>
          )}

          {/* Axes */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={height - padding.bottom}
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />

          {/* Time axis label */}
          <text
            x={width - padding.right}
            y={height - padding.bottom + 18}
            fill="#94a3b8"
            fontSize="10"
            textAnchor="end"
          >
            Уақыт (τ, с) →
          </text>

          {/* Hot water cooling curve */}
          {hotPoints.length > 1 && (
            <polyline
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={hotPoints.join(' ')}
            />
          )}

          {/* Cold water heating curve */}
          {coldPoints.length > 1 && (
            <polyline
              fill="none"
              stroke="#0284c7"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={coldPoints.join(' ')}
            />
          )}

          {/* Active pointer indicators */}
          {isMixed && (
            <circle
              cx={getX(effectiveProgress)}
              cy={getY(t_mix)}
              r="4.5"
              fill="#10b981"
              stroke="#ffffff"
              strokeWidth="2"
              className="transition-all duration-150"
            />
          )}
        </svg>
      </div>

      <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
        <span>Тұжырым: Жылу алмасу температуралар теңескенге дейін жүреді.</span>
        <span className="font-mono font-medium text-slate-700">
          Q = c · m · Δt
        </span>
      </div>
    </div>
  );
};
