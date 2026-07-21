import React from 'react';
import { ShieldCheck, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';
import type { ClaimStatus } from '../types';

interface StatusBadgeProps {
  status: ClaimStatus;
  onChange?: (newStatus: ClaimStatus) => void;
}

const statusConfig: Record<ClaimStatus, { label: string; bg: string; text: string; border: string; icon: React.ElementType }> = {
  verified: {
    label: 'Verified Match',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: ShieldCheck,
  },
  needs_review: {
    label: 'Needs Review',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: AlertCircle,
  },
  refinement_suggested: {
    label: 'Refinement Suggested',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: Sparkles,
  },
  unmapped: {
    label: 'Unmapped',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
    icon: HelpCircle,
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};
