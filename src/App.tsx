import React from 'react';
import { mockClaimChart } from './mockData';
import type { ClaimChart, ClaimElement } from './types';
import { SetupScreen } from './components/SetupScreen';
import { ChartTable } from './components/ChartTable';
import { Shield, Search, SlidersHorizontal, Settings2, RotateCcw } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = React.useState<'setup' | 'session'>('setup');
  const [chart, setChart] = React.useState<ClaimChart | null>(null);
  const [docFilename, setDocFilename] = React.useState<string>('Acme_Thermostat_Manual_v3.pdf');
  const [systemPrompt, setSystemPrompt] = React.useState<string>(
    'Focus on technical accuracy. Flag any weak reasoning.'
  );

  const [filterStatus, setFilterStatus] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const handleLoadMockChart = () => {
    setChart(mockClaimChart);
  };

  const handleUpdateElement = (updatedElement: ClaimElement) => {
    if (!chart) return;
    setChart({
      ...chart,
      elements: chart.elements.map((el) =>
        el.id === updatedElement.id ? updatedElement : el
      ),
    });
  };

  const filteredElements = chart
    ? chart.elements.filter((el) => {
        const matchesStatus = filterStatus === 'all' || el.status === filterStatus;
        const matchesSearch =
          el.patentClaimText.toLowerCase().includes(searchQuery.toLowerCase()) ||
          el.accusedFeatureText.toLowerCase().includes(searchQuery.toLowerCase()) ||
          el.evidenceSource.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
      })
    : [];

  const acceptedCount = chart ? chart.elements.filter((e) => e.status === 'accepted').length : 0;
  const flaggedCount = chart ? chart.elements.filter((e) => e.status === 'flagged').length : 0;
  const unreviewedCount = chart ? chart.elements.filter((e) => e.status === 'unreviewed').length : 0;
  const totalCount = chart ? chart.elements.length : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 text-white rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-slate-900 leading-tight">
                Patent Claim Chart Refiner
              </h1>
              <p className="text-xs text-slate-500">
                {currentView === 'setup'
                  ? 'Session Configuration'
                  : `${chart?.targetProduct} Mapping Analysis`}
              </p>
            </div>
          </div>

          {currentView === 'session' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('setup')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                Change Setup
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content View Switch */}
      {currentView === 'setup' ? (
        <main className="flex-1 max-w-7xl w-full mx-auto">
          <SetupScreen
            hasLoadedChart={!!chart}
            onLoadMockChart={handleLoadMockChart}
            docFilename={docFilename}
            onDocFileChange={setDocFilename}
            systemPrompt={systemPrompt}
            onSystemPromptChange={setSystemPrompt}
            onStartSession={() => setCurrentView('session')}
          />
        </main>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Active Settings Banner */}
          <div className="bg-slate-100/80 border border-slate-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Settings2 className="w-4 h-4 text-slate-500 shrink-0" />
              <span>
                <strong>System Prompt:</strong> "{systemPrompt}"
              </span>
            </div>
            {docFilename && (
              <span className="text-slate-500">
                Doc attached: <strong>{docFilename}</strong>
              </span>
            )}
          </div>

          {/* Controls & Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500">Total Claim Elements</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500">Accepted Elements</span>
              <div className="text-2xl font-bold text-emerald-600 mt-1">{acceptedCount}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500">Flagged Elements</span>
              <div className="text-2xl font-bold text-rose-600 mt-1">{flaggedCount}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500">Unreviewed Elements</span>
              <div className="text-2xl font-bold text-slate-600 mt-1">{unreviewedCount}</div>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search claim text, evidence, or features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-400 bg-slate-50/50"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-medium text-slate-600">Filter Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white text-slate-700"
              >
                <option value="all">All Statuses</option>
                <option value="unreviewed">Unreviewed</option>
                <option value="accepted">Accepted</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>
          </div>

          {/* Claim Chart Component */}
          {chart && (
            <ChartTable
              chart={{
                ...chart,
                elements: filteredElements,
              }}
              onUpdateElement={handleUpdateElement}
            />
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400">
          Patent Claim Chart Refiner &copy; {new Date().getFullYear()} — Enterprise Legal Tech Tooling
        </div>
      </footer>
    </div>
  );
}

export default App;
