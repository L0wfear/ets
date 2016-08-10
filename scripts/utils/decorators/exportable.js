import React, { Component } from 'react';
import { saveData } from 'utils/functions';
import config from 'config';

export function toUrlWithParams(url, data) {
  let params = _.map(data, (v, k) => `${k}=${encodeURIComponent(v)}`).join('&');
  return `${url}?${params}`;
};

function exportable(ComposedComponent) {

  return class extends ComposedComponent {

  	constructor(props, context) {
  		super(props, context);
      this.exportable = true;
      if (typeof this.entity === 'undefined') {
        if (typeof this.constructor.entity === 'undefined') {
          throw new Error("Entity was not specified to use export!");
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
        token
      };
      let URL = toUrlWithParams(
        `${config.backend}/${this.path ? this.path + '/' : ''}${this.entity}/`,
        payload
      );
      window.open(URL);
      return;
      // return fetch(URL, {
      //   method: 'get',
      // }).then((r) => {
      //   console.log(r.headers);
      //   return r.blob();
      // });
    }

    export(payload) {
      if (typeof this.exportFunction === 'function') {
        this.exportFunction(payload);
        // .then(blob => {
        //   console.log(blob);
        //   // saveData(blob);//, `Отчет по заданиям.xls`);
        // });
      }
    }

  }
}

export default exportable;
