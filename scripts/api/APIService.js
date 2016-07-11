import { getUrl, getJSON, postJSON, deleteJSON, putJSON } from '../adapter.js';
import { getWarningNotification } from 'utils/notifications';
import RequestWarningError from '../errors/RequestWarningError.js';
import { mocks } from './mocks/index';

export default class APIService {

  constructor(url, useMock = false) {
    this.firstUrl = url;
    this.serviceName = url.replace(/\//g, '');
    this.useMock = useMock;
    this.url = url.indexOf('http') > -1 ? url : getUrl(url);
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

  get(payload = {}, blob = false) {
    if (this.useMock && mocks[this.serviceName]) {
      this.log('GET MOCK');
      return new Promise((res, rej) => {
        setTimeout(() => {
          res(mocks[this.serviceName].get(payload));
        }, 500);
      });
    }
    this.log('GET');

    return getJSON(this.url, payload, blob);
  }

  post(payload = {}, callback, type = 'form', blob = false) {
    this.log('POST');
    return postJSON(this.url, payload, type, blob).then((r) => this.processResponse(r, callback));
  }

  put(payload = {}, callback, type = 'form') {
    this.log('PUT');
    return putJSON(this.url, payload, type).then((r) => this.processResponse(r, callback));
  }

  delete(payload = {}, callback, type = 'form') {
    this.log('DELETE');
    return deleteJSON(this.url, payload, type).then((r) => this.processResponse(r, callback));
  }

  getUrl() {
    return this.url;
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
