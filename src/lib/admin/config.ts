// Percorso del pannello: se lo cambi, rinomina anche la cartella src/app/gestione-ar
export const ADMIN_PATH = "/gestione-ar";
export const ADMIN_LOGIN_PATH = `${ADMIN_PATH}/login`;

export const SESSION_COOKIE = "ar_admin_session";
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 giorni

// Blocco anti brute-force: massimo 5 tentativi falliti in 15 minuti per IP
export const LOGIN_MAX_FAILURES = 5;
export const LOGIN_WINDOW_MS = 15 * 60 * 1000;

// Freno globale: se da TUTTI gli IP insieme arrivano più di 30 tentativi falliti
// in 15 minuti, il login si blocca per tutti. Serve se qualcuno falsifica l'IP
// (header X-Forwarded-For) per aggirare il limite per singolo IP.
export const LOGIN_MAX_GLOBAL_FAILURES = 30;

// Pulizia automatica dei dati vecchi (minimizzazione GDPR)
export const LOGIN_ATTEMPTS_RETENTION_MS = 30 * 24 * 60 * 60 * 1000; // 30 giorni
export const MESSAGES_RETENTION_MS = 365 * 24 * 60 * 60 * 1000; // 12 mesi
