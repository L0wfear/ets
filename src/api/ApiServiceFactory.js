import urljoin from 'url-join';
import APIService from './APIService.js';

export default class ApiServiceFactory {

  constructor(options) {
    this._apiUrl = options.apiUrl || null;
    if (typeof options.headers === 'function') {
      this._providedHeaders = options.headers();
    } else {
      this._providedHeaders = options.headers || null;
    }
  }

  setApiUrl(url) {
    if (typeof this._apiUrl === 'string') {
      throw new Error('You cannot change API url');
    }
    this._apiUrl = url;
  }

  createApiServiceAdapter = (path, options) =>
    new APIService(
      urljoin(this._apiUrl, path),
      {
        headers: this._providedHeaders,
        ...options,
      }
    );

}
