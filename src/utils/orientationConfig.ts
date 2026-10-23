// UPSC Prelims 2027 Orientation Event Configuration & Expiration Logic

// Official Orientation Event Date: October 15, 2026
// Expiration happens at the end of the event day (23:59:59 IST)
export const ORIENTATION_EVENT_DATE = new Date('2026-10-15T23:59:59+05:30');

/**
 * Checks whether the Prelims Orientation event has expired.
 * Also supports URL query parameters for instant testing:
 *  - ?force_orientation_active=true  => force active state
 *  - ?force_orientation_expired=true => force expired state
 */
export function isOrientationExpired(): boolean {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('force_orientation_active') === 'true') return false;
    if (params.get('force_orientation_expired') === 'true') return true;
  }
  return new Date().getTime() > ORIENTATION_EVENT_DATE.getTime();
}

export const ORIENTATION_EVENT_DETAILS = {
  title: "UPSC Prelims 2027: Conquer Orientation",
  subTitle: "One Orientation. One Strategy. Complete 7-Dimension Roadmap.",
  speaker: "Sudhagaran Sir & D'code Team",
  dateFormatted: "October 15, 2026",
  venue: "Periyar Hall, Chennai",
  route: "/prelims-orientation-2027",
  contactPhone: "+91 96000 60393"
};
