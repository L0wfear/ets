import React, {Component} from 'react';
import Map from '../map/PolyMap.jsx';
import ODHList from './ODHList.jsx';

const MAP_INITIAL_CENTER = [-399.43090337943863, -8521.192605428025];
const MAP_INITIAL_ZOOM = 3;

export default class RouteInfo extends Component {

		onFeatureClick(feature, ev, map) {
			console.log('click on feature detected', feature, 'on', map)
			let {id, name, state} = feature.getProperties();
			map.popup.show(ev.coordinate, '<div class="header">ОДХ: ' + name + '</div>')
		}

		render() {
			let route = this.props.route;

			return  <div>
				<div className="route-name"> {route.name} </div>
				<div className="route-odhs-on-map">
						<Map
								onFeatureClick={this.onFeatureClick.bind(this)}
								zoom={MAP_INITIAL_ZOOM}
	            	center={MAP_INITIAL_CENTER}
	            	polys={route.polys}/>
	          <div className="route-odhs-list">
	          	<h4>Список ОДХ/ДТ</h4>
	          	<ODHList showSelectable={true} object_list={route.object_list}/>
	          </div>
					</div>
				</div>
		}
}
