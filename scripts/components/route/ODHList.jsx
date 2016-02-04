import React, { Component } from 'react';
import { polyState } from '../../constants/polygons.js';
import { Modal, Input, Label, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import Div from '../ui/Div.jsx';

const ODHList = (props) => {
	let ODHS = [];
	let ODHS_FAIL = [];

	_.each(props.odh_list, (odh, index) => {
		if (props.showSelectable || odh.state !== polyState.SELECTABLE) {
			let speed_type = odh.state === polyState.IDLE ? 'холостой' : 'рабочий';
			ODHS.push(<li key={index}>{`${odh.name || odh.odh_name} (${speed_type} ход)`}</li>);
		}
	});

	_.each(props.odh_fail_list, (odh, index) => {
			ODHS_FAIL.push(<li key={index}>{`${odh.name || odh.odh_name}`}</li>);
	});

	return (
		<Div>
			<Div hidden={!!!props.checkRoute}>
				<Button onClick={props.checkRoute} style={{marginTop: 11}}>Проверить маршрут</Button>
			</Div>
			<Div hidden={!!!props.odh_list || !!!props.odh_list.length}>
				<h4>Список ОДХ/ДТ</h4>
				<ul>{ODHS}</ul>
			</Div>
			<Div hidden={!!!props.odh_fail_list || !!!props.odh_fail_list.length}>
				<h4>Список непокрытых ОДХ</h4>
				<ul>{ODHS_FAIL}</ul>
			</Div>
		</Div>
	);
}

export default ODHList;
