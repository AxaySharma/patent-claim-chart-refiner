import React from 'react';
import type { ClaimElement, ElementStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { FileText, Edit3, Save, X, Bot } from 'lucide-react';

interface ElementRowProps {
  element: ClaimElement;
  onUpdateElement: (updated: ClaimElement) => void;
}

export const ElementRow: React.FC<ElementRowProps> = ({ element, onUpdateElement }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [accusedFeatureText, setAccusedFeatureText] = React.useState(element.accusedFeatureText);
  const [evidenceSource, setEvidenceSource] = React.useState(element.evidenceSource);
  const [aiReasoning, setAiReasoning] = React.useState(element.aiReasoning);
  const [status, setStatus] = React.useState<ElementStatus>(element.status);

  const handleSave = () => {
    onUpdateElement({
      ...element,
      accusedFeatureText,
      evidenceSource,
      aiReasoning,
      status,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setAccusedFeatureText(element.accusedFeatureText);
    setEvidenceSource(element.evidenceSource);
    setAiReasoning(element.aiReasoning);
    setStatus(element.status);
    setIsEditing(false);
  };

  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50/50 transition-colors">
      <td className="py-4 px-4 align-top w-1/3">
        <p className="text-sm text-slate-800 leading-relaxed font-normal">
          {element.patentClaimText}
        </p>
      </td>

      <td className="py-4 px-4 align-top w-1/3">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              className="w-full text-sm border border-slate-300 rounded p-2 focus:ring-1 focus:ring-slate-400 focus:outline-none bg-white"
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
            <p className="text-sm font-medium text-slate-900 leading-relaxed">
              {element.accusedFeatureText}
            </p>
            <div className="flex items-start gap-1.5 text-xs text-slate-500 bg-slate-100/80 p-2 rounded border border-slate-200/60">
              <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>{element.evidenceSource}</span>
            </div>
          </div>
        )}
      </td>

      <td className="py-4 px-4 align-top w-1/3">
        {isEditing ? (
          <textarea
            className="w-full text-xs border border-slate-300 rounded p-2 focus:ring-1 focus:ring-slate-400 focus:outline-none bg-white"
            rows={4}
            value={aiReasoning}
            onChange={(e) => setAiReasoning(e.target.value)}
            placeholder="AI reasoning..."
          />
        ) : (
          <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200/80 flex items-start gap-2">
            <Bot className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{element.aiReasoning}</p>
          </div>
        )}
      </td>

      <td className="py-4 px-4 align-top w-36">
        {isEditing ? (
          <select
            className="w-full text-xs border border-slate-300 rounded p-1.5 focus:ring-1 focus:ring-slate-400 focus:outline-none bg-white"
            value={status}
            onChange={(e) => setStatus(e.target.value as ElementStatus)}
          >
            <option value="unreviewed">Unreviewed</option>
            <option value="accepted">Accepted</option>
            <option value="flagged">Flagged</option>
          </select>
        ) : (
          <StatusBadge status={element.status} />
        )}
      </td>

      <td className="py-4 px-4 align-top text-right w-20">
        {isEditing ? (
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={handleSave}
              className="p-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded"
              title="Save"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
            title="Edit Mapping & Reasoning"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}
      </td>
    </tr>
  );
};
