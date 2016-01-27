import React, {Component} from 'react';
import Map from '../map/PolyMap.jsx';
import ODHList from './ODHList.jsx';

import {polyStyles, polyState} from '../../constants/polygons.js';

const MAP_INITIAL_CENTER = [-399.43090337943863, -8521.192605428025];
const MAP_INITIAL_ZOOM = 3;


export default class RouteCreating extends Component {

		constructor(props) {
			super(props);

			this.state = {
				odhs: {},
				routeName: ''
			};

		}

		setODH(id, name, state) {

			console.log( 'set odh', arguments)
			let odhs = this.state.odhs;

			if (state === polyState.SELECTABLE) {
				delete odhs[id]
			} else {
				odhs[id] = {
					state, name, id
				}
			}

			this.setState({odhs});
			this.props.onChange('odhs', odhs);
		}

		// handleChange(field, value) {
		// 	const { route } = this.props;
		// 	route[field] = value;
		// 	this.props.onChange(route);
		// }

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
				//feature.set('state', nextState);
				//feature.setStyle(polyStyles[nextState]);
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
	          	<ODHList odhs={this.state.odhs}/>
	          </div>
					</div>
				</div>
			);

		}
}
