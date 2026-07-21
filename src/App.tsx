import React from 'react';
import { mockClaimChart, mockChatMessages } from './mockData';
import type { ClaimChart, ClaimElement, ChatMessage } from './types';
import { SetupScreen } from './components/SetupScreen';
import { ChartTable } from './components/ChartTable';
import { ChatPanel } from './components/ChatPanel';
import { Shield, Search, SlidersHorizontal, Settings2, RotateCcw } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = React.useState<'setup' | 'session'>('setup');
  const [chart, setChart] = React.useState<ClaimChart | null>(null);
  const [docFilename, setDocFilename] = React.useState<string>('Acme_Thermostat_Manual_v3.pdf');
  const [systemPrompt, setSystemPrompt] = React.useState<string>(
    'Focus on technical accuracy. Flag any weak reasoning.'
  );

  const [activeElement, setActiveElement] = React.useState<ClaimElement | null>(null);
  const [messages, setMessages] = React.useState<ChatMessage[]>(mockChatMessages);
  const [filterStatus, setFilterStatus] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const handleLoadMockChart = () => {
    setChart(mockClaimChart);
    if (mockClaimChart.elements.length > 0) {
      setActiveElement(mockClaimChart.elements[0]);
    }
  };

  const handleUpdateElement = (updatedElement: ClaimElement) => {
    if (!chart) return;
    setChart({
      ...chart,
      elements: chart.elements.map((el) =>
        el.id === updatedElement.id ? updatedElement : el
      ),
    });
    if (activeElement?.id === updatedElement.id) {
      setActiveElement(updatedElement);
    }
  };

  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      relatedClaimElementId: activeElement?.id,
    };

    setMessages((prev) => [...prev, userMsg]);

    // Simulate AI response
    setTimeout(() => {
      let aiText = `I have analyzed your feedback: "${text}".`;
      if (activeElement) {
        aiText += ` Target element #${activeElement.id.replace('elem-', '')} mapping updated to align with the system prompt rules.`;
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'ai',
        content: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        relatedClaimElementId: activeElement?.id,
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
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
                  : `${chart?.targetProduct} Mapping Analysis`}
              </p>
            </div>
          </div>

          {currentView === 'session' && (
            <div className="flex items-center gap-3">
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
                onClick={() => setCurrentView('setup')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                Setup
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
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
            {/* Left Panel: 60% width (7 cols of 12) */}
            <div className="lg:col-span-7 h-full">
              {chart && (
                <ChartTable
                  chart={{
                    ...chart,
                    elements: filteredElements,
                  }}
                  activeElementId={activeElement?.id || null}
                  onSelectElement={(el) => setActiveElement(el)}
                  onUpdateElement={handleUpdateElement}
                />
              )}
            </div>

            {/* Right Panel: 40% width (5 cols of 12) */}
            <div className="lg:col-span-5 h-full">
              <ChatPanel
                messages={messages}
                activeElement={activeElement}
                onSendMessage={handleSendMessage}
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
