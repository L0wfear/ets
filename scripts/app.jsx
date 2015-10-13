require('babel/polyfill');
require('whatwg-fetch');

import '!style!raw!../scripts/vendor/ol.css';
import '!style!raw!ol3-popup/src/ol3-popup.css';
import '!style!raw!sass!../styles/main.scss';
import '!style!raw!../styles/bootstrap.min.css';

// TODO https://github.com/esdoc/esdoc
window.Object.assign = require('object-assign');

import React from 'react';
import App from './components/App.jsx';
import NotificationSystem from './components/NotificationSystem.jsx';
import Flux from './Flux.js';
import './vendor/onTabUnfocus.js';

window.addEventListener('blur', (ev) => {
  let store = flux.getStore('points')
  store.pauseRendering()
})

window.addEventListener('focus', (ev) => {
  let store = flux.getStore('points')
  store.unpauseRendering()
  global.olmap && global.olmap.updateSize()
})

global.NOTIFICATION_SYSTEM = React.render(<NotificationSystem/>, document.getElementById('notifications'))
global.APPSTART_TIME = Date.now();
global.NODE_ENV = process.env.NODE_ENV;

if (global.NODE_ENV !== 'production') {
  window.React = React;
}

const flux = new Flux();
React.render(<App flux={flux}/>, document.getElementById('content'))
