import { PropTypes } from 'react';
import flummoxConnectToStores from 'flummox/connect';
import exportable from './exportable.jsx';

/**
 * Добавляет flux в static contextTypes класса
 * @param {Component} target - декорируемый класс
 */
function FluxContext(target) {
  target.contextTypes = Object.assign({}, target.contextTypes, {
    flux: PropTypes.object,
  });
}

/**
 * Добавляет history в static contextTypes класса
 * @param {Component} target - декорируемый класс
 */
function HistoryContext(target) {
  target.contextTypes = Object.assign({}, target.contextTypes, {
    history: PropTypes.object,
  });
}

/**
 * Добавляет параметры в статические свойства класса
 * @param {object} options - свойства (поля переданного объекта)
 */
function staticProps(options) {
  return function decorate(target) {
    target = Object.assign(target, options);
  };
}

/**
 * Обертка над стандартным connectToStores для использования в качестве
 * декоратора
 * @example
 * @connectToStores
 * class SomeClass extends React.component {}
 */
function connectToStores(...args) {
  return function decorate(target) {
    return flummoxConnectToStores(target, ...args);
  };
}

export default {
  exportable,
  connectToStores,
  FluxContext,
  HistoryContext,
  staticProps,
};
