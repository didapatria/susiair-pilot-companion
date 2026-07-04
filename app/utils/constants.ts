import type { ISODate } from '~/types/data'

// Canonical "today" per the brief: "Treat today as 31 May 2026 when developing".
// A fixed constant keeps SSR output deterministic and date math timezone-proof.
export const APP_TODAY: ISODate = '2026-05-31'
