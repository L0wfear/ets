/**
 * APP ENTRY FILE
 * Стартовый файл приложения
 * @module ets
 */
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-main/create';
import AppContainer from './AppContainer';

 /* 3rd party js */
import './assets/main.scss';
/* Вспомогательные утилиты,
 * требующие постоянного нахождения в специфичном элементе в DOM
 */
import './components/ui/NotificationSystem';
import './components/ui/Prompt';
import './config/raven';
import EtsThemeProvider from 'components/new/ui/@bootstrap/EtsThemeProvider';

const store = configureStore();

ReactDom.render(
  <Provider store={store}>
    <EtsThemeProvider>
      <AppContainer />
    </EtsThemeProvider>
  </Provider>,
  document.getElementById('container'),
);
