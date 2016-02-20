import { getUrl, getJSON, postJSON, deleteJSON, putJSON } from '../adapter.js';

export default class APIService {

  constructor(url) {
    this.firstUrl = url;
    this.url = url.indexOf('http') > -1 ? url : getUrl(url);
    this.get = this.get.bind(this);
  }

  get(payload = {}) {
    console.info('API SERVICE GET', this.firstUrl);
    return getJSON(this.url, payload);
  }

  create(payload = {}, callback) {
    console.info('API SERVICE POST', this.firstUrl);
    return postJSON(this.url, payload).then(() => {
      if (typeof callback === 'function') {
        return callback();
      } else {
        return this.get();
      }
    });
  }

  update(payload = {}, callback) {
    console.info('API SERVICE PUT', this.firstUrl);
    return putJSON(this.url, payload).then(() => {
      if (typeof callback === 'function') {
        return callback();
      } else {
        return this.get();
      }
    });
  }

  delete(payload = {}) {
    console.info('API SERVICE DELETE', this.firstUrl);
    return deleteJSON(this.url, payload).then(() => this.get());
  }

}
