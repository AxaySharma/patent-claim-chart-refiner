import React from 'react';
import type { ClaimChart, ClaimElement } from '../types';
import { ElementRow } from './ElementRow';
import { FileCode, Download, RefreshCw } from 'lucide-react';

interface ChartTableProps {
  chart: ClaimChart;
  activeElementId: string | null;
  onSelectElement: (element: ClaimElement) => void;
  onUpdateElement: (updated: ClaimElement) => void;
}

export const ChartTable: React.FC<ChartTableProps> = ({
  chart,
  activeElementId,
  onSelectElement,
  onUpdateElement,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-full">
      {/* Table Header Details */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-slate-700" />
            <h2 className="text-sm font-semibold text-slate-900">
              {chart.patentNumber} — Claim {chart.claimNumber}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{chart.patentTitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors">
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            Re-evaluate
          </button>
          <button className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-white bg-slate-900 rounded hover:bg-slate-800 transition-colors">
            <Download className="w-3.5 h-3.5" />
            Export Chart
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto overflow-y-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider sticky top-0 z-10">
              <th className="py-2.5 px-4 w-1/3">Patent Claim Element</th>
              <th className="py-2.5 px-4 w-1/3">Accused Product Feature + Evidence</th>
              <th className="py-2.5 px-4 w-1/3">AI Reasoning & Status</th>
            </tr>
          </thead>
          <tbody>
            {chart.elements.map((element) => (
              <ElementRow
                key={element.id}
                element={element}
                isActive={element.id === activeElementId}
                onSelect={() => onSelectElement(element)}
                onUpdateElement={onUpdateElement}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
