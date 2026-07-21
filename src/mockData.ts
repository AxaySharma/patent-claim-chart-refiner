import type { ClaimChart } from './types';

export const mockClaimChart: ClaimChart = {
  id: 'chart-101',
  patentNumber: 'US 10,984,321 B2',
  patentTitle: 'Method and System for Automated Vector Index Optimization in Neural Networks',
  claimNumber: 1,
  targetProduct: 'ApexSearch Cloud Vector Engine v4.2',
  updatedAt: '2026-07-21',
  elements: [
    {
      id: 'elem-1',
      elementNumber: '1.preamble',
      text: 'A computer-implemented method for dynamic index partitioning in a high-dimensional vector space, comprising:',
      priorArtMapping: 'ApexSearch Architecture Spec v4, Section 2.1 ("Distributed Indexing Core")',
      status: 'verified',
      notes: 'Direct match found in technical specification documentation.',
      citations: [
        {
          id: 'cit-101',
          sourceDocument: 'ApexSearch Technical Architecture Doc.pdf',
          section: 'Section 2.1 - Overview of Sharding',
          text: 'The Distributed Indexing Core dynamically partitions incoming vector embeddings across available node clusters based on nearest-neighbor centroid heuristics.',
          relevanceScore: 0.95,
        },
      ],
    },
    {
      id: 'elem-2',
      elementNumber: '1.a',
      text: 'receiving a plurality of feature vectors representing data objects from a client computing device;',
      priorArtMapping: 'API Endpoint POST /v1/vectors/ingest',
      status: 'verified',
      notes: 'API payload schemas match vector ingress requirements.',
      citations: [
        {
          id: 'cit-102',
          sourceDocument: 'ApexSearch API Reference v4.2',
          section: 'Endpoints -> Vector Ingestion',
          text: 'POST /v1/vectors/ingest accepts JSON payload containing array of float32 feature vectors up to 1536 dimensions.',
          relevanceScore: 0.98,
        },
      ],
    },
    {
      id: 'elem-3',
      elementNumber: '1.b',
      text: 'calculating, by one or more processors, a distance matrix between the plurality of feature vectors and a set of predefined cluster centroids;',
      priorArtMapping: 'Centroid Matcher Module (src/engine/centroid_evaluator.cpp)',
      status: 'refinement_suggested',
      notes: 'Claim specifies calculating full distance matrix; implementation uses approximate dot-product pruning.',
      citations: [
        {
          id: 'cit-103',
          sourceDocument: 'Source Code Repository (apex-core)',
          section: 'centroid_evaluator.cpp:L84-L112',
          text: 'void evaluate_centroids() uses SIMD-accelerated cosine distance approximation to filter top-k centroids.',
          relevanceScore: 0.82,
        },
      ],
    },
    {
      id: 'elem-4',
      elementNumber: '1.c',
      text: 're-assigning at least one vector partition to a secondary storage buffer upon determining that a threshold latency has been exceeded.',
      priorArtMapping: 'Buffer Eviction Manager',
      status: 'needs_review',
      notes: 'Requires confirmation whether threshold latency is based on queue length or elapsed CPU clock time.',
      citations: [
        {
          id: 'cit-104',
          sourceDocument: 'System Operation Manual',
          section: 'Section 5.4 - Overflow Handling',
          text: 'When queue wait time exceeds max_latency_ms (default 50ms), incoming partitions are routed to flash storage tier.',
          relevanceScore: 0.76,
        },
      ],
    },
  ],
};
