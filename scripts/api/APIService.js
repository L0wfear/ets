import { getUrl, getJSON, postJSON, deleteJSON, putJSON } from '../adapter.js';
import { getWarningNotification } from 'utils/notifications';
import { RequestWarningError } from 'utils/errors';
import { mocks } from './mocks';

export default class APIService {

  /**
   * Creates APIService handler for backend service via provided url
   * @param {string} url - url path
   * @param {object} options - options
   * @param {boolean} options.useMock - use mock instead of backend service
   * @param {boolean} options.customPaths - allow to provide additional part of url path
   * @param {array} options.customPathsList - available paths for customPaths
   */
  constructor(url, options = {}) {
    const { useMock = false } = options;
    this.firstUrl = url;
    this.canonicFirstUrl = url;
    this.serviceName = url.replace(/\//g, '');
    this.useMock = useMock;
    const canonicUrl = url.indexOf('http') > -1 ? url : getUrl(url);
    this.url = canonicUrl;
    this.canonicUrl = canonicUrl;
    this.get = this.get.bind(this);
    this.processResponse = this.processResponse.bind(this);

    this.logFunction = (method) => console.info(`API SERVICE ${method} ${this.firstUrl}`);
    this.warningNotificationFunction = (warning) => global.NOTIFICATION_SYSTEM._addNotification(getWarningNotification(warning));
  }

  processResponse(r, callback) {
    if (r.warnings && r.warnings.length) {
      // Show warnings
      r.warnings.map(w => this.warningNotificationFunction(w));
      throw new Error('Request warnings is not empty!');
    }
    if (typeof callback === 'function') {
      // If callback is specified, call it
      return callback();
    } else if (callback === false) {
      // If forced to prevent callback we return just response
      return r;
    } else {
      // By default response of any CRUD operation is response of GET request after that operation
      return this.get();
    }
  }

  get(payload = {}, blob = false, restId) {
    if (this.useMock && mocks[this.serviceName]) {
      this.log('GET MOCK');
      return new Promise((res, rej) => {
        setTimeout(() => {
          res(mocks[this.serviceName].get(payload));
        }, 500);
      });
    }
    this.log('GET');
    const url = restId ? this.url + restId : this.url;
    this.resetPath();
    return getJSON(url, payload, blob);
  }

  post(payload = {}, callback, type = 'form', blob = false) {
    this.log('POST');
    const url = this.url;
    this.resetPath();
    return postJSON(url, payload, type, blob).then((r) => this.processResponse(r, callback));
  }

  put(payload = {}, callback, type = 'form') {
    this.log('PUT');
    const url = this.url;
    this.resetPath();
    return putJSON(url, payload, type).then((r) => this.processResponse(r, callback));
  }

  delete(payload = {}, callback, type = 'form') {
    this.log('DELETE');
    const url = this.url;
    this.resetPath();
    return deleteJSON(url, payload, type).then((r) => this.processResponse(r, callback));
  }

  getUrl() {
    return this.url;
  }

  resetPath() {
    this.url = this.canonicUrl;
    this.firstUrl = this.canonicFirstUrl;
  }

  path(path) {
    // TODO переделать нормально
    this.url = this.canonicUrl;
    this.firstUrl = this.canonicFirstUrl;
    this.url += path;
    this.firstUrl += path;
    return this;
  }

  log(method) {
    this.logFunction(method);
  }

  connectToLoggerService(fn) {
    if (typeof fn === 'function') {
      this.warningNotificationFunction = fn;
    }
  }

  connectToNotificationService(fn) {
    if (typeof fn === 'function') {
      this.warningNotificationFunction = fn;
    }
  }

}
