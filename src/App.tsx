import React from 'react';
import { mockClaimChart, mockChatMessages } from './mockData';
import { useRefinement } from './hooks/useRefinement';
import { SetupScreen } from './components/SetupScreen';
import { ChartTable } from './components/ChartTable';
import { ChatPanel } from './components/ChatPanel';
import { Shield, Search, SlidersHorizontal, Settings2, RotateCcw, CheckCircle, FileDown } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = React.useState<'setup' | 'session'>('setup');
  const [docFilename, setDocFilename] = React.useState<string>('Acme_Thermostat_Manual_v3.pdf');
  const [systemPrompt, setSystemPrompt] = React.useState<string>(
    'Focus on technical accuracy. Flag any weak reasoning.'
  );
  
  // Toast state for simulated export
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const [filterStatus, setFilterStatus] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const {
    chart,
    messages,
    activeElementId,
    activeElement,
    flashElementId,
    setActiveElementId,
    handleSendMessage,
    handleAcceptSuggestion,
    handleRejectSuggestion,
    updateElementDirectly,
  } = useRefinement(mockClaimChart, mockChatMessages);

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleExportWord = () => {
    triggerToast("Claim chart exported (simulated for prototype)");
  };

  const filteredElements = chart.elements.filter((el) => {
    const matchesStatus = filterStatus === 'all' || el.status === filterStatus;
    const matchesSearch =
      el.patentClaimText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.accusedFeatureText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.evidenceSource.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const acceptedCount = chart.elements.filter((e) => e.status === 'accepted').length;
  const flaggedCount = chart.elements.filter((e) => e.status === 'flagged').length;
  const unreviewedCount = chart.elements.filter((e) => e.status === 'unreviewed').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-slate-900 text-white rounded-lg">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-900 leading-tight">
                Patent Claim Chart Refiner
              </h1>
              <p className="text-[11px] text-slate-500">
                {currentView === 'setup'
                  ? 'Session Configuration'
                  : 'Claim Chart Refinement — US 9,876,543 B2 vs Acme Thermostat'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentView === 'session' ? (
              <>
                <div className="hidden md:flex items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                    {acceptedCount} Accepted
                  </span>
                  <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
                    {flaggedCount} Flagged
                  </span>
                  <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium">
                    {unreviewedCount} Unreviewed
                  </span>
                </div>
                <button
                  onClick={handleExportWord}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors shadow-xs"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  Export to Word
                </button>
                <button
                  onClick={() => setCurrentView('setup')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  Setup
                </button>
              </>
            ) : null}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      {currentView === 'setup' ? (
        <main className="flex-1 max-w-7xl w-full mx-auto">
          <SetupScreen
            hasLoadedChart={true}
            onLoadMockChart={() => {}}
            docFilename={docFilename}
            onDocFileChange={setDocFilename}
            systemPrompt={systemPrompt}
            onSystemPromptChange={setSystemPrompt}
            onStartSession={() => setCurrentView('session')}
          />
        </main>
      ) : (
        <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4">
          {/* Active Settings Banner */}
          <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Settings2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>
                <strong>System Prompt:</strong> "{systemPrompt}"
              </span>
            </div>
            <div className="flex items-center gap-3">
              {docFilename && (
                <span className="text-slate-500 text-[11px]">
                  Attached Doc: <strong className="text-slate-700">{docFilename}</strong>
                </span>
              )}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search claim text or evidence..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-400 bg-slate-50/50"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-medium text-slate-600">Filter:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white text-slate-700"
              >
                <option value="all">All Statuses</option>
                <option value="unreviewed">Unreviewed</option>
                <option value="accepted">Accepted</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>
          </div>

          {/* Two-Panel Responsive Split Layout (60% / 40%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start">
            {/* Left Panel: 60% width */}
            <div className="lg:col-span-7 h-full">
              <ChartTable
                chart={{
                  ...chart,
                  elements: filteredElements,
                }}
                activeElementId={activeElementId}
                flashElementId={flashElementId}
                onSelectElement={(el) => setActiveElementId(el.id)}
                onUpdateElement={updateElementDirectly}
                onExportWord={handleExportWord}
              />
            </div>

            {/* Right Panel: 40% width */}
            <div className="lg:col-span-5 h-full">
              <ChatPanel
                messages={messages}
                activeElement={activeElement}
                onSendMessage={handleSendMessage}
                onAcceptSuggestion={handleAcceptSuggestion}
                onRejectSuggestion={handleRejectSuggestion}
                onUploadDocClick={() => setCurrentView('setup')}
              />
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 mt-auto">
        <div className="max-w-[1600px] mx-auto px-4 text-center text-xs text-slate-400">
          Patent Claim Chart Refiner &copy; {new Date().getFullYear()} — Enterprise Legal Tech Tooling
        </div>
      </footer>
    </div>
  );
}

export default App;
