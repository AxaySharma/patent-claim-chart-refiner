export type ElementStatus = 'unreviewed' | 'accepted' | 'flagged';

export interface ClaimElement {
  id: string;
  patentClaimText: string;
  accusedFeatureText: string;
  evidenceSource: string;
  aiReasoning: string;
  status: ElementStatus;
}

export interface SuggestedChange {
  field: 'accusedFeatureText' | 'evidenceSource' | 'aiReasoning';
  newValue: string;
  status?: 'pending' | 'accepted' | 'rejected';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  relatedClaimElementId?: string;
  suggestedChange?: SuggestedChange;
  requiresUploadDoc?: boolean;
}

export interface ClaimChart {
  id: string;
  patentNumber: string;
  patentTitle: string;
  claimNumber: number;
  targetProduct: string;
  updatedAt: string;
  elements: ClaimElement[];
}
