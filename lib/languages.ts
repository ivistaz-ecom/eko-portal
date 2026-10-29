// Same list and native names as the approved design. `live` = interface text ready.
export const LANGUAGES = [
  { id: 'en', name: 'English', english: 'English', live: true },
  { id: 'hi', name: 'हिन्दी', english: 'Hindi', live: true },
  { id: 'kn', name: 'ಕನ್ನಡ', english: 'Kannada', live: false },
  { id: 'ta', name: 'தமிழ்', english: 'Tamil', live: false },
  { id: 'ml', name: 'മലയാളം', english: 'Malayalam', live: false },
  { id: 'te', name: 'తెలుగు', english: 'Telugu', live: false },
  { id: 'mr', name: 'मराठी', english: 'Marathi', live: false },
] as const;

export function languageName(id: string | null | undefined) {
  return LANGUAGES.find((l) => l.id === id)?.english ?? '—';
}
