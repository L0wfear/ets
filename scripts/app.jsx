require('babel/polyfill');
require('whatwg-fetch');

require('./leaflet.js'); // TODO use 1.0.0 when released
window.Object.assign = require('object-assign');

import React from 'react';
import App from './components/App.jsx';
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

if (process.env.NODE_ENV !== 'production') {
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

Promise.all([
  icons.loadIcons
]).then(() => {

  let isReady = false;

  Promise.all([
    loadCustomers(),
    loadModels(),
    loadOwners(),
    loadOkrugs(),
    loadTypes()]).then(() => {
      isReady = true;
      let el = document.getElementsByClassName('cssload-loader')[0];
      setTimeout(()=>{el.parentNode.removeChild(el);}, 1000)

    });

  React.render(<App ready={isReady} flux={flux} renderLoop={renderLoop}/>, element, () => {
    renderLoop.start();
  });
});

getAllPoints().then(data => {
  flux.getActions('points').updatePointsInitial(data);
  let ws = new WebSocket(config.ws);
  ws.onmessage = ({ data }) => {
    flux.getActions('points').updatePoints(JSON.parse(data));
  };
})
