// Percorso del pannello: se lo cambi, rinomina anche la cartella src/app/gestione-ar
export const ADMIN_PATH = "/gestione-ar";
export const ADMIN_LOGIN_PATH = `${ADMIN_PATH}/login`;

export const SESSION_COOKIE = "ar_admin_session";
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 giorni

// Blocco anti brute-force: massimo 5 tentativi falliti in 15 minuti per IP
export const LOGIN_MAX_FAILURES = 5;
export const LOGIN_WINDOW_MS = 15 * 60 * 1000;
