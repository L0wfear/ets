import React, { Component } from 'react';
import { saveData } from 'utils/functions';
import config from 'config';

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

    exportFunction() {
      const token = JSON.parse(window.localStorage.getItem('ets-session'));
      let URL = `${config.backend}/${this.path ? this.path + '/' : ''}${this.entity}/?format=xls&token=${token}`;
      window.open(URL);
      return;
      // return fetch(URL, {
      //   method: 'get',
      // }).then((r) => {
      //   console.log(r.headers);
      //   return r.blob();
      // });
    }

    export() {
      if (typeof this.exportFunction === 'function') {
        this.exportFunction();
        // .then(blob => {
        //   console.log(blob);
        //   // saveData(blob);//, `Отчет по заданиям.xls`);
        // });
      }
    }

  }
}

export default exportable;
