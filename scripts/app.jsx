require('babel/polyfill');
require('whatwg-fetch');

import { render } from 'react-dom';
import '!style!raw!../scripts/vendor/ol.css';
import '!style!raw!ol3-popup/src/ol3-popup.css';
import '!style!raw!sass!../styles/main.scss';
import '!style!raw!../styles/bootstrap.min.css';
import '!style!raw!react-select/dist/react-select.css';

// TODO https://github.com/esdoc/esdoc
window.Object.assign = require('object-assign');

import React from 'react';
import './components/App.jsx';
import NotificationSystem from './components/NotificationSystem.jsx';

global.NOTIFICATION_SYSTEM = render(<NotificationSystem/>, document.getElementById('notifications'))
global.APPSTART_TIME = Date.now();
global.NODE_ENV = process.env.NODE_ENV;
global.APP_DATE_FORMAT = 'DD.MM.YYYY';

if (global.NODE_ENV !== 'production') {
  window.React = React;
}

import moment from 'moment';

// var date1 = '2016-02-19T09:00:00.000000Z';
// var date2 = '2016-02-19T09:00:00';
// console.log(new Date(date1)); 12 часов
// console.log(new Date(date2)); 12 часов
// console.log(moment(date1).toDate()); 12 часов
// console.log(moment(date2).toDate()); 9 часов!
