import React from 'react';
import { CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import type { ElementStatus } from '../types';

interface StatusBadgeProps {
  status: ElementStatus;
}

const statusConfig: Record<ElementStatus, { label: string; bg: string; text: string; border: string; icon: React.ElementType }> = {
  accepted: {
    label: 'Accepted',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: CheckCircle2,
  },
  flagged: {
    label: 'Flagged',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    icon: AlertTriangle,
  },
  unreviewed: {
    label: 'Unreviewed',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
    icon: Clock,
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status] || statusConfig.unreviewed;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};
