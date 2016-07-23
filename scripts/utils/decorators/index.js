import { PropTypes } from 'react';
import flummoxConnectToStores from 'flummox/connect';

/**
 * Добавляет flux в static contextTypes класса
 * @param {Component} target - декорируемый класс
 */
export function FluxContext(target) {
	target.contextTypes = Object.assign({}, target.contextTypes, {
		flux: PropTypes.object,
	});
}

export function elementsList(options) {
	return function (target) {
		target = Object.assign(target, options);
	}
}

/**
 * Обертка над стандартным connectToStores для использования в качестве
 * декоратора
 * @example
 * @connectToStores
 * class SomeClass extends React.component {}
 */
export function connectToStores(...args) {
  return function (target) {
    return flummoxConnectToStores(target, ...args);
  }
}
