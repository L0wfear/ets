import React, {Component} from 'react';
import { Row, Col, Input } from 'react-bootstrap';
import PolyMap from '../map/PolyMap.jsx';
import ODHList from './ODHList.jsx';
import Div from 'components/ui/Div.jsx';

export default class RouteInfo extends Component {

		static contextTypes = {
			flux: React.PropTypes.object,
		}

		constructor(props, context) {
			super(props);

			let sessionStore = context.flux.getStore('session');

			this.state = {
				zoom: sessionStore.getCurrentUser().getCompanyMapConfig().zoom,
				center: sessionStore.getCurrentUser().getCompanyMapConfig().coordinates,
			}
		}

		onFeatureClick(feature, ev, map) {
			let {id, name, state} = feature.getProperties();
			if (name)
			map.popup.show(ev.coordinate, '<div class="header">ОДХ: ' + name + '</div>')
		}

		render() {
			let route = this.props.route;
			const { object_list = [] } = route;
			let manual = route.type === 'vector' ? true : false;
			const polys = object_list.map(({shape, name, state}) => ({shape, name, state}));

			let odh_list = route.odh_list || object_list.filter(o => o.type);

			return (
				<Div style={{marginTop: 18}}>
					<Div className="route-name" hidden={this.props.mapOnly}><b>{route.name}</b></Div>
					<Div>
						<Row>

							<Col md={8}>
								<Div className="route-creating">
									<PolyMap onFeatureClick={this.onFeatureClick.bind(this)}
											zoom={this.state.zoom}
											center={this.state.center}
											polys={polys}
											manual={manual}/>
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
