import { getUrl, getJSON, postJSON, deleteJSON, putJSON } from '../adapter.js';
import { getWarningNotification } from 'utils/notifications';
import RequestWarningError from '../errors/RequestWarningError.js';

let mocks = {};

export default class APIService {

  constructor(url, useMock = false) {
    this.firstUrl = url;
    this.serviceName = url.replace(/\//g, '');
    this.useMock = useMock;
    this.url = url.indexOf('http') > -1 ? url : getUrl(url);
    this.get = this.get.bind(this);
  }

  get(payload = {}) {
    if (this.useMock && mocks[this.serviceName] && mocks[this.serviceName].get && _.keys(payload).length === 0) {
      this.log('GET MOCK');
      return new Promise((res, rej) => {
        setTimeout(() => {
          res(mocks[this.serviceName].get);
        }, 500);
      });
    }
    this.log('GET');

    return getJSON(this.url, payload);
  }

  post(payload = {}, callback, type = 'form') {
    this.log('POST');
    return postJSON(this.url, payload, type).then((r) => {
      if (r.warnings && r.warnings.length) {
        r.warnings.map(w => {
          global.NOTIFICATION_SYSTEM._addNotification(getWarningNotification(w));
        });
        throw new RequestWarningError('Request warnings is not empty!');
      }
      if (typeof callback === 'function') {
        return callback();
      } else if (callback === false) {
        return r;
      } else {
        return this.get();
      }
    });
  }

  put(payload = {}, callback, type = 'form') {
    this.log('PUT');
    return putJSON(this.url, payload, type).then((r) => {
      if (r.warnings && r.warnings.length) {
        r.warnings.map(w => {
          global.NOTIFICATION_SYSTEM._addNotification(getWarningNotification(w));
        });
        throw new RequestWarningError('Request warnings is not empty!');
      }
      if (typeof callback === 'function') {
        return callback();
      } else {
        return this.get();
      }
    });
  }

  delete(payload = {}, callback, type = 'form') {
    this.log('DELETE');
    return deleteJSON(this.url, payload, type).then((r) => {
      if (r.warnings && r.warnings.length) {
        r.warnings.map(w => {
          global.NOTIFICATION_SYSTEM._addNotification(getWarningNotification(w));
        });
        throw new RequestWarningError('Request warnings is not empty!');
      }
      if (typeof callback === 'function') {
        return callback();
      } else {
        return this.get();
      }
    });
  }

  getUrl() {
    return this.url;
  }

  log(method) {
    console.info(`API SERVICE ${method} ${this.firstUrl}`);
  }

}
