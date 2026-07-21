import React from 'react';
import type { ClaimElement, ClaimStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { FileText, Edit3, Save, X } from 'lucide-react';

interface ElementRowProps {
  element: ClaimElement;
  onUpdateElement: (updated: ClaimElement) => void;
}

export const ElementRow: React.FC<ElementRowProps> = ({ element, onUpdateElement }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [mapping, setMapping] = React.useState(element.priorArtMapping);
  const [notes, setNotes] = React.useState(element.notes || '');
  const [status, setStatus] = React.useState<ClaimStatus>(element.status);

  const handleSave = () => {
    onUpdateElement({
      ...element,
      priorArtMapping: mapping,
      notes: notes,
      status: status,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setMapping(element.priorArtMapping);
    setNotes(element.notes || '');
    setStatus(element.status);
    setIsEditing(false);
  };

  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50/50 transition-colors">
      <td className="py-4 px-4 align-top w-28">
        <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
          {element.elementNumber}
        </span>
      </td>

      <td className="py-4 px-4 align-top w-1/3">
        <p className="text-sm text-slate-800 leading-relaxed font-normal">
          {element.text}
        </p>
      </td>

      <td className="py-4 px-4 align-top w-1/3">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              className="w-full text-sm border border-slate-300 rounded p-2 focus:ring-1 focus:ring-slate-400 focus:outline-none bg-white"
              rows={3}
              value={mapping}
              onChange={(e) => setMapping(e.target.value)}
              placeholder="Enter target product or prior art mapping..."
            />
            <input
              type="text"
              className="w-full text-xs border border-slate-300 rounded p-2 focus:ring-1 focus:ring-slate-400 focus:outline-none bg-white"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Refinement notes..."
            />
          </div>
        ) : (
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-slate-900">
              {element.priorArtMapping || <span className="text-slate-400 italic">No mapping defined</span>}
            </p>
            {element.notes && (
              <p className="text-xs text-slate-500 bg-slate-100/80 p-2 rounded border border-slate-200/60">
                {element.notes}
              </p>
            )}
            {element.citations.length > 0 && (
              <div className="mt-2 space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Citations ({element.citations.length})
                </span>
                {element.citations.map((cit) => (
                  <div key={cit.id} className="text-xs text-slate-600 flex items-start gap-1.5 bg-slate-50 p-1.5 rounded border border-slate-200">
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-slate-700">{cit.sourceDocument}</span> ({cit.section})
                      <p className="text-slate-500 italic mt-0.5 text-[11px]">"{cit.text}"</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </td>

      <td className="py-4 px-4 align-top w-40">
        {isEditing ? (
          <select
            className="w-full text-xs border border-slate-300 rounded p-1.5 focus:ring-1 focus:ring-slate-400 focus:outline-none bg-white"
            value={status}
            onChange={(e) => setStatus(e.target.value as ClaimStatus)}
          >
            <option value="verified">Verified Match</option>
            <option value="needs_review">Needs Review</option>
            <option value="refinement_suggested">Refinement Suggested</option>
            <option value="unmapped">Unmapped</option>
          </select>
        ) : (
          <StatusBadge status={element.status} />
        )}
      </td>

      <td className="py-4 px-4 align-top text-right w-24">
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
            title="Edit Element Mapping"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}
      </td>
    </tr>
  );
};
