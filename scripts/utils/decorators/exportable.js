import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { saveData } from 'utils/functions';
import { parseFilename } from 'utils/content-disposition.js';
import config from 'config';
import _ from 'lodash';

export function toUrlWithParams(url, data) {
  const params = _.map(data, (v, k) => `${k}=${encodeURIComponent(v)}`).join('&');
  return `${url}?${params}`;
}

function exportable(ComposedComponent) {
  return class extends ComposedComponent {

    constructor(props, context) {
      super(props, context);
      this.exportable = true;
      if (typeof this.entity === 'undefined') {
        if (typeof this.constructor.entity === 'undefined') {
          throw new Error('Entity was not specified to use export!');
        } else {
          this.entity = this.constructor.entity;
        }
      }
      this.path = this.constructor.path;
    }

    exportFunction(payload = {}) {
      const token = JSON.parse(window.localStorage.getItem('ets-session'));
      payload = {
        ...payload,
        format: 'xls',
      };
      const URL = toUrlWithParams(
        `${config.backend}/${this.path ? this.path + '/' : ''}${this.entity}/`,
        payload
      );
      // TODO blob
      return fetch(URL, {
        method: 'get',
        headers: {
          Authorization: `Token ${token}`,
          'Access-Control-Expose-Headers': 'Content-Disposition',
        },
      }).then((async) (r) => {
        const fileName = parseFilename(r.headers.get('Content-Disposition'));
        const blob = await r.blob();
        return {
          blob,
          fileName,
        };
      });
    }

    export(payload) {
      if (typeof this.exportFunction === 'function') {
        this.exportFunction(payload)
          .then(({ blob, fileName }) => {
            saveData(blob, fileName);
          });
      }
    }

  };
}


export default exportable;
