import React, {Component} from 'react';
import classname from 'classnames';
import { Button } from 'react-bootstrap';

import {getList} from '../stores/RoutesStore.js';
import RouteInfo from './route/RouteInfo.jsx';
import RouteCreating from './route/RouteCreating.jsx';
import Div from './ui/Div.jsx';
import _ from 'lodash';

let ROUTES = getList();
let CURRENT_ROUTE_ID = 4;

let ACTUAL_ROADS = [];

const ORG_ODHS = ROUTES[0].polys; // список возможных для выбора ОДХ организации

const ORG_DTS = []; // список возможных для выбора ДТ организации

ROUTES.map((route) => {
	_.each(route.polys, (poly) => poly.state = 2);
	return route;
})

// TODO odh : { poly, polyState }
let newRoute = {
				name: '',
				odhs: ORG_ODHS,
				dts: [],
				odhNames: [],
				dtNames: [],
			};


export default class RoutesList extends Component {

	constructor(props) {
		super(props);

		this.state = {
			routeCreating: false,
			selectedRoute: ROUTES[0],
			activeTab: 'image',
			selectedOdhs: {},
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
		newR.name = `Новый маршрут ${CURRENT_ROUTE_ID - 3}`;
		CURRENT_ROUTE_ID++;

		this.setState({
			routeCreating: true,
			//routeEditing: true,
			selectedRoute: newR
		});

	}

	editRoute(route) {
		this.setState({
			routeEditing: true,
			selectedRoute: route
		})
	}

	saveRoute() {
		const newR = _.clone(this.state.selectedRoute);
		console.log(newR);
		let newOdhs = [];
		let newPolys = {};
		_.mapKeys(this.state.selectedOdhs, (v, k) => {
			console.log(v, k)
			newOdhs.push(k);
			newPolys[k] = newRoute.odhs[k];
			newR.odhNames.push(v.name);
		});
		newR.polys = newPolys;//_.clone(newRoute.odhs);
		newR.odhs = newOdhs;
		ROUTES.push(newR);
		this.setState({routeCreating: false, routeEditing: true, selectedOdhs: {}, selectedRoute: newR });
	}

	setSelectedOdhs(selectedOdhs) {
		this.setState({selectedOdhs});
	}

	render() {

		let route = this.state.selectedRoute;
		let state = this.state;
		let routesList = ROUTES.map((route) => {
			let cn = "list-group-item" + (route.id === this.state.selectedRoute.id ? " active" : "");
			return <li className={cn} onClick={this.selectRoute.bind(this, route.id)} key={route.id}>{route.name}</li>
		})

		let IS_CREATING = this.state.routeCreating;
		let IS_EDITING = this.state.routeEditing;
		console.log(IS_CREATING);

		return <div className="ets-page-wrap routes-list">
			<p className="some-header"> </p>

				<div className="panel panel-default routes-list-menu">
				  <div className="panel-heading">Список маршрутов "Жилищник Крылатское"</div>
				  <div className="panel-body">
				    <p>Выберите маршрут из списка для просмотра</p>
				  </div>

			  	<ul className="list-group">
			  		{routesList}
				  </ul>

					<Div hidden={IS_CREATING}>
				  	<Button bsStyle="primary" block onClick={this.createRoute.bind(this)}>Создать новый</Button>
					</Div>

					<Div hidden={!IS_CREATING} style={{marginTop: 20}}>
						<Button bsStyle="primary" block onClick={this.saveRoute.bind(this)}>Сохранить</Button>
					</Div>
				</div>

				<div className="routes-list-info">
					{ (IS_CREATING || IS_EDITING) ?
						<RouteCreating route={IS_CREATING ? _.clone(newRoute) : route} onSelect={this.setSelectedOdhs.bind(this)}/>
						:
						<RouteInfo route={route}/>
					}
				</div>
		</div>
	}
}
