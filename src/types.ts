export type ClaimStatus = 'verified' | 'needs_review' | 'refinement_suggested' | 'unmapped';

export interface Citation {
  id: string;
  sourceDocument: string;
  section: string;
  text: string;
  relevanceScore: number;
}

export interface ClaimElement {
  id: string;
  elementNumber: string;
  text: string;
  priorArtMapping: string;
  status: ClaimStatus;
  notes?: string;
  citations: Citation[];
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
