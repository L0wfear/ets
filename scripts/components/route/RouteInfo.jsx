import React, {Component} from 'react';
import { Row, Col, Input } from 'react-bootstrap';
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

			let odh_list = route.odh_list || object_list.filter(o => o.type);

			return (
				<Div style={{marginTop: 18}}>
					<Div className="route-name" hidden={this.props.mapOnly}><b>{route.name}</b></Div>
					<Div>
						<Row>

							<Col md={8}>
								<Div className="route-creating">
									<Map onFeatureClick={this.onFeatureClick.bind(this)}
											 zoom={MAP_INITIAL_ZOOM}
				            	 center={MAP_INITIAL_CENTER}
				            	 polys={polys}
											 manual={manual}
											 onCanvasChange={this.props.onCanvasChange}/>
								</Div>
							</Col>

							<Col md={4}>
								<ODHList showSelectable={true} odh_list={odh_list}/>
								<Div style={{marginTop: 20}} hidden={route.type !== 'points'}>
									{route.object_list.map((o,i) => {
										let label = `Пункт назначения №${i+1} ${o.name ? '(' + o.name + ')' : ''}`
										return <Input key={i} label={label} />
									})}
								</Div>
							</Col>

						</Row>
					</Div>
				</Div>
			);
		}
}
