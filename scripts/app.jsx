require('babel/polyfill');
require('whatwg-fetch');

import '!style!raw!sass!../styles/main.scss';
import '!style!raw!../styles/bootstrap.min.css';

window.Object.assign = require('object-assign');

import React from 'react';
import App from './components/App.jsx';
import NotificationSystem from './components/NotificationSystem.jsx';
import Flux from './Flux.js';
import { getAllPoints } from './adapter.js';
import icons from './icons/index.js';
import config from './config.js';
import Modal from 'react-modal';
import RenderLoop from './RenderLoop.js';
import Stats from './Stats.js';
import ReconnectingWebSocket from './ReconnectingWebsocket.js';

import { loadCustomers } from './customers.js';
import { loadModels } from './models.js';
import { loadOwners } from './owners.js';
import { loadOkrugs} from './okrugs.js';
import { loadTypes } from './types.js';
import './vendor/onTabUnfocus.js';

window.addEventListener('blur', (ev) => {
  //let store = flux.getStore('points')
  //store.pauseRendering()
})

window.addEventListener('focus', (ev) => {
  //let store = flux.getStore('points')
  //store.unpauseRendering()
  window.MAP.invalidateSize();
})

global.APPSTART_TIME = Date.now();
global.NODE_ENV = process.env.NODE_ENV;

if (global.NODE_ENV !== 'production') {
  window.React = React;
}

const flux = new Flux();
const element = document.getElementById('content');
const stats = new Stats();
stats.setMode(0);
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.bottom = '0px';
stats.domElement.style.zIndex = 100;
// document.body.appendChild(stats.domElement);

const renderLoop = new RenderLoop(stats);

Modal.setAppElement(element);
Modal.injectCSS();
//icons.loadIcons();

Promise.all([
  loadCustomers(),
  loadModels(),
  loadOwners(),
  loadOkrugs(),
  loadTypes()]).then(() => {
    let el = document.getElementsByClassName('cssload-loader')[0];
    setTimeout(()=>{el.parentNode.removeChild(el);}, 3000)
  });

React.render(<App flux={flux} renderLoop={renderLoop}/>, element, () => {
  renderLoop.start();
})

global.NOTIFICATION_SYSTEM = React.render(<NotificationSystem/>, document.getElementById('notifications'))
