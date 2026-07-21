import React from 'react';
import type { ClaimChart, ClaimElement } from '../types';
import { ElementRow } from './ElementRow';
import { FileCode, Download, RefreshCw } from 'lucide-react';

interface ChartTableProps {
  chart: ClaimChart;
  onUpdateElement: (updated: ClaimElement) => void;
}

export const ChartTable: React.FC<ChartTableProps> = ({ chart, onUpdateElement }) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-900">
              {chart.patentNumber} — Claim {chart.claimNumber}
            </h2>
          </div>
          <p className="text-sm text-slate-600 mt-1">{chart.patentTitle}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Target Product: <span className="font-medium text-slate-700">{chart.targetProduct}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 shadow-xs transition-colors">
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            Re-analyze Chart
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded hover:bg-slate-800 shadow-xs transition-colors">
            <Download className="w-3.5 h-3.5" />
            Export (PDF/Docx)
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Element #</th>
              <th className="py-3 px-4">Claim Language</th>
              <th className="py-3 px-4">Prior Art / Product Mapping</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {chart.elements.map((element) => (
              <ElementRow
                key={element.id}
                element={element}
                onUpdateElement={onUpdateElement}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
