import React, {Component} from 'react';
import Map from '../map/PolyMap.jsx';
import ODHList from './ODHList.jsx';
import _ from 'lodash';

import {polyStyles, polyState} from '../../constants/polygons.js';

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

		render() {
			let route = this.props.route;
			console.log(route);

			return (
				<div>
					{/*<div className="route-name"> Создание нового маршрута {route.name} </div>*/}
					<div className="route-odhs-on-map">
						<Map
								onFeatureClick={this.onFeatureClick.bind(this)}
								zoom={MAP_INITIAL_ZOOM}
	            	center={MAP_INITIAL_CENTER}
	            	polys={route.polys}/>
	          <div className="route-odhs-list">
	          	<h4>Список ОДХ/ДТ</h4>
	          	<ODHList object_list={route.object_list}/>
	          </div>
					</div>
				</div>
			);

		}
}
