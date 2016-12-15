import { getWarningNotification } from 'utils/notifications';
import RequestWarningError from 'utils/errors/RequestWarningError';
import urljoin from 'url-join';
import { getJSON, postJSON, deleteJSON, putJSON } from './adapter.js';
import { getBlob, postBlob } from './adapterBlob.js';
import { mocks } from './mocks';

export default class APIService {

  /**
   * Creates APIService handler for backend service via provided url
   * @param {string} url - url path
   * @param {object} options - options
   * @param {boolean} options.useMock - use mock instead of backend service
   */
  constructor(url, options = {}) {
    const { useMock = false } = options;
    this.serviceName = url.split('/').pop();
    this.useMock = useMock;

    this.url = url;
    this.canonicUrl = url;

    this.get = this.get.bind(this);
    this.processResponse = this.processResponse.bind(this);

    this.logFunction = method => console.info(`API SERVICE ${method} ${this.url}`);
    this.warningNotificationFunction = warning => global.NOTIFICATION_SYSTEM.notify(getWarningNotification(warning));
  }

  processResponse(r, callback) {
    if (r.warnings && r.warnings.length) {
      // Show warnings
      if (Array.isArray(r.warnings)) {
        r.warnings.forEach(w => {
          !w.hidden && this.warningNotificationFunction(w.message || w);
          throw new RequestWarningError(w);
        });
      } else if (r.warnings && r.warnings.message || typeof r.warnings === 'string') {
        !r.warnings.hidden && this.warningNotificationFunction(r.warnings.message || r.warnings);
        throw new RequestWarningError(r.warnings);
      }
    }
    if (typeof callback === 'function') {
      // If callback is specified, call it
      return callback();
    } else if (callback === false) {
      // If forced to prevent callback we return just response
      return r;
    }
    // By default response of any CRUD operation is response of GET request after that operation
    return this.get();
  }

  get(payload = {}) {
    if (this.useMock && mocks[this.serviceName]) {
      this.log('GET MOCK');
      return new Promise((res) => {
        setTimeout(() => {
          res(mocks[this.serviceName].get(payload));
        }, 500);
      });
    }
    this.log('GET');
    const url = this.url;
    this.resetPath();
    return getJSON(url, payload);
  }

  getBlob(payload = {}) {
    this.log('GET BLOB');
    const url = this.url;
    this.resetPath();
    return getBlob(url, payload);
  }

  postBlob(payload = {}) {
    this.log('GET (POST) BLOB');
    const url = this.url;
    this.resetPath();
    return postBlob(url, payload);
  }

  post(payload = {}, callback, type = 'form', params = {}) {
    this.log('POST');
    const url = this.url;
    this.resetPath();
    return postJSON(url, payload, type, params).then(r => this.processResponse(r, callback));
  }

  put(payload = {}, callback, type = 'form') {
    this.log('PUT');
    const url = this.url;
    this.resetPath();
    return putJSON(url, payload, type).then(r => this.processResponse(r, callback));
  }

  delete(payload = {}, callback, type = 'form') {
    this.log('DELETE');
    const url = this.url;
    this.resetPath();
    return deleteJSON(url, payload, type).then(r => this.processResponse(r, callback));
  }

  getUrl() {
    return this.url;
  }

  resetPath() {
    this.url = this.canonicUrl;
  }

  path(...args) {
    this.url = urljoin(this.canonicUrl, ...args);
    return this;
  }

  log(method) {
    this.logFunction(method);
  }

  connectToLoggerService(fn) {
    if (typeof fn === 'function') {
      this.logFunction = fn;
    }
  }

  connectToNotificationService(fn) {
    if (typeof fn === 'function') {
      this.warningNotificationFunction = fn;
    }
  }

}
