import React, {Component} from 'react';
import { Button, Glyphicon, Row, Col } from 'react-bootstrap';
import _ from 'lodash';
import cx from 'classnames';
import connectToStores from 'flummox/connect';

import RouteInfo from './RouteInfo.jsx';
import RouteFormWrap from './RouteFormWrap.jsx';
import Div from '../ui/Div.jsx';
import { getRouteById } from '../../adapter.js';

class RoutesList extends Component {

	static contextTypes = {
		flux: React.PropTypes.object,
	}

	constructor(props) {
		super(props);

		this.state = {
			selectedRoute: null,
			showForm: false,
			isVectorRouteSelected: false,
		};
	}

	selectRoute(id) {
		const { flux } = this.context;
		flux.getActions('routes').getRouteById(id).then(r => {
			this.setState({selectedRoute: r.result && r.result.length ? r.result[0] : null});
		});
	}

	createRoute() {

		let newR = {
			name: '',
			polys: {}, // geozonePolys
			object_list: [],
			type: 'vector',
		};

		this.setState({
			showForm: true,
			selectedRoute: _.cloneDeep(newR),
		});

	}

	copyRoute() {
		let copiedRoute = _.cloneDeep(this.state.selectedRoute);
		delete copiedRoute.name;
		delete copiedRoute.id;
		this.setState({
			showForm: true,
			selectedRoute: _.cloneDeep(copiedRoute)
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
		flux.getActions('objects').getTechOperations();
		flux.getActions('routes').getGeozones();
	}

	render() {
		let { routesList = [] } = this.props;
		let route = this.state.selectedRoute;
		let state = this.state;

		let vectorRoutes = routesList.filter(r => r.type === 'vector').map((r, i) => {
			let cn = cx('list-group-item', {'active': route && r.id === route.id});
			return <li className={cn} onClick={this.selectRoute.bind(this, r.id)} key={i}>{r.name}</li>
		});

		let simpleRoutes = routesList.filter(r => r.type === 'simple').map((r, i) => {
			let cn = cx('list-group-item', {'active': route && r.id === route.id});
			return <li className={cn} onClick={this.selectRoute.bind(this, r.id)} key={i}>{r.name}</li>
		});

		let simpleRoutes2 = routesList.filter(r => r.type === 'simple_dt').map((r, i) => {
			let cn = cx('list-group-item', {'active': route && r.id === route.id});
			return <li className={cn} onClick={this.selectRoute.bind(this, r.id)} key={i}>{r.name}</li>
		});

		let pointsRoutes = routesList.filter(r => r.type === 'points').map((r, i) => {
			let cn = cx('list-group-item', {'active': route && r.id === route.id});
			return <li className={cn} onClick={this.selectRoute.bind(this, r.id)} key={i}>{r.name}</li>
		});

		return (
			<div className="ets-page-wrap routes-list">
				<div className="some-header">Список маршрутов "Жилищник Крылатское"
					<div className="waybills-buttons">
						<Button bsSize="small" onClick={this.createRoute.bind(this)}><Glyphicon glyph="plus" /> Создать маршрут</Button>
						<Button bsSize="small" disabled={route === null} onClick={() => this.setState({showForm: true})}><Glyphicon glyph="pencil" /> Изменить маршрут</Button>
						<Button bsSize="small" disabled={route === null} onClick={this.copyRoute.bind(this)}><Glyphicon glyph="copy" /> Копировать маршрут</Button>
						<Button bsSize="small" disabled={route === null} onClick={this.deleteRoute.bind(this)}><Glyphicon glyph="remove" /> Удалить</Button>
					</div>
				</div>

				<Row>
					<Col md={3}>
						<div className="panel panel-default routes-list-menu">
							<div className="panel-heading">Выберите маршрут из списка для просмотра</div>
							<div className="panel-body">
								<ul className="list-group">
									{vectorRoutes}
								</ul>
								<ul className="list-group">
									{simpleRoutes}
								</ul>
								<ul className="list-group">
									{simpleRoutes2}
								</ul>
								<ul className="list-group">
									{pointsRoutes}
								</ul>
							</div>
						</div>
					</Col>
					<Col md={9}>
							<Div hidden={this.state.showForm || route === null}>
								<RouteInfo route={route} />
							</Div>
							<RouteFormWrap element={route}
														 onFormHide={this.onFormHide.bind(this)}
														 showForm={this.state.showForm} />
					</Col>
				</Row>

			</div>
		)
	}
}

export default connectToStores(RoutesList, ['routes']);
