import React, {Component} from 'react';
import classname from 'classnames';
import { Button, Glyphicon } from 'react-bootstrap';
import {getList} from '../../stores/RoutesStore.js';
import RouteInfo from './RouteInfo.jsx';
import RouteCreating from './RouteCreating.jsx';
import RouteFormWrap from './RouteFormWrap.jsx';
import Div from '../ui/Div.jsx';
import _ from 'lodash';
import cx from 'classnames';
import connectToStores from 'flummox/connect';

let ROUTES = getList();
let CURRENT_ROUTE_ID = 4;

const ORG_ODHS = ROUTES[0].polys; // список возможных для выбора ОДХ организации

let NEW_ROUTES = [];

// TODO odh : { poly, polyState }
let newRoute = {
	name: '',
	polys: ORG_ODHS,
	object_list: [],
};


class RoutesList extends Component {

	static contextTypes = {
		flux: React.PropTypes.object,
	}

	constructor(props) {
		super(props);

		this.state = {
			selectedRoute: null,
			showForm: false,
		}
	}

	selectRoute(id) {

		// _.each(ROUTES, (route) => {
		//
		// 	window.route = route;
		// 	if (route.id === id ) {
		// 		this.setState({
		// 			selectedRoute: route,
		// 		})
		// 		console.log( 'route selected', route);
		// 	}
		// });

		const route = _.find(this.props.routesList, r => r.id === id);
		if (route) {
			this.setState({
				selectedRoute: route,
			});
			console.log( 'route selected', route);
		}

	}

	createRoute() {

		let newR = _.cloneDeep(newRoute);

		this.setState({
			showForm: true,
			selectedRoute: newR,
		});

	}

	deleteRoute() {
		if (confirm('Вы уверены, что хотите удалить выбранный маршрут?')) {
			const { flux } = this.context;
			flux.getActions('routes').removeRoute(this.state.selectedRoute);
			this.setState({selectedRoute: null});
		}
	}

	editRoute(route) {
		this.setState({
			selectedRoute: route
		})
	}

	saveRoute(route) {
		//const newR = _.cloneDeep(route);
		// let newPolys = {};
		// _.mapKeys(newR.object_list, (o, i) => {
		// 	const newPoly = _.cloneDeep(newRoute.polys[o.id]);
		// 	newPoly.state = o.state;
		// 	newPolys[o.id] = newPoly;
		// });
		// newR.polys = newPolys;
		// NEW_ROUTES.push(newR);
		// this.setState({
		// 	selectedRoute: newR
		// });
	}

	handleChange(selectedRoute) {
		this.setState({selectedRoute});
	}

	onFormHide() {
		this.setState({
			showForm: false,
			selectedRoute: null,
		})
	}

	componentDidMount() {
		// fetch('http://ods.mos.ru/ssd/city-dashboard/geozone?token=eyJhbGciOiAiUlMyNTYiLCAidHlwIjogIkpXVCJ9.eyJjb21wYW55X2lkIjogMTAyMzE0OTQsICJqdGkiOiAiam9tbHlHVUNpQ0R4RWlXaUQta0hNdz09IiwgIm5iZiI6IDE0NTM4OTUwMjcsICJ1c2VyX2lkIjogMywgImxvZ2luIjogImtyeWxhdHNrb2UiLCAiaWF0IjogMTQ1Mzg5NTAyNywgImV4cCI6IDE0NTM5ODE0Mjd9.tHGuNZ2rOQD0Jqicy3I4KnjW9rQ04I_0uanv9iTLxTX3v9QIzDW1GtqgUC8EgY3fZUpxlYxDcjh9IunX17IWNiOEpykGBz7tynARLdv69CWBNphQR5Imvtm0e2gei7by5efIansARF53gOBMxgm6VvYC6ACUh6z8qL3tu0TVAIbCwDSO5pvY41UUeaM9oXLdpFCMXA1IqSAxM6csv0ofojMwl16r5g0eb2X6ItJ6IJmibu8xSTLV1yZJCJp1wUNX35dB-7JXdpHqKve5UVGDEWGl7QDn48LuYeCskfWzG_aO_q2eGcJtSBCu3h3aTfXt3U7BIDp5befZslqYnspv_A')
		// .then(r=>r.json()).then(r=> {
		//
		// 	let object_list = r.result.map((obj, i) => {
		// 		if (obj.customer_id !== 10231494) {
		// 			return null; //10231494
		// 		}
		// 		obj.state = 1;
		// 		obj.shape = JSON.parse(obj.shape);
		//
		// 		return obj;
		// 	}).filter(obj => obj);
		// 	newRoute.polys = object_list;
		// });
		const { flux } = this.context;
		flux.getActions('routes').getRoutes();
	}

	render() {

		const { routesList = [] } = this.props;
		console.log(routesList);

		let route = this.state.selectedRoute;
		let state = this.state;

		let routes = routesList.map((r, i) => {
			let cn = cx('list-group-item', {'active': route && r.id === route.id});
			return <li className={cn} onClick={this.selectRoute.bind(this, r.id)} key={i}>{r.name}</li>
		});

		return <div className="ets-page-wrap routes-list">
			<div className="some-header">Список маршрутов "Жилищник Крылатское"
				<div className="waybills-buttons">
					<Button bsSize="small" onClick={this.createRoute.bind(this)}><Glyphicon glyph="plus" /> Создать маршрут</Button>
					<Button bsSize="small" disabled={this.state.selectedRoute === null} onClick={this.deleteRoute.bind(this)}><Glyphicon glyph="remove" /> Удалить</Button>
				</div>
			</div>

				<div className="panel panel-default routes-list-menu">
				  <div className="panel-heading">Выберите маршрут из списка для просмотра</div>
				  <div className="panel-body">
						<ul className="list-group">
							{routes}
						</ul>
				  </div>
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

export default connectToStores(RoutesList, ['routes']);
