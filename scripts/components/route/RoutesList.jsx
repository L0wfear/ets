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
import { getRouteById } from '../../adapter.js';

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
		};
	}

	selectRoute(id) {
		const { flux } = this.context;
		flux.getActions('routes').getRouteById(id).then(r => {
			console.log(r);
			this.setState({selectedRoute: r.result && r.result.length ? r.result[0] : null});
		});
	}

	selectRouteVector(id) {
		const { flux } = this.context;
		flux.getActions('routes').getRouteVectorById(id).then(r => {
			this.setState({selectedRoute: r.result && r.result.length ? r.result[0] : null});
		});
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
		});
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
		const { flux } = this.context;
		flux.getActions('routes').getRoutes();
		flux.getActions('routes').getRoutesVector();
	}

	render() {
		let { routesList = [], routesVectorList = [] } = this.props;

		let route = this.state.selectedRoute;
		let state = this.state;

		let routes = routesList.map((r, i) => {
			let cn = cx('list-group-item', {'active': route && r.id === route.id});
			return <li className={cn} onClick={this.selectRoute.bind(this, r.id)} key={i}>{r.name}</li>
		});

		let routesVector = routesVectorList.map((r, i) => {
			let cn = cx('list-group-item', {'active': route && r.id === route.id});
			return <li className={cn} onClick={this.selectRouteVector.bind(this, r.id)} key={i}>{r.name}</li>
		});

		return <div className="ets-page-wrap routes-list">
			<div className="some-header">Список маршрутов "Жилищник Крылатское"
				<div className="waybills-buttons">
					<Button bsSize="small" onClick={this.createRoute.bind(this)}><Glyphicon glyph="plus" /> Создать маршрут</Button>
					<Button bsSize="small" disabled={route === null} onClick={this.deleteRoute.bind(this)}><Glyphicon glyph="remove" /> Удалить</Button>
				</div>
			</div>

				<div className="panel panel-default routes-list-menu">
				  <div className="panel-heading">Выберите маршрут из списка для просмотра</div>
				  <div className="panel-body">
						<ul className="list-group">
							{routes}
						</ul>

						<ul className="list-group">
							{routesVector}
						</ul>
				  </div>
				</div>

				<Div className="routes-list-info">
					<Div hidden={this.state.showForm || route === null}>
						<RouteInfo route={route} />
					</Div>
					<RouteFormWrap element={route}
												 onFormHide={this.onFormHide.bind(this)}
												 showForm={this.state.showForm} />
				</Div>

		</div>
	}
}

export default connectToStores(RoutesList, ['routes']);
