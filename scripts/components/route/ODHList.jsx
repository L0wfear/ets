import React, { Component } from 'react';
import { polyState  } from '../../constants/polygons.js';

const ODHList = (props) => {
	let ODHS = [];

	_.each(props.odhs, (odh, index) => {
		if (props.showSelectable || odh.state !== polyState.SELECTABLE) {
			let speed_type = odh.state === polyState.IDLE ? 'холостой' : 'рабочий';
			ODHS.push(<li key={index}>{`${odh.name} (${speed_type} ход)`}</li>);
		}
	});

	return <ul>{ODHS}</ul>;
}

export default ODHList;
