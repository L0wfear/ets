import React, {Component} from 'react';
import Map from '../map/PolyMap.jsx';
import ODHList from './ODHList.jsx';
import Div from '../ui/Div.jsx';

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
			const { object_list = [] } = route;
			const polys = object_list.map(({shape, name, state}) => {
				return {
					shape: JSON.parse(shape),
					name,
					state,
				}
			});

			return  (
				<Div>
					<Div className="route-name" hidden={this.props.mapOnly}> {route.name} </Div>
					<Div className="route-odhs-on-map">
						<Map onFeatureClick={this.onFeatureClick.bind(this)}
								 zoom={MAP_INITIAL_ZOOM}
	            	 center={MAP_INITIAL_CENTER}
	            	 polys={polys}/>

	          <Div className="route-odhs-list" hidden={this.props.mapOnly}>
	          	<h4>Список ОДХ/ДТ</h4>
	          	<ODHList showSelectable={true} object_list={route.object_list}/>
	          </Div>
					</Div>
				</Div>
			);
		}
}
