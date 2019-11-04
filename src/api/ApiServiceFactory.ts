import APIService from './APIService';

export default class ApiServiceFactory {
  _apiUrl: string;
  _providedHeaders: any;
  otherToken: boolean;

  constructor(options) {
    this._apiUrl = options.apiUrl || null;
    if (typeof options.headers === 'function') {
      this._providedHeaders = options.headers();
    } else {
      this._providedHeaders = options.headers || null;
    }

    this.otherToken = Boolean(options.otherToken);
  }

  createApiServiceAdapter = (path: string, options?: Record<string, any>) =>
    new APIService(this._apiUrl, path, {
      headers: this._providedHeaders,
      otherToken: Boolean(this.otherToken),
      ...options,
    });
}
