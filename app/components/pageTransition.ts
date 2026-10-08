export const PAGE_AUDIO_FADE_OUT_MS = 140;
export const PAGE_AUDIO_FADE_IN_MS = 360;

/** Home uses Sewers; standalone pages use Casino. */
export function musicTrackForPath(pathname: string) {
  return pathname === "/" ? 0 : 1;
}
