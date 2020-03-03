import * as PropTypes from 'prop-types';
import flummoxConnectToStores from 'flummox/connect';
import exportable from './exportable';

// TODO перенести HOC в отдельную папку, т.к. они могут использоваться не только как декораторы

/**
 * Добавляет flux в static contextTypes класса
 * @param {Component} target - декорируемый класс
 */
function FluxContext(target) {
  target.contextTypes = Object.assign({}, target.contextTypes, {
    flux: PropTypes.object,
  });

  return target;
}

/**
 * Добавляет параметры в статические свойства класса
 * @param {object} options - свойства (поля переданного объекта)
 */
function staticProps(options) {
  // prettier-ignore
  return function decorate(target) { // eslint-disable-line
    target = Object.assign(target, options); // eslint-disable-line
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

export { exportable, connectToStores, FluxContext, staticProps };
