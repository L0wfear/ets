import { PropTypes } from 'react';

/**
 * Добавляет flux в contextTypes класса
 * @param {Component} target - декорируемый класс
 */
export function FluxContext(target) {
	target.contextTypes = Object.assign({}, target.contextTypes, {
		flux: PropTypes.object,
	});
}
