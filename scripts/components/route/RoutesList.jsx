import React, {Component} from 'react';
import { Button, Glyphicon, Row, Col } from 'react-bootstrap';
import _ from 'lodash';
import cx from 'classnames';
import connectToStores from 'flummox/connect';

import RouteInfo from './RouteInfo.jsx';
import RouteFormWrap from './RouteFormWrap.jsx';
import Div from '../ui/Div.jsx';
import { getRouteById } from '../../adapter.js';
import ClickOutHandler from 'react-onclickout';
import Filter from '../ui/table/filter/Filter.jsx';

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
			filterValues: {},
			filterModalIsOpen: false,
		};
	}

	shouldBeRendered(obj) {
    let isValid = true;
    _.mapKeys(this.state.filterValues, (value, key) => {
      if (_.isArray(value)) {
        if (value.indexOf(obj[key].toString()) === -1) {
          isValid = false;
        }
      }
    });

    return isValid;
  }

	closeFilter() {
    this.setState({filterModalIsOpen: false});
  }

  toggleFilter() {
		this.setState({filterModalIsOpen: !!!this.state.filterModalIsOpen});
	}

	saveFilter(filterValues) {
		console.info('SETTING FILTER VALUES', filterValues);
		this.setState({filterValues});
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

	setFilterValue(key, value) {

	}

	componentDidMount() {
		const { flux } = this.context;
		flux.getActions('routes').getRoutes();
		flux.getActions('technical_operation').getTechnicalOperations();
		flux.getActions('technical_operation').getTechnicalOperationsObjects();
		flux.getActions('routes').getGeozones();
		if (this.props.location.query) {
			let filterValues = {};
			_.mapKeys(this.props.location.query, (v, k) => {
				filterValues[k] = [v];
			});
			this.setState({filterValues})
		}
	}

	render() {
		let { routesList = [], technicalOperationsList = [], technicalOperationsObjectsList = [] } = this.props;
		let route = this.state.selectedRoute;
		let state = this.state;

		let TECH_OPERATIONS = technicalOperationsList.map(({id, name}) => ({value: id, label: name}));
		let OBJECTS = technicalOperationsObjectsList.map(({type, full_name}) => ({value: type, label: full_name}));
		let filterOptions = [
			{
				name: 'technical_operation_id',
				caption: 'Тех. операция',
				filter: {
					type: 'multiselect',
					options: TECH_OPERATIONS,
				}
			},
			{
				name: 'type',
				caption: 'Объект',
				filter: {
					type: 'multiselect',
					options: OBJECTS,
				}
			}
		];
		console.log(this.props);
		routesList = routesList.filter((r) => this.shouldBeRendered(r));

		let vectorRoutes = routesList.filter(r => r.type === 'vector').map((r, i) => {
			let cn = cx('sidebar__list-item', {'active': route && r.id === route.id});
			return <li className={cn} onClick={this.selectRoute.bind(this, r.id)} key={i}>{r.name}</li>
		});

		let simpleRoutes = routesList.filter(r => r.type === 'simple').map((r, i) => {
			let cn = cx('sidebar__list-item', {'active': route && r.id === route.id});
			return <li className={cn} onClick={this.selectRoute.bind(this, r.id)} key={i}>{r.name}</li>
		});

		let simpleRoutes2 = routesList.filter(r => r.type === 'simple_dt').map((r, i) => {
			let cn = cx('sidebar__list-item', {'active': route && r.id === route.id});
			return <li className={cn} onClick={this.selectRoute.bind(this, r.id)} key={i}>{r.name}</li>
		});

		let pointsRoutes = routesList.filter(r => r.type === 'points').map((r, i) => {
			let cn = cx('sidebar__list-item', {'active': route && r.id === route.id});
			return <li className={cn} onClick={this.selectRoute.bind(this, r.id)} key={i}>{r.name}</li>
		});

		return (
			<div className="ets-page-wrap routes-list">
				<Row>
					<Col xs={5} md={3} className="sidebar">
						<header className="sidebar__header clearfix">
							<div className="sidebar__header-title col-xs-12">
								Список маршрутов<br/> «Жилищник Крылатское»
							</div>
						</header>
						{/*Выберите маршрут из списка для просмотра*/}
						<div className="sidebar__list-container">
							<ul className="sidebar__list">
								{vectorRoutes}
							</ul>
							<ul className="sidebar__list">
								{simpleRoutes}
							</ul>
							<ul className="sidebar__list">
								{simpleRoutes2}
							</ul>
							<ul className="sidebar__list">
								{pointsRoutes}
							</ul>
						</div>
					</Col>
					<Col xs={7} md={9} className="col-xs-offset-5 col-md-offset-3">
						<div className="some-header clearfix">
							<div className="waybills-buttons">
								<ClickOutHandler onClickOut={this.closeFilter.bind(this)}>
		              <Filter direction={'right'}
		                      show={this.state.filterModalIsOpen}
		                      onSubmit={this.saveFilter.bind(this)}
		                      onClick={this.toggleFilter.bind(this)}
		                      onHide={this.closeFilter.bind(this)}
		                      active={_.keys(this.state.filterValues).length}
		                      values={this.state.filterValues}
		                      options={filterOptions}
		                      //tableData={this.props.results}
		                      active={_.keys(this.state.filterValues).length}
		                      className="filter-wrap"/>
		            </ClickOutHandler>
								<Button bsSize="small" onClick={this.createRoute.bind(this)}><Glyphicon glyph="plus" /> Создать маршрут</Button>
								<Button bsSize="small" disabled={route === null} onClick={() => this.setState({showForm: true})}><Glyphicon glyph="pencil" /> Изменить маршрут</Button>
								<Button bsSize="small" disabled={route === null} onClick={this.copyRoute.bind(this)}><Glyphicon glyph="copy" /> Копировать маршрут</Button>
								<Button bsSize="small" disabled={route === null} onClick={this.deleteRoute.bind(this)}><Glyphicon glyph="remove" /> Удалить</Button>
							</div>
						</div>
						<div className="clearfix">
							<Div hidden={this.state.showForm || route === null}>
								<RouteInfo route={route} />
							</Div>
							<RouteFormWrap element={route}
										   onFormHide={this.onFormHide.bind(this)}
										   showForm={this.state.showForm} />
						</div>
					</Col>
				</Row>

			</div>
		)
	}
}

export default connectToStores(RoutesList, ['routes', 'objects']);
