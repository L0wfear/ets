import React, {Component} from 'react';
import PolyMap from '../map/PolyMap.jsx';
import DrawMap from '../map/DrawMap.jsx';
import ODHList from './ODHList.jsx';
import Div from '../ui/Div.jsx';

const MAP_INITIAL_CENTER = [-399.43090337943863, -8521.192605428025];
const MAP_INITIAL_ZOOM = 3;

export default class RouteInfo extends Component {

		onFeatureClick(feature, ev, map) {
			let {id, name, state} = feature.getProperties();
			if (name)
			map.popup.show(ev.coordinate, '<div class="header">ОДХ: ' + name + '</div>')
		}

		render() {
			let route = this.props.route;
			const { object_list = [] } = route;
			let manual = route.type === 'vector' ? true : false;
			console.log(object_list);
			const polys = object_list.map(({shape, name, state, coordinates}) => {
				if (!shape) {
					shape = {
						type: "Point",
						coordinates
					};
				}
				return {
					shape,//: JSON.parse(shape),
					name,
					state,
				}
			});
			const Map = PolyMap;

			let odh_list = route.odh_list || object_list.filter(o => o.type && o.type === 'odh');

			return (
				<Div>
					<Div className="route-name" hidden={this.props.mapOnly}> {route.name} </Div>
					<Div className="route-odhs-on-map">
						<Map onFeatureClick={this.onFeatureClick.bind(this)}
								 zoom={MAP_INITIAL_ZOOM}
	            	 center={MAP_INITIAL_CENTER}
	            	 polys={polys}
								 manual={manual}/>

	          <Div className="route-odhs-list" hidden={this.props.mapOnly}>
	          	<ODHList showSelectable={true} odh_list={odh_list}/>
	          </Div>
					</Div>
				</Div>
			);
		}
}
