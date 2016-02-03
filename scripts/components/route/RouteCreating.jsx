import React, {Component} from 'react';
import DrawMap from '../map/DrawMap.jsx';
import PolyMap from '../map/PolyMap.jsx';
import ODHList from './ODHList.jsx';
import _ from 'lodash';

import {polyStyles, polyState} from '../../constants/polygons.js';
import {vectorStyles, vectorState} from '../../constants/vectors.js';

const MAP_INITIAL_CENTER = [-399.43090337943863, -8521.192605428025];
const MAP_INITIAL_ZOOM = 3;

console.log(polyState);


export default class RouteCreating extends Component {

		constructor(props) {
			super(props);

			this.state = {
				routeName: ''
			};

		}

		setODH(id, name, state) {

			console.log('set odh', arguments)

			const { object_list } = this.props.route;
			const objectIndex = _.findIndex(object_list, o => o.object_id == id);

			if (state === polyState.SELECTABLE) {
				object_list.splice(objectIndex, 1);
			} else {
				if (objectIndex > -1) {
					object_list[objectIndex] = {object_id: id, type: 'odh', name, state};
				} else {
					object_list.push({object_id: id, type: 'odh', name, state});
				}
			}

			this.props.onChange('object_list', object_list);
		}

		onFeatureClick(feature, ev, map) {
			console.log("ON FEATURE CLICK");
			let {id, name, state} = feature.getProperties();

			const { polys } = this.props.route;

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

			let {id, state, distance, begin, end} = feature.getProperties();

			console.warn('DRAW FEATURE CLICK', id);

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
			if (!_.find(object_list, o => o.begin.x_msk === coordinates[0][0]))
			object_list.push({
				begin: {x_msk: coordinates[0][0], y_msk: coordinates[0][1]},
				end: {x_msk: coordinates[1][0], y_msk: coordinates[1][1]},
				state: 2,
				id: id,
				distance: distance,
				technical_operation_id: 55,
			});
			this.props.onChange('object_list', object_list);
		}

		removeLastDrawFeature() {
			const { object_list } = this.props.route;
			object_list.splice(-1, 1);
			this.props.onChange('object_list', object_list);
		}

		render() {
			let route = this.props.route;
			const Map = this.props.manual ? DrawMap : PolyMap;

			return (
				<div>
					{/*<div className="route-name"> Создание нового маршрута {route.name} </div>*/}
					<div className="route-odhs-on-map">
						<Map onFeatureClick={this.onFeatureClick.bind(this)}
								 onDrawFeatureAdd={this.onDrawFeatureAdd.bind(this)}
								 onDrawFeatureClick={this.onDrawFeatureClick.bind(this)}
								 removeLastDrawFeature={this.removeLastDrawFeature.bind(this)}
								 zoom={MAP_INITIAL_ZOOM}
	            	 center={MAP_INITIAL_CENTER}
								 object_list={route.object_list}
	            	 polys={route.polys}
								 manualDraw={this.props.manual}/>
	          <div className="route-odhs-list">
	          	<h4>Список ОДХ/ДТ</h4>
	          	<ODHList object_list={route.object_list}/>
	          </div>
					</div>
				</div>
			);

		}
}
