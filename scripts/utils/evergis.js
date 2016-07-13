import { getEverGisToken } from '../adapter.js';

const ATTEMPTS_LIMIT = 10;
const FIFTY_SECONDS = 1000 * 50;

let EVERGIS_TOKEN = null;
let lastTokenUsedTime = null;
let loading = false;
let attempts = 0;
let refreshAttemptsTimeoutId = null;

function refreshAttempts() {
  attempts = 0;
}

// Получаем токен из evergis
export function fetchEvergisToken() {
  attempts += 1;
  if (refreshAttemptsTimeoutId !== null) {
    clearInterval(refreshAttemptsTimeoutId);
  }
  // Добавляем интервал, через который попытки получения токена обнулятся, на случай долгой сессии
  if (!attemptsLimitExceeded()) {
    refreshAttemptsTimeoutId = setTimeout(refreshAttempts, FIFTY_SECONDS);
  }
  loading = true;
  return getEverGisToken().then((token) => {
    loading = false;
    EVERGIS_TOKEN = token;
  });
}

export function isFetchingToken() {
  return loading;
}

export function getToken() {
  return EVERGIS_TOKEN;
}

export function attemptsLimitExceeded() {
  return attempts >= ATTEMPTS_LIMIT;
}

export default EVERGIS_TOKEN;
