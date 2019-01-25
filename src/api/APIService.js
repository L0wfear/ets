import { getInfoNotification, getWarningNotification, getErrorNotificationFromBack as getErrorNotification } from 'utils/notifications';
import RequestWarningError from 'utils/errors/RequestWarningError';
import Raven from 'raven-js';
import urljoin from 'url-join';
import config from 'config';
import { get } from 'lodash';
import {
  getJSON, postJSON, deleteJSON, putJSON, patchJSON,
} from './adapter';
import { getBlob, postBlob } from './adapterBlob';
import { mocks } from './mocks';

export default class APIService {
  /**
   * Creates APIService handler for backend service via provided url
   * @param {string} url - url path
   * @param {object} options - options
   * @param {boolean} options.useMock - use mock instead of backend service
   */
  constructor(_apiUrl, path, options = {}) {
    const { useMock = false } = options;
    this.useMock = useMock;

    this._apiUrl = _apiUrl;
    this._path = path;

    const url = this.getUrlData();

    this.serviceName = urljoin(this._apiUrl, this._path).split('/').pop();

    this.url = url;
    this.addPath = [];

    this.get = this.get.bind(this);
    this.processResponse = this.processResponse.bind(this);

    this.logFunction = method => console.info(`API SERVICE ${method} ${this.getUrl()}`); // eslint-disable-line
    this.warningNotificationFunction = warning => global.NOTIFICATION_SYSTEM.notify(getWarningNotification(warning));
    this.errrorNotificationFunction = errror => global.NOTIFICATION_SYSTEM.notify(getErrorNotification(errror));

    this.infoNotificationFunction = info => global.NOTIFICATION_SYSTEM.notify(getInfoNotification(info));
  }

  getUrlData() {
    const apiVersions = localStorage.getItem(global.API__KEY2) || '{}';

    const version = get(JSON.parse(apiVersions), this._apiUrl, '');

    switch (this._apiUrl) {
      case config.tracksCaching:
        return urljoin(this._apiUrl, this._path);
      default:
        return version
          ? urljoin(this._apiUrl, `/v${version}`, this._path)
          : urljoin(this._apiUrl, this._path);
    }
  }

  processResponse(r, callback) {
    if (r.warnings && r.warnings.length) {
      // Show warnings
      if (Array.isArray(r.warnings)) {
        let errorThrow = {};

        r.warnings.forEach((w) => {
          const errorIsShow = !w.hidden;

          !w.hidden && this.warningNotificationFunction(w.message || w);

          errorThrow = {
            error: r,
            error_text: new RequestWarningError(w),
            errorIsShow,
          };
        });
        throw errorThrow;
      } else if ((r.warnings && r.warnings.message) || typeof r.warnings === 'string') {
        const errorIsShow = !r.warnings.hidden;

        !r.warnings.hidden && this.warningNotificationFunction(r.warnings.message || r.warnings);

        const errorThrow = {
          error: r,
          error_text: new RequestWarningError(r.warnings),
          errorIsShow,
        };
        throw errorThrow;
      }
    }
    if (r.info && r.info.length) {
      // Show warnings
      if (Array.isArray(r.info)) {
        r.info.forEach((i) => {
          !i.hidden && this.infoNotificationFunction(i.message || i);
        });
      } else if ((r.info && r.info.message) || typeof r.info === 'string') {
        !r.info.hidden && this.infoNotificationFunction(r.info.message || r.info);
      }
    }
    if (r.errors && r.errors.length) {
      // Show errors
      if (Array.isArray(r.errors)) {
        let errorThrow = {};
        r.errors.forEach((w) => {
          const errorIsShow = !w.hidden;
          !w.hidden && this.errrorNotificationFunction(w.message || w);

          errorThrow = {
            error: r,
            error_text: new RequestWarningError(w),
            errorIsShow,
          };
        });
        throw errorThrow;
      } else if ((r.errors && r.errors.message) || typeof r.errors === 'string') {
        const errorIsShow = !r.errors.hidden;

        !r.errors.hidden && this.errrorNotificationFunction(r.errors.message || r.errors);

        const errorThrow = {
          error: r,
          error_text: new RequestWarningError(r.errors),
          errorIsShow,
        };
        throw errorThrow;
      }
    }
    if (typeof callback === 'function') {
      // If callback is specified, call it
      return callback();
    } if (callback === false) {
      // If forced to prevent callback we return just response
      return r;
    }
    // By default response of any CRUD operation is response of GET request after that operation
    return this.get();
  }

  get(payload = {}) {
    if (this.useMock && mocks[this.serviceName]) {
      this.log('GET MOCK');
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mocks[this.serviceName].get(payload));
        }, 500);
      });
    }
    this.log('GET');

    const url = this.getUrl();
    this.resetPath();

    return getJSON(url, payload).then(r => this.processResponse(r, false));
  }

  getBlob(payload = {}) {
    this.log('GET BLOB');
    const url = this.getUrl();
    this.resetPath();
    return getBlob(url, payload).then(r => this.processResponse(r, false));
  }

  postBlob(payload = {}) {
    this.log('GET (POST) BLOB');
    const url = this.getUrl();
    this.resetPath();
    return postBlob(url, payload).then(r => this.processResponse(r, false));
  }

  post(payload = {}, callback, type = 'form', params = {}) {
    this.log('POST');
    const url = this.getUrl();
    this.resetPath();
    return postJSON(url, payload, type, params).then(r => this.processResponse(r, callback));
  }

  put(payload = {}, callback, type = 'form') {
    this.log('PUT');
    const url = this.getUrl();
    this.resetPath();
    return putJSON(url, payload, type).then(r => this.processResponse(r, callback));
  }

  patch(payload = {}, callback, type = 'form') {
    this.log('PATCH');
    const url = this.getUrl();
    this.resetPath();
    return patchJSON(url, payload, type).then(r => this.processResponse(r, callback));
  }

  delete(payload = {}, callback, type = 'form') {
    this.log('DELETE');
    const url = this.getUrl();
    this.resetPath();
    return deleteJSON(url, payload, type).then(r => this.processResponse(r, callback));
  }

  getUrl() {
    return urljoin(
      this.getUrlData(),
      ...this.addPath.map(b => String(b)),
    );
  }

  resetPath() {
    this.url = this.getUrlData();
    this.addPath = [];
  }

  path(...args) {
    this.addPath = [...this.addPath, ...args];
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
