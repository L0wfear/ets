/**
 * APP ENTRY FILE
 * Стартовый файл приложения
 * @module ets
 */
import * as React from 'react';
import * as ReactDom from 'react-dom';
import PreloadNew from 'components/old/ui/new/preloader/PreloadNew';

 /* 3rd party js */
import './assets/main.scss';
/* Вспомогательные утилиты,
 * требующие постоянного нахождения в специфичном элементе в DOM
 */
import './components/old/ui/NotificationSystem';
import './components/old/ui/Prompt';
import './config/raven';

if ('Worker' in window && __DEVELOPMENT__) {
  const WebWorker = require("worker-loader!./test.webworker");

  const worker = new WebWorker();

  worker.postMessage({ message: 'Hello, bro!' });
  worker.onmessage = (event) => {
    console.log(event.data.message);  // tslint:disable-line:no-console
  };
}

// App.ts
const AppContainer = React.lazy(() => (
  import(/* webpackChunkName: "app" */ './AppContainer')
));

ReactDom.render(
  <React.Suspense fallback={<PreloadNew typePreloader="mainpage" />}>
    <AppContainer />
  </React.Suspense>,
  document.getElementById('container'),
);
