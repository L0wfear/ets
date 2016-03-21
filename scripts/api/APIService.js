import { getUrl, getJSON, postJSON, deleteJSON, putJSON } from '../adapter.js';
import { getWarningNotification } from 'utils/notifications'';

let mocks = {

}

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
      console.info('API SERVICE GET MOCK', this.firstUrl);
      return new Promise((res, rej) => {
        setTimeout(() => {
          res(mocks[this.serviceName].get);
        }, 500);
      });
    }

    console.info('API SERVICE GET', this.firstUrl);

    return getJSON(this.url, payload);
  }

  create(payload = {}, callback, type = 'form') {
    console.info('API SERVICE POST', this.firstUrl, type);
    return postJSON(this.url, payload, type).then((r) => {
      if (r.warnings && r.warnings.length) {
        r.warnings.map(w => {
          global.NOTIFICATION_SYSTEM._addNotification(getWarningNotification(w));
        });
        throw new Error('Request warnings is not empty!');
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

  update(payload = {}, callback, type = 'form') {
    console.info('API SERVICE PUT', this.firstUrl);
    return putJSON(this.url, payload, type).then((r) => {
      if (r.warnings && r.warnings.length) {
        r.warnings.map(w => {
          global.NOTIFICATION_SYSTEM._addNotification(getWarningNotification(w));
        });
        throw new Error('Request warnings is not empty!');
      }
      if (typeof callback === 'function') {
        return callback();
      } else {
        return this.get();
      }
    });
  }

  delete(payload = {}, callback, type = 'form') {
    console.info('API SERVICE DELETE', this.firstUrl);
    return deleteJSON(this.url, payload, type).then(() => this.get());
  }

}
