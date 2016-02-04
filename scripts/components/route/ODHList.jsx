import React, { Component } from 'react';
import { polyState } from '../../constants/polygons.js';
import { Modal, Input, Label, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import Div from '../ui/Div.jsx';

const ODHList = (props) => {
	let ODHS = [];

	_.each(props.odh_list, (odh, index) => {
		if ((props.showSelectable || odh.state !== polyState.SELECTABLE)) {
			let speed_type = odh.state === polyState.IDLE ? 'холостой' : 'рабочий';
			ODHS.push(<li key={index}>{`${odh.name || odh.odh_name} (${speed_type} ход)`}</li>);
		}
	});

	return (
		<Div>
			<ul>{ODHS}</ul>
			<Div hidden={!!!props.checkRoute}>
				<Button onClick={props.checkRoute}>Проверить маршрут</Button>
			</Div>
		</Div>
	);
}

export default ODHList;
