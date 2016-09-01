import APIService from './APIService.js';
import urljoin from 'url-join';

export default class ApiServiceFactory {

  constructor(options) {
    this._apiUrl = options.apiUrl || null;
  }

  setApiUrl(url) {
    if (typeof this._apiUrl === 'string') {
      throw new Error('You cannot change API url');
    }
    this._apiUrl = url;
  }

  createApiServiceAdapter = (path, options) => {
    return new APIService(
      urljoin(this._apiUrl, path),
      options
    );
  }

  // not implemented yet
  createRestApiServiceAdapter(path, options) {
    return new RESTApiService(path, options);
  }

}
