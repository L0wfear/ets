import {
  getInfoNotification,
  getWarningNotification,
  getErrorNotificationFromBack as getErrorNotification,
} from 'utils/notifications';
import RequestWarningError from 'utils/errors/RequestWarningError';
import urljoin from 'url-join';
import config from 'config';
import { get } from 'lodash';
import { getJSON, postJSON, deleteJSON, putJSON, patchJSON } from './adapter';
import { getBlob, postBlob } from './adapterBlob';
import { isFunction } from 'util';

export const processResponse = (r) => {
  if (r) {
    if (r.warnings && r.warnings.length) {
      // Show warnings
      if (Array.isArray(r.warnings)) {
        let errorThrow = {};

        r.warnings.forEach((w) => {
          const errorIsShow = !w.hidden;

          if (!r.hidden) {
            global.NOTIFICATION_SYSTEM.notify(
              getWarningNotification(w.message || w),
            );
          }

          errorThrow = {
            error: r,
            error_text: new RequestWarningError(w),
            errorIsShow,
          };
        });
        throw errorThrow;
      } else if (
        (r.warnings && r.warnings.message)
        || typeof r.warnings === 'string'
      ) {
        const errorIsShow = !r.warnings.hidden;

        if (!r.warnings.hidden) {
          global.NOTIFICATION_SYSTEM.notify(
            getWarningNotification(r.warnings.message || r.warnings),
          );
        }

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
          if (!i.hidden) {
            global.NOTIFICATION_SYSTEM.notify(
              getInfoNotification(i.message || i),
            );
          }
        });
      } else if ((r.info && r.info.message) || typeof r.info === 'string') {
        if (!r.info.hidden) {
          global.NOTIFICATION_SYSTEM.notify(
            getInfoNotification(r.info.message || r.info),
          );
        }
      }
    }
    if (r.errors && r.errors.length) {
      // Show errors
      if (Array.isArray(r.errors)) {
        let errorThrow = {};
        r.errors.forEach((w) => {
          const errorIsShow = !w.hidden;
          if (!w.hidden) {
            global.NOTIFICATION_SYSTEM.notify(
              getErrorNotification(w.message || w),
            );
          }

          errorThrow = {
            error: r,
            error_text: new RequestWarningError(w),
            errorIsShow,
          };
        });
        throw errorThrow;
      } else if (
        (r.errors && r.errors.message)
        || typeof r.errors === 'string'
      ) {
        const errorIsShow = !r.errors.hidden;

        if (!r.errors.hidden) {
          global.NOTIFICATION_SYSTEM.notify(
            getErrorNotification(r.errors.message || r.errors),
          );
        }

        const errorThrow = {
          error: r,
          error_text: new RequestWarningError(r.errors),
          errorIsShow,
        };
        throw errorThrow;
      }
    }

    return r;
  }

  return r;
};

export default class APIService {
  otherToken: boolean;
  _apiUrl: string;
  _path: string;
  serviceName: string;
  url: string;
  addPath: string[];
  /**
   * Creates APIService handler for backend service via provided url
   * @param {string} url - url path
   * @param {object} options - options
   */
  constructor(_apiUrl: string, path: string, options: any = {}) {
    this.otherToken = options.otherToken;

    this._apiUrl = _apiUrl;
    this._path = path;

    const url = this.getUrlData();

    this.serviceName = urljoin(this._apiUrl, this._path)
      .split('/')
      .pop();

    this.url = url;
    this.addPath = [];

    this.get = this.get.bind(this);
  }
  logFunction = (method) =>
      console.info(`API SERVICE ${method} ${this.getUrl()}`);  // tslint:disable-line:no-console

  getUrlData() {
    const apiVersions = localStorage.getItem(global.API__KEY) || '{}';

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

  get<F = any>(payload = {}) {
    this.log('GET');

    const url = this.getUrl();
    this.resetPath();

    return getJSON<F>(url, payload, this.otherToken);
  }

  getBlob<F = any>(payload = {}) {
    this.log('GET BLOB');
    const url = this.getUrl();
    this.resetPath();
    return getBlob(url, payload);
  }

  postBlob<F = any>(payload = {}) {
    this.log('GET (POST) BLOB');
    const url = this.getUrl();
    this.resetPath();
    return postBlob(url, payload);
  }

  post<F = any>(payload = {}, callback, type = 'form', params = {}) {
    this.log('POST');
    const url = this.getUrl();
    this.resetPath();

    return postJSON<F>(url, payload, type, params, this.otherToken).then((r) => {
      if (isFunction(callback)) {
        callback();
      } else {
        if (callback !== false) {
          this.get();
        }
      }

      return r;
    });
  }

  put<F = any>(payload = {}, callback, type = 'form') {
    this.log('PUT');
    const url = this.getUrl();
    this.resetPath();
    return putJSON<F>(url, payload, type).then((r) => {
      if (isFunction(callback)) {
        callback();
      } else {
        if (callback !== false) {
          this.get();
        }
      }

      return r;
    });
  }

  patch<F = any>(payload = {}, callback, type = 'form') {
    this.log('PATCH');
    const url = this.getUrl();
    this.resetPath();
    return patchJSON<F>(url, payload, type).then((r) => {
      if (isFunction(callback)) {
        callback();
      } else {
        if (callback !== false) {
          this.get();
        }
      }

      return r;
    });
  }

  delete<F = any>(payload = {}, callback, type = 'form') {
    this.log('DELETE');
    const url = this.getUrl();
    this.resetPath();
    return deleteJSON<F>(url, payload, type).then((r) => {
      if (isFunction(callback)) {
        callback();
      } else {
        if (callback !== false) {
          this.get();
        }
      }

      return r;
    });
  }

  getUrl() {
    return urljoin(this.getUrlData(), ...this.addPath.map((b) => String(b)));
  }

  resetPath() {
    this.url = this.getUrlData();
    this.addPath = [];
  }

  path(...args) {
    this.addPath = [...this.addPath, ...args];
    return this;
  }

  log(method: string) {
    // this.logFunction(method);
  }
}
