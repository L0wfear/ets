import React, {Component} from 'react';
import { Button, Glyphicon, Row, Col } from 'react-bootstrap';
import _ from 'lodash';
import cx from 'classnames';
import connectToStores from 'flummox/connect';

import RouteInfo from './RouteInfo.jsx';
import RouteFormWrap from './RouteFormWrap.jsx';
import Div from 'components/ui/Div.jsx';
import ClickOutHandler from 'react-onclickout';
import Filter from 'components/ui/table/filter/Filter.jsx';

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
			showId: [-1]
		};
	}

	shouldBeRendered(obj) {
    let isValid = true;
    _.mapKeys(this.state.filterValues, (value, key) => {
      if (_.isArray(value)) {
				if (!obj[key]) {
					isValid = false;
				} else if (value.indexOf(obj[key].toString()) === -1) {
          isValid = false;
        }
      }
    });

    return isValid;
  }

	closeFilter() {
		if (this.state.filterModalIsOpen === true)
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
		flux.getActions('routes').getRouteById(id).then(route => {
			this.setState({selectedRoute: route});
		});
	}

	createRoute() {

		let newR = {
			name: '',
			polys: {},
			object_list: [],
			type: '',
		};

		this.setState({
			showForm: true,
			selectedRoute: _.cloneDeep(newR),
		});

	}

	copyRoute() {
		console.log(this.state);
		let copiedRoute = _.cloneDeep(this.state.selectedRoute);
		delete copiedRoute.name;
		delete copiedRoute.id;
		copiedRoute.copy = true;
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

	handleDropdown(name) {
		let { showId } = this.state;
		let i = this.state.showId.indexOf(name);
		if (i < 0) {
			showId.push(name);
		} else {
			showId.splice(i,1);
		}
		this.setState({showId});
	}

	componentDidMount() {
		const { flux } = this.context;
		flux.getActions('routes').getRoutes();
		flux.getActions('technicalOperation').getTechnicalOperations();
		flux.getActions('technicalOperation').getTechnicalOperationsObjects();
		flux.getActions('routes').getGeozones();
		if (this.props.location.query) {
			let filterValues = {};
			_.mapKeys(this.props.location.query, (v, k) => {
				filterValues[k] = [v];
			});
			this.setState({filterValues});
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

		routesList = routesList.filter((r) => this.shouldBeRendered(r));
		routesList = _.sortBy(routesList, (o) => o.name.toLowerCase());

		let techOperRoutes = technicalOperationsList.map(e => {
			return {
				routes: routesList.filter(r => r.technical_operation_id === e.id),
				name: e.name,
				id: e.id
			}
		}).filter(e => e.routes.length).sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

		let vectorRoutes = techOperRoutes.map((o, i) => {
			let hidden = ! !!(state.showId.indexOf(o.id+'v')+1);
			let routes = o.routes.filter(r => r.type === 'vector');
			if (routes.length) return (
				<div key={i+o}>
					<h6 style={{marginLeft:"15px", marginRight:"5px"}}><span style={{cursor: "pointer"}} onClick={this.handleDropdown.bind(this, o.id+'v')}>{o.name}{!hidden ? ` \u25BC` : ` \u25BA`}</span></h6>
					<Div hidden={hidden}>
						{routes.map((r, i) => {
						let cn = cx('sidebar__list-item', {'active': route && r.id === route.id});
							return <li className={cn} onClick={this.selectRoute.bind(this, r.id)} key={i}>{r.name}</li>
						})}
					</Div>
				</div>
			)
		});

		let simpleRoutes = techOperRoutes.map((o, i) => {
			let hidden = ! !!(state.showId.indexOf(o.id+'s')+1);
			let routes = o.routes.filter(r => r.type === 'simple');
			if (routes.length) return (
				<div key={i+o}>
					<h6 style={{marginLeft:"15px", marginRight:"5px"}}><span style={{cursor: "pointer"}} onClick={this.handleDropdown.bind(this, o.id+'s')}>{o.name}{!hidden ? ` \u25BC` : ` \u25BA`}</span></h6>
					<Div hidden={hidden}>
						{routes.map((r, i) => {
							let cn = cx('sidebar__list-item', {'active': route && r.id === route.id});
							return <li className={cn} onClick={this.selectRoute.bind(this, r.id)} key={i}>{r.name}</li>
						})}
					</Div>
				</div>
			)
		})

		let simpleRoutes2 = techOperRoutes.map((o, i) => {
			let hidden = ! !!(state.showId.indexOf(o.id+'s2')+1);
			let routes = o.routes.filter(r => r.type === 'simple_dt');
			if (routes.length) return (
				<div key={i+o}>
					<h6 style={{marginLeft:"15px", marginRight:"5px"}}><span style={{cursor: "pointer"}} onClick={this.handleDropdown.bind(this, o.id+'s2')}>{o.name}{!hidden ? ` \u25BC` : ` \u25BA`}</span></h6>
					<Div hidden={hidden}>
						{routes.map((r, i) => {
							let cn = cx('sidebar__list-item', {'active': route && r.id === route.id});
							return <li className={cn} onClick={this.selectRoute.bind(this, r.id)} key={i}>{r.name}</li>
						})}
					</Div>
				</div>
			)
		})

		let pointsRoutes = techOperRoutes.map((o, i) => {
			let hidden = ! !!(state.showId.indexOf(o.id+'p')+1);
			let routes = o.routes.filter(r => r.type === 'points');
			if (routes.length) return (
				<div key={i+o}>
					<h6 style={{marginLeft:"15px", marginRight:"5px"}}><span style={{cursor: "pointer"}} onClick={this.handleDropdown.bind(this, o.id+'p')}>{o.name}{!hidden ? ` \u25BC` : ` \u25BA`}</span></h6>
					<Div hidden={hidden}>
						{routes.map((r, i) => {
							let cn = cx('sidebar__list-item', {'active': route && r.id === route.id});
							return <li className={cn} onClick={this.selectRoute.bind(this, r.id)} key={i}>{r.name}</li>
						})}
					</Div>
				</div>
			)
		})

		// let vectorRoutes = routesList.filter(r => r.type === 'vector').map((r, i) => {
		// 	let cn = cx('sidebar__list-item', {'active': route && r.id === route.id});
		// 	return <li className={cn} onClick={this.selectRoute.bind(this, r.id)} key={i}>{r.name}</li>
		// });
		//
		// let simpleRoutes = routesList.filter(r => r.type === 'simple').map((r, i) => {
		// 	let cn = cx('sidebar__list-item', {'active': route && r.id === route.id});
		// 	return <li className={cn} onClick={this.selectRoute.bind(this, r.id)} key={i}>{r.name}</li>
		// });
		//
		// let simpleRoutes2 = routesList.filter(r => r.type === 'simple_dt').map((r, i) => {
		// 	let cn = cx('sidebar__list-item', {'active': route && r.id === route.id});
		// 	return <li className={cn} onClick={this.selectRoute.bind(this, r.id)} key={i}>{r.name}</li>
		// });
		//
		// let pointsRoutes = routesList.filter(r => r.type === 'points').map((r, i) => {
		// 	let cn = cx('sidebar__list-item', {'active': route && r.id === route.id});
		// 	return <li className={cn} onClick={this.selectRoute.bind(this, r.id)} key={i}>{r.name}</li>
		// });

		return (
			<div className="ets-page-wrap routes-list">
				<Row>
					<Col xs={5} md={3} className="sidebar">
						<header className="sidebar__header clearfix">
							<div className="sidebar__header-title col-xs-12">
								Список маршрутов
							</div>
						</header>
						<div className="sidebar__list-container" style={{marginBottom: "30px !important", marginLeft: 20, top:"70px"}}>
							<ul className="sidebar__list">
								<h5><span style={{cursor: "pointer"}} onClick={this.handleDropdown.bind(this, 'manual')}>Построенные вручную{!!(state.showId.indexOf('manual')+1) ? ` \u25BC` : ` \u25BA`}</span></h5>
								<Div hidden={(! !!(state.showId.indexOf('manual')+1))}>{vectorRoutes}</Div>
							</ul>
							<ul className="sidebar__list">
								<h5><span style={{cursor: "pointer"}} onClick={this.handleDropdown.bind(this, 'odh')}>Маршруты по ОДХ{!!(state.showId.indexOf('odh')+1) ? ` \u25BC` : ` \u25BA`}</span></h5>
								<Div hidden={(! !!(state.showId.indexOf('odh')+1))}>{simpleRoutes}</Div>
							</ul>
							<ul className="sidebar__list">
								<h5><span style={{cursor: "pointer"}} onClick={this.handleDropdown.bind(this, 'dt')}>Маршруты по ДТ{!!(state.showId.indexOf('dt')+1) ? ` \u25BC` : ` \u25BA`}</span></h5>
								<Div hidden={(! !!(state.showId.indexOf('dt')+1))}>{simpleRoutes2}</Div>
							</ul>
							<ul className="sidebar__list">
								<h5><span style={{cursor: "pointer"}} onClick={this.handleDropdown.bind(this, 'dp')}>Маршруты по пунктам назначения{!!(state.showId.indexOf('dp')+1) ? ` \u25BC` : ` \u25BA`}</span></h5>
								<Div hidden={(! !!(state.showId.indexOf('dp')+1))}>{pointsRoutes}</Div>
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
