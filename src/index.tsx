/**
 * APP ENTRY FILE
 * Стартовый файл приложения
 * @module ets
 */
import * as React from 'react';
import * as ReactDom from 'react-dom';
import PreloaderComponent from 'components/ui/new/preloader/Preloader';

 /* 3rd party js */
import './assets/main.scss';
/* Вспомогательные утилиты,
 * требующие постоянного нахождения в специфичном элементе в DOM
 */
import './components/ui/NotificationSystem';
import './components/ui/Prompt';
import './config/raven';

const AppContainer = React.lazy(() => (
  import(/* webpackChunkName: "app" */ './AppContainer')
));

ReactDom.render(
  <React.Suspense fallback={<PreloaderComponent typePreloader="mainpage" />}>
    <AppContainer />
  </React.Suspense>,
  document.getElementById('container'),
);
