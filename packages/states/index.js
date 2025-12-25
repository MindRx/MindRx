/**
 * @mindrx/states
 *
 * Canonical cognitive state profiles for MindRx.
 * Each profile defines parameters and behavior for a simulated mental state.
 */

export const STATES = [
  'sober',
  'cannabis',
  'ketamine',
  'cocaine',
  'ayahuasca',
  'mdma',
  'alcohol',
  'lsd',
  'caffeine',
];

export const BEHAVIORS = {
  association: ['tight', 'normal', 'loose', 'fragmented'],
  coherence: ['strict', 'normal', 'drifting', 'dissolving'],
  pacing: ['slow', 'normal', 'fast', 'erratic'],
  confidence: ['low', 'normal', 'high', 'inflated'],
};

export default STATES;
