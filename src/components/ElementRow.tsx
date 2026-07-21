import React from 'react';
import type { ClaimElement, ElementStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { FileText, Edit3, Save, X, Bot, Check } from 'lucide-react';

interface ElementRowProps {
  element: ClaimElement;
  isActive: boolean;
  onSelect: () => void;
  onUpdateElement: (updated: ClaimElement) => void;
}

export const ElementRow: React.FC<ElementRowProps> = ({
  element,
  isActive,
  onSelect,
  onUpdateElement,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [accusedFeatureText, setAccusedFeatureText] = React.useState(element.accusedFeatureText);
  const [evidenceSource, setEvidenceSource] = React.useState(element.evidenceSource);
  const [aiReasoning, setAiReasoning] = React.useState(element.aiReasoning);
  const [status, setStatus] = React.useState<ElementStatus>(element.status);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateElement({
      ...element,
      accusedFeatureText,
      evidenceSource,
      aiReasoning,
      status,
    });
    setIsEditing(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAccusedFeatureText(element.accusedFeatureText);
    setEvidenceSource(element.evidenceSource);
    setAiReasoning(element.aiReasoning);
    setStatus(element.status);
    setIsEditing(false);
  };

  // Row status background colors: unreviewed (neutral), accepted (green tint), flagged (amber tint)
  const getStatusBg = () => {
    switch (element.status) {
      case 'accepted':
        return 'bg-emerald-50/40 hover:bg-emerald-50/70 border-emerald-100';
      case 'flagged':
        return 'bg-amber-50/40 hover:bg-amber-50/70 border-amber-100';
      case 'unreviewed':
      default:
        return 'bg-white hover:bg-slate-50 border-slate-200';
    }
  };

  return (
    <tr
      onClick={onSelect}
      className={`border-b transition-colors cursor-pointer ${getStatusBg()} ${
        isActive ? 'ring-2 ring-slate-900 ring-inset z-10' : ''
      }`}
    >
      {/* 1. Patent Claim Element */}
      <td className="py-4 px-4 align-top w-1/3">
        <div className="flex items-start gap-2">
          {isActive && <Check className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />}
          <p className="text-xs text-slate-800 leading-relaxed font-normal">
            {element.patentClaimText}
          </p>
        </div>
      </td>

      {/* 2. Accused Product Feature + Evidence */}
      <td className="py-4 px-4 align-top w-1/3">
        {isEditing ? (
          <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
            <textarea
              className="w-full text-xs border border-slate-300 rounded p-2 focus:ring-1 focus:ring-slate-400 focus:outline-none bg-white"
              rows={3}
              value={accusedFeatureText}
              onChange={(e) => setAccusedFeatureText(e.target.value)}
              placeholder="Accused product feature description..."
            />
            <input
              type="text"
              className="w-full text-xs border border-slate-300 rounded p-2 focus:ring-1 focus:ring-slate-400 focus:outline-none bg-white"
              value={evidenceSource}
              onChange={(e) => setEvidenceSource(e.target.value)}
              placeholder="Evidence source / citation..."
            />
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-900 leading-relaxed">
              {element.accusedFeatureText}
            </p>
            <div className="flex items-start gap-1.5 text-[11px] text-slate-500 bg-white/70 p-2 rounded border border-slate-200/60">
              <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>{element.evidenceSource}</span>
            </div>
          </div>
        )}
      </td>

      {/* 3. AI Reasoning & Status Actions */}
      <td className="py-4 px-4 align-top w-1/3">
        {isEditing ? (
          <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
            <textarea
              className="w-full text-xs border border-slate-300 rounded p-2 focus:ring-1 focus:ring-slate-400 focus:outline-none bg-white"
              rows={3}
              value={aiReasoning}
              onChange={(e) => setAiReasoning(e.target.value)}
              placeholder="AI reasoning..."
            />
            <select
              className="w-full text-xs border border-slate-300 rounded p-1.5 focus:ring-1 focus:ring-slate-400 focus:outline-none bg-white"
              value={status}
              onChange={(e) => setStatus(e.target.value as ElementStatus)}
            >
              <option value="unreviewed">Unreviewed</option>
              <option value="accepted">Accepted</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>
        ) : (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <StatusBadge status={element.status} />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded transition-colors"
                title="Edit Element"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-xs text-slate-700 bg-white/80 p-2.5 rounded border border-slate-200/80 flex items-start gap-2">
              <Bot className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">{element.aiReasoning}</p>
            </div>
          </div>
        )}

        {isEditing && (
          <div className="flex items-center justify-end gap-1 mt-2">
            <button
              onClick={handleSave}
              className="px-2 py-1 text-xs text-white bg-emerald-600 hover:bg-emerald-700 rounded flex items-center gap-1"
            >
              <Save className="w-3 h-3" /> Save
            </button>
            <button
              onClick={handleCancel}
              className="px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Cancel
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};
