/**
 * Evegis token service
 */

export function getEverGisToken(): Promise<string> {
  const tokenUrl = `https://gisoiv.mos.ru/IntegrationGIS/SpatialProcessor/Strategis.JsClient/ApiLogin.aspx?authId=505741D8-C667-440D-9CA0-32FD1FF6AF88&userName=jspublic&password=jspublic&ts=${new Date().getTime()}`;
  return fetch(tokenUrl).then(response => response.json()).then(data => encodeURIComponent(data.token));
}

const ATTEMPTS_LIMIT = 10;
const FIFTY_SECONDS = 1000 * 50;

export default class EverGisTokenService {
  private token: string = null;
  private loading: boolean = false;
  private attempts: number = 0;
  private refreshAttemptsTimeoutId: any = null;

  constructor() {
    this.fetchToken();
  }

  private refreshAttempts = (): void => {
    this.attempts = 0;
  }
  public attemptsLimitExceeded(): boolean {
    return this.attempts >= ATTEMPTS_LIMIT;
  }
  public isFetchingToken(): boolean {
    return this.loading;
  }
  public fetchToken(): Promise<void> {
    this.attempts += 1;
    if (this.refreshAttemptsTimeoutId !== null) {
      clearInterval(this.refreshAttemptsTimeoutId);
    }
    // Добавляем интервал, через который попытки получения токена обнулятся, на случай долгой сессии
    if (!this.attemptsLimitExceeded()) {
      this.refreshAttemptsTimeoutId = setTimeout(this.refreshAttempts, FIFTY_SECONDS);
    }

    this.loading = true;

    return getEverGisToken().then((_token: string) => {
      this.loading = false;
      this.token = _token;
    });
  }
  public getToken(): string {
    return this.token;
  }
}
