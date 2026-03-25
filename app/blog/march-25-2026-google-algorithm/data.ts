/* Chart data for TurboQuant / Google Algorithm article */

export const kvMemoryData = {
  labels: ['8K', '16K', '32K', '64K', '128K', '256K', '512K', '1M'],
  fullPrecision: [2.5, 5, 10, 20, 40, 80, 160, 320],
  turboQuant: [0.4, 0.8, 1.6, 3.2, 6.5, 13, 26, 52],
  h100Ceiling: [80, 80, 80, 80, 80, 80, 80, 80],
};

export const longBenchData = {
  labels: [
    'KIVI (3.0)',
    'TurboQuant (2.5)',
    'PolarQuant (3.9)',
    'Full Cache (16.0)',
    'TurboQuant (3.5)',
    'KIVI (5.0)',
  ],
  scores: [48.5, 49.74, 49.78, 50.06, 50.06, 50.16],
  colors: ['#b4b2a9', '#1a6b6b', '#b4b2a9', '#9a6f2e', '#1a6b6b', '#b4b2a9'],
  opacities: [0.7, 0.7, 0.7, 0.7, 0.95, 0.7],
};

export const speedupData = {
  labels: ['16K', '32K', '64K', '128K', '256K', '512K'],
  fourBit: [3.8, 5.0, 6.2, 7.1, 7.7, 8.0],
  twoBit: [2.2, 3.1, 4.0, 4.8, 5.3, 5.8],
};

export const costData = {
  labels: ['Without TurboQuant', 'With TurboQuant (3 bit)'],
  kvCacheCost: [1.58, 0.26],
  modelWeightsCost: [0.7, 0.7],
};

export const heroStats = [
  { label: 'Speed increase on H100 GPUs', value: '8x', sub: 'Attention computation', direction: 'up' as const },
  { label: 'Memory reduction in KV cache', value: '6x', sub: 'Same accuracy', direction: 'up' as const },
  { label: 'Compression ratio', value: '3 bits', sub: 'Down from 32 bits', direction: 'up' as const },
];

export const marketFactors = [
  { factor: 'Proprietary deployment head start', signal: 'bull' as const, horizon: '6 to 12 months' },
  { factor: 'Gemini inference cost improvement', signal: 'bull' as const, horizon: 'Next 1 to 2 earnings' },
  { factor: 'Google Cloud competitive positioning', signal: 'bull' as const, horizon: 'Medium term' },
  { factor: 'Algorithm is open source / replicable', signal: 'bear' as const, horizon: '6 to 18 months' },
  { factor: 'Not priced in by institutional analysts', signal: 'bull' as const, horizon: 'Catalyst dependent' },
  { factor: 'No explicit product announcement yet', signal: 'neutral' as const, horizon: 'Near term' },
];

export const glossary = [
  { term: 'KV Cache', def: 'Key value cache. The GPU memory store holding past context for active AI sessions. Grows linearly with conversation length.' },
  { term: 'Quantization', def: 'Reducing numerical precision to save memory. 32 bit to 4 bit cuts storage by 8x, traditionally with accuracy loss.' },
  { term: 'PolarQuant', def: 'TurboQuant first stage. Converts vector data to polar coordinates, removing the need to store compression metadata.' },
  { term: 'QJL', def: 'Quantized Johnson Lindenstrauss. Reduces residual error to 1 bit with zero bias using mathematical transforms.' },
  { term: 'Jevons Paradox', def: 'Efficiency gains tend to increase total resource consumption. Named after economist W.S. Jevons (1865).' },
  { term: 'Implied Volatility', def: 'The market expectation of future price movement, priced into options premiums. Higher IV means more expensive options.' },
];
