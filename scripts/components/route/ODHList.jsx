import React, {Component} from 'react';
import {polyState} from '../../constants/polygons.js';

const ODHList = (props) => {
	let LIST = [];

	_.each(props.odhs, (odh) =>  (props.showSelectable || odh.state !== polyState.SELECTABLE) && LIST.push(<li>{odh.name} {odh.state === polyState.IDLE ? ' (холостой ход) ' : ' (рабочий ход)'} </li>))
	return <ul>{LIST}</ul>
}

export default ODHList;