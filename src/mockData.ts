import type { ClaimChart, ChatMessage } from './types';

export const mockClaimChart: ClaimChart = {
  id: 'chart-acme-001',
  patentNumber: 'US 9,876,543 B2',
  patentTitle: 'Smart Environmental Control System and Method for Adaptive Thermal Management',
  claimNumber: 1,
  targetProduct: 'Acme Smart Thermostat v3.0',
  updatedAt: '2026-07-21',
  elements: [
    {
      id: 'elem-1',
      patentClaimText: 'A smart thermostat device comprising: a wireless communication module configured to connect to a local area network;',
      accusedFeatureText: 'Acme Smart Thermostat includes an integrated Wi-Fi (802.11 b/g/n) transceiver enabling direct connection to 2.4GHz home wireless routers.',
      evidenceSource: 'Acme Smart Thermostat Hardware Datasheet, Page 4, Section 3.2 ("Wireless Connectivity Specs")',
      aiReasoning: 'Direct alignment found. The patent element requires a wireless communication module for local area network connection, which directly reads on the device\'s 802.11 b/g/n Wi-Fi transceiver specs.',
      status: 'accepted',
    },
    {
      id: 'elem-2',
      patentClaimText: 'a motion sensor for detecting occupancy within a designated spatial region proximate to the device;',
      accusedFeatureText: 'Acme Smart Thermostat features a Passive Infrared (PIR) proximity sensor mounted on the front casing for room occupancy detection up to 5 meters.',
      evidenceSource: 'Acme User Manual v3.0, Page 12, "Occupancy & Near-Field Detection Features"',
      aiReasoning: 'High confidence match. The PIR sensor detects human movement within a 5m radius (spatial region proximate to the thermostat), fulfilling the occupancy detection element.',
      status: 'unreviewed',
    },
    {
      id: 'elem-3',
      patentClaimText: 'a processor configured to execute a machine learning algorithm that adjusts target temperature setpoints based on learned user occupancy patterns over time.',
      accusedFeatureText: 'Acme Thermostat firmware running EcoAdaptive AI software automatically learns occupant schedules using recurrent neural networks to optimize HVAC setpoints.',
      evidenceSource: 'Acme Technical Whitepaper: "EcoAdaptive ML Engine Architecture", Section 4.1',
      aiReasoning: 'Strong match with minor term variation. The firmware utilizes an RNN model ("EcoAdaptive AI") to predict occupancy and dynamically adjust setpoints, matching the claimed ML algorithm element.',
      status: 'flagged',
    },
  ],
};

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'ai',
    content: 'Hello! I have generated the initial claim chart mapping for Acme Smart Thermostat v3.0 against Claim 1 of US 9,876,543 B2. Let me know if you would like to refine any element mappings or evidence citations.',
    timestamp: '10:14 AM',
  },
  {
    id: 'msg-2',
    role: 'user',
    content: 'Can you double-check the evidence for element 1.c (ML algorithm)?',
    timestamp: '10:15 AM',
    relatedClaimElementId: 'elem-3',
  },
  {
    id: 'msg-3',
    role: 'ai',
    content: 'Element 3 references Acme Technical Whitepaper Section 4.1. While it confirms neural network-based schedule learning, we should confirm if the accused product uses localized on-device processing or cloud-based computation.',
    timestamp: '10:15 AM',
    relatedClaimElementId: 'elem-3',
  },
];
