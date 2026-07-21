import React from 'react';
import { Upload, FileText, Settings, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface SetupScreenProps {
  hasLoadedChart: boolean;
  onLoadMockChart: () => void;
  docFilename: string;
  onDocFileChange: (filename: string) => void;
  systemPrompt: string;
  onSystemPromptChange: (prompt: string) => void;
  onStartSession: () => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({
  hasLoadedChart,
  onLoadMockChart,
  docFilename,
  onDocFileChange,
  systemPrompt,
  onSystemPromptChange,
  onStartSession,
}) => {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onDocFileChange(e.target.files[0].name);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-10">
        <div className="inline-flex p-3 bg-slate-900 text-white rounded-xl mb-4 shadow-sm">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Setup Refinement Session</h1>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
          Upload your patent claim chart, attach supporting product documentation, and configure AI analyst guidelines.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-8">
        {/* Section 1: Upload Claim Chart */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-bold text-slate-700">
              1
            </span>
            <h2 className="text-sm font-semibold text-slate-900">Claim Chart Source</h2>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-800">
                {hasLoadedChart ? 'US 9,876,543 B2 vs Acme Thermostat' : 'No claim chart loaded'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {hasLoadedChart
                  ? '3 claim elements ready for AI evaluation'
                  : 'Load a claim chart dataset to begin'}
              </p>
            </div>

            <button
              onClick={onLoadMockChart}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded transition-colors ${
                hasLoadedChart
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs'
              }`}
            >
              {hasLoadedChart ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Loaded: US9876543 vs Acme
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload sample claim chart (US123456 vs Acme Thermostat)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Section 2: Supporting Product Documentation */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-bold text-slate-700">
              2
            </span>
            <h2 className="text-sm font-semibold text-slate-900">Supporting Product Documentation</h2>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 shadow-xs transition-colors">
                <FileText className="w-4 h-4 text-slate-500" />
                Select Documentation File
                <input type="file" onChange={handleFileSelect} className="hidden" />
              </label>
              <span className="text-xs text-slate-500 truncate max-w-xs">
                {docFilename ? (
                  <span className="font-medium text-slate-700">{docFilename}</span>
                ) : (
                  'No file selected (optional)'
                )}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Attach technical datasheets, user manuals, or source code specs for additional grounding context.
            </p>
          </div>
        </div>

        {/* Section 3: AI Instructions */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-bold text-slate-700">
              3
            </span>
            <h2 className="text-sm font-semibold text-slate-900">AI Analyst Instructions / System Prompt</h2>
          </div>

          <div className="space-y-1.5">
            <div className="relative">
              <textarea
                rows={3}
                value={systemPrompt}
                onChange={(e) => onSystemPromptChange(e.target.value)}
                placeholder="Focus on technical accuracy. Flag any weak reasoning."
                className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 bg-slate-50/30 text-slate-800"
              />
              <Settings className="w-4 h-4 text-slate-400 absolute right-3 bottom-3 pointer-events-none" />
            </div>
            <p className="text-[11px] text-slate-400">
              Custom instructions will guide the AI when evaluating claim element mappings.
            </p>
          </div>
        </div>

        {/* Start Session Action */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onStartSession}
            disabled={!hasLoadedChart}
            className={`inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold rounded-lg transition-all ${
              hasLoadedChart
                ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-md cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Start session
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
