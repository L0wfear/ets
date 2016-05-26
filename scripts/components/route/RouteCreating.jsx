import React, {Component} from 'react';
import { Row, Col, Input, Button, Glyphicon } from 'react-bootstrap';
import DrawMap from '../map/DrawMap.jsx';
import PolyMap from '../map/PolyMap.jsx';
import ODHList from './ODHList.jsx';
import Field from '../ui/Field.jsx';
import connectToStores from 'flummox/connect';
import Div from '../ui/Div.jsx';


import {polyStyles, polyState} from '../../constants/polygons.js';
import {vectorStyles, vectorState} from '../../constants/vectors.js';

import _ from 'lodash';


//[16580.674245486127, 1249.8835250755087]


// const MAP_INITIAL_CENTER = [16580.674245486127, 1249.8835250755087];
// const MAP_INITIAL_ZOOM = 6;

class RouteCreating extends Component {

		constructor(props, context) {
			super(props);

			let sessionStore = context.flux.getStore('session');

			this.state = {
				routeName: '',
				zoom: sessionStore.getCurrentUser().getCompanyMapConfig().zoom,
				center: sessionStore.getCurrentUser().getCompanyMapConfig().coordinates,
			};

		}

		setODH(id, name, state) {

			const { object_list } = this.props.route;
			const objectIndex = _.findIndex(object_list, o => o.object_id == id);
			let type = this.props.route.type === 'simple_dt' ? 'dt' : 'odh';

			if (state === polyState.SELECTABLE) {
				object_list.splice(objectIndex, 1);
			} else {
				if (objectIndex > -1) {
					object_list[objectIndex] = {object_id: parseInt(id, 10), type, name, state};
				} else {
					object_list.push({object_id: parseInt(id, 10), type, name, state});
				}
			}

			this.props.onChange('object_list', object_list);
		}

		onFeatureClick(feature, ev, map) {
			let {id, name, state} = feature.getProperties();
			console.log(map.map.getView().getCenter(), map.map.getView().getZoom());

			let polys = _.cloneDeep(this.props.route.polys);

			if (state) {
				let nextState;

				if (state === polyState.SELECTABLE) {
					nextState = polyState.ENABLED;
				} else if (state === polyState.ENABLED) {
					nextState = polyState.IDLE;
				} else if (state === polyState.IDLE) {
					nextState = polyState.SELECTABLE;
				}

				polys[id].state = nextState;
				this.props.onChange('polys', polys);
				this.setODH(id, name, nextState);
			}
		}

		onDrawFeatureClick(feature, ev, map) {

			let {id, state} = feature.getProperties();

			const { object_list } = this.props.route;
			const objectIndex = _.findIndex(object_list, o => o.id === id);

			if (state) {
				let nextState;

				if (state === polyState.ENABLED) {
					nextState = polyState.IDLE;
				} else if (state === polyState.IDLE) {
					nextState = polyState.ENABLED;
				}

				if (objectIndex > -1) {
					object_list[objectIndex].state = nextState;
				}
			}

			this.props.onChange('object_list', object_list);

		}

		onDrawFeatureAdd(feature, coordinates, distance, map) {
			let { id, state } = feature.getProperties();
			const { object_list } = this.props.route;

			let routeHasObject = _.find(object_list, o => {
				return o.begin.x_msk === coordinates[0][0] && o.begin.y_msk === coordinates[0][1];
			});

			if (!routeHasObject) {
				object_list.push({
					begin: {x_msk: coordinates[0][0], y_msk: coordinates[0][1]},
					end: {x_msk: coordinates[1][0], y_msk: coordinates[1][1]},
					state: 2,
					id: id,
					distance: distance,
					technical_operation_id: 55,
				});
			}

			this.props.onChange('object_list', object_list);
		}

		onPointAdd(coordinates) {
			const { object_list } = this.props.route;
			object_list.push({
				coordinates,
			});
			this.props.onChange('object_list', object_list);
		}

		checkRoute() {
			const { flux } = this.context;
			flux.getActions('routes').validateRoute(this.props.route).then(r => {
				const result = r.result;
				let odh_list = r.result.odh_validate_result.filter(res => res.status !== 'fail');
				let odh_fail_list = r.result.odh_validate_result.filter(res => res.status === 'fail');
				this.props.onChange('odh_list', odh_list);
				this.props.onChange('odh_fail_list', odh_fail_list);
			});
		}

		removeLastDrawFeature() {
			const { object_list } = this.props.route;
			object_list.splice(-1, 1);
			this.props.onChange('object_list', object_list);
		}

		onGeozoneSelectChange(type, v) {
			let { object_list, polys } = this.props.route;
			let { geozonePolys } = this.props;
			let odhs = v.split(',');
			if (odhs.length > object_list.length) {
				let object_id = _.last(odhs);
				object_list.push({object_id: parseInt(object_id, 10), type, name: geozonePolys[object_id].name, state: polyState.ENABLED});
				polys[object_id].state = polyState.ENABLED;
			} else {
				object_list = object_list.filter(o => {
					let index = odhs.indexOf(o.object_id.toString());
					if (index === -1) {
						polys[o.object_id].state = polyState.SELECTABLE;
					}
					return index > -1;
				});
			}
			this.props.onChange('polys', polys);
			this.props.onChange('object_list', object_list);
		}

		handleCheckbox(type, v, e) {
			let { object_list, polys } = this.props.route;
			let { geozonePolys } = this.props;
			let odhs = v.split(',').map((e) => parseInt(e, 10));
			object_list.forEach((obj) => {
				let i = odhs.indexOf(obj.object_id);
				if (i+1) odhs.splice(i,1);
			});
			if (e.target.checked) {
				odhs.forEach((e) => {
					object_list.push({object_id: e, type, name: geozonePolys[e].name, state: polyState.ENABLED});
					polys[e].state = polyState.ENABLED;
				});
			} else {
				object_list = [];
				_.forEach(polys, (e) => {
					e.state = polyState.SELECTABLE;
				});
			}

			this.props.onChange('polys', polys);
			this.props.onChange('object_list', object_list);
		}

		onObjectNameChange(i, v) {
			let { object_list } = this.props.route;
			object_list[i].name = v.target.value;
			this.props.onChange('object_list', object_list);
		}

		removeObject(i) {
			let { object_list } = this.props.route;
			object_list.splice(i, 1);
			this.props.onChange('object_list', object_list);
		}

		render() {
			let route = this.props.route;
			const Map = this.props.manual ? DrawMap : PolyMap;
			let odh_list = route.odh_list || route.object_list.filter(o => o.type);
			let odh_fail_list = route.odh_fail_list || [];
			let ODHS = _.map(this.props.odhPolys, (v, k) => ({label: v.name, value: k}) );
			let DTS = _.map(this.props.dtPolys, (v, k) => ({label: v.name, value: k}) );

			return (
					<div>
						<Row>
							<Col md={9}>
								<Div className="route-creating">
									<Map onFeatureClick={this.onFeatureClick.bind(this)}
											onPointAdd={this.onPointAdd.bind(this)}
											onDrawFeatureAdd={this.onDrawFeatureAdd.bind(this)}
											onDrawFeatureClick={this.onDrawFeatureClick.bind(this)}
											removeLastDrawFeature={this.removeLastDrawFeature.bind(this)}
											zoom={this.state.zoom}
											center={this.state.center}
											object_list={route.object_list}
											polys={route.polys}
											objectsType={route.type}
											manualDraw={this.props.manual}
											edit={!!route.id} />
								</Div>
							</Col>
							<Col md={3}>
								<Div hidden={route.type !== 'simple'} className="odh-container">
									<Input type="checkbox"  label="Выбрать все" onChange={this.handleCheckbox.bind(this, 'odh', ODHS.map(o => o.value).join(','))}/>
									<Field type="select" label="Список выбранных ОДХ"
											multi={true}
											options={ODHS}
											value={route.object_list.map(o => o.object_id).join(',')}
											onChange={this.onGeozoneSelectChange.bind(this, 'odh')}/>
								</Div>
								<Div hidden={route.type !== 'simple_dt'} className="odh-container">
									<Input type="checkbox"  label="Выбрать все" onChange={this.handleCheckbox.bind(this, 'dt', DTS.map(o => o.value).join(','))}/>
									<Field type="select" label="Список выбранных ДТ"
											multi={true}
											options={DTS}
											value={route.object_list.map(o => o.object_id).join(',')}
											onChange={this.onGeozoneSelectChange.bind(this, 'dt')}/>
								</Div>
		          	<ODHList odh_list={odh_list} odh_fail_list={odh_fail_list} checkRoute={route.type === 'vector' ? this.checkRoute.bind(this) : null}/>
								<Div className="destination-points" hidden={route.type !== 'points'}>
									{route.object_list.map((o,i) => {
									let label = `Пункт назначения №${i+1} ${o.name ? '( ' + o.name + ' )' : ''}`
									return (
										<Div className="destination-point" key={i}>
											<Input type="text" label={label} value={o.name} onChange={this.onObjectNameChange.bind(this, i)} />
											<Button className="inline-block" onClick={this.removeObject.bind(this, i)}><Glyphicon glyph="remove"/></Button>
										</Div>
									)
									})}
								</Div>
							</Col>
						</Row>
					</div>
			);

		}
}

RouteCreating.contextTypes = {
	flux: React.PropTypes.object,
};

export default connectToStores(RouteCreating, ['routes']);
