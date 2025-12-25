import type { StateParameters } from './types';

const BASELINE: StateParameters = {
  temperature: 0.7,
  top_p: 1.0,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
};

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function scaleIntensity(
  profileParams: StateParameters,
  intensity: number
): StateParameters {
  return {
    temperature: lerp(BASELINE.temperature, profileParams.temperature, intensity),
    top_p: lerp(
      BASELINE.top_p!,
      profileParams.top_p ?? BASELINE.top_p!,
      intensity
    ),
    frequency_penalty: lerp(
      BASELINE.frequency_penalty!,
      profileParams.frequency_penalty ?? BASELINE.frequency_penalty!,
      intensity
    ),
    presence_penalty: lerp(
      BASELINE.presence_penalty!,
      profileParams.presence_penalty ?? BASELINE.presence_penalty!,
      intensity
    ),
    max_tokens: profileParams.max_tokens,
  };
}

export function getScaledParameters(
  profileParams: StateParameters,
  intensity: number
): StateParameters {
  const scaled = scaleIntensity(profileParams, intensity);
  return {
    temperature: Math.round(scaled.temperature * 100) / 100,
    top_p: scaled.top_p ? Math.round(scaled.top_p * 100) / 100 : undefined,
    frequency_penalty: scaled.frequency_penalty
      ? Math.round(scaled.frequency_penalty * 100) / 100
      : undefined,
    presence_penalty: scaled.presence_penalty
      ? Math.round(scaled.presence_penalty * 100) / 100
      : undefined,
    max_tokens: scaled.max_tokens,
  };
}
