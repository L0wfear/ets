import React, {Component} from 'react';
import classname from 'classnames';
import { Button } from 'react-bootstrap';

import {getList} from '../stores/RoutesStore.js';
import RouteInfo from './route/RouteInfo.jsx';
import RouteCreating from './route/RouteCreating.jsx';
import RouteFormWrap from './route/RouteFormWrap.jsx';
import Div from './ui/Div.jsx';
import _ from 'lodash';
import cx from 'classnames';

let ROUTES = getList();
let CURRENT_ROUTE_ID = 4;

let ACTUAL_ROADS = [];

const ORG_ODHS = ROUTES[0].polys; // список возможных для выбора ОДХ организации
const ORG_ODH_POYS = ROUTES[0].polys;// список возможных для выбора ОДХ организации

const ORG_DTS = []; // список возможных для выбора ДТ организации

ROUTES.map((route) => {
	_.each(route.polys, (poly) => poly.state = 1);
	return route;
})

// TODO odh : { poly, polyState }
let newRoute = {
				name: '',
				odhs: [],
				dts: [],
				odhNames: [],
				dtNames: [],
				polys: ORG_ODHS,
			};


export default class RoutesList extends Component {

	constructor(props) {
		super(props);

		this.state = {
			routeCreating: false,
			routeEditing: false,
			selectedRoute: null,
			showForm: false,
		}
	}

	selectRoute(id) {

		_.each(ROUTES, (route) => {

			window.route = route;
			if (route.id === id ) {
				this.setState({
					selectedRoute: route,
					routeCreating: false
				})
				console.log( 'route selected', route);
			}
		})

	}

	createRoute() {

		let newR = _.clone(newRoute);
		newR.id = CURRENT_ROUTE_ID;
		newR.title = `Новый маршрут ${CURRENT_ROUTE_ID - 3}`;
		CURRENT_ROUTE_ID++;

		this.setState({
			//routeCreating: true,
			showForm: true,
			selectedRoute: newR,
		});

	}

	editRoute(route) {
		this.setState({
			routeEditing: true,
			selectedRoute: route
		})
	}

	saveRoute(route) {
		const newR = _.clone(route);
		let newOdhs = [];
		let newPolys = {};
		_.mapKeys(newR.odhs, (v, k) => {
			//console.log(v);
			newOdhs.push(k);
			newRoute.polys[k].state = 1;
			newPolys[k] = newRoute.polys[k];
			newR.odhNames.push(v.name);
		});
		newR.polys = newPolys;//_.clone(newRoute.odhs);
		newR.odhs = newOdhs;
		ROUTES.push(newR);
		this.setState({
			routeCreating: false,
			routeEditing: false,
			selectedRoute: newR
		});
	}

	handleChange(selectedRoute) {
		this.setState({selectedRoute});
	}

	onFormHide() {
		this.setState({
			showForm: false,
			selectedBill: null,
		})
	}

	render() {

		console.log(newRoute);

		let route = this.state.selectedRoute;
		let state = this.state;

		let routesList = ROUTES.map((r, i) => {
			let cn = cx('list-group-item', {'active': route && r.id === route.id});
			return <li className={cn} onClick={this.selectRoute.bind(this, r.id)} key={i}>{r.name || r.title}</li>
		});

		let IS_CREATING = this.state.routeCreating;
		let IS_EDITING = this.state.routeEditing;
		console.log(IS_CREATING, IS_EDITING, route);

		return <div className="ets-page-wrap routes-list">
			<p className="some-header">Список маршрутов "Жилищник Крылатское"</p>

				<div className="panel panel-default routes-list-menu">
				  <div className="panel-heading">Выберите маршрут из списка для просмотра</div>
				  <div className="panel-body">
						<ul className="list-group">
							{routesList}
						</ul>
				  </div>

					<Div hidden={IS_CREATING}>
				  	<Button bsStyle="primary" block onClick={this.createRoute.bind(this)}>Создать новый</Button>
					</Div>

					<Div hidden={!IS_CREATING} style={{marginTop: 20}}>
						<Button bsStyle="primary" block onClick={this.saveRoute.bind(this)}>Сохранить</Button>
					</Div>
				</div>

				<Div className="routes-list-info">
					<Div hidden={this.state.showForm || this.state.selectedRoute === null}>
						<RouteInfo route={route}/>
					</Div>
					<RouteFormWrap element={route}
												 onFormHide={this.onFormHide.bind(this)}
												 showForm={this.state.showForm}
												 onSubmit={this.saveRoute.bind(this)}/>
				</Div>

		</div>
	}
}
