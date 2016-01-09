import React, {Component} from 'react';
import {polyState} from '../../constants/polygons.js';

const ODHList = (props) => {
	let LIST = [];

	_.each(props.odhs, (odh, index) =>  (props.showSelectable || odh.state !== polyState.SELECTABLE) && LIST.push(<li key={index}>{odh.name} {odh.state === polyState.IDLE ? ' (холостой ход) ' : ' (рабочий ход)'} </li>))
	return <ul>{LIST}</ul>
}

export default ODHList;
