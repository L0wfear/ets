import React, {Component} from 'react';
import Map from './map/PolyMap.jsx';
import classname from 'classnames';
import { Button } from 'react-bootstrap';

import {getList} from '../stores/RoutesStore.js';
import {polyStyles, polyState} from '../constants/polygons.js';

let ROUTES = getList();
let ACTUAL_ROADS = [];

const MAP_INITIAL_CENTER = [-399.43090337943863, -8521.192605428025];
const MAP_INITIAL_ZOOM = 3;

const ORG_ODHS = []; // список возможных для выбора ОДХ организации
const ORG_DTS = []; // список возможных для выбора ДТ организации


let selectSingleClick = new ol.interaction.Select({
	/*style: function() {
		console.log('styleFunction', arguments)
	}*/
});


// TODO odh : { poly, polyState }
let newRoute = {
				name: '',
				odhs: [],
				dts: [],
				odhNames: [],
				dtNames: []
			};


export default class RoutesList extends Component {

	constructor(props) {
		super(props);

		this.state = {
			routeCreating: false,
			selectedRoute: ROUTES[0],
			activeTab: 'image'
		}
	}

	selectRoute(id) {

		_.each(ROUTES, (route) => {

			window.route = route;
			if (route.id === id ) {
				this.setState({
					selectedRoute: route,
					routeCreating: false
				})
				console.log( 'route selected', route);

				
			}
		})

	}

	onFeatureClick(feature, ev, map) {
		console.log('click on feature detected', feature, 'on', map)
		let {id, name, state} = feature.getProperties();

		// при просмотре маршрута
		if (!this.state.routeCreating) {
			map.popup.show(ev.coordinate, '<div class="header">ОДХ: ' + name + '</div>')

		// при создании маршрута
		} else {
			if (state) {
				let nextState;

				if (state === polyState.SELECTABLE) {
					nextState = polyState.ENABLED;
				} else if (state === polyState.ENABLED) {
					nextState = polyState.IDLE;
				} else if (state === polyState.IDLE) {
					nextState = polyState.SELECTABLE;
				}

				feature.set('state', nextState);
				feature.setStyle(polyStyles[nextState]);
			}
		}

	}

	createRoute() {

		this.setState({
			routeCreating: true,
			selectedRoute: newRoute
		})

	}

	render() {

		let route = this.state.selectedRoute;
		let state = this.state;
		let routesList = ROUTES.map((route) => {
			let cn = "list-group-item" + (route.id === this.state.selectedRoute.id ? " active" : "");
			return <li className={cn} onClick={this.selectRoute.bind(this, route.id)} key={route.id}>{route.name}</li>
		})

		let IS_CREATING = this.state.routeCreating;

		return <div className="ets-page-wrap routes-list">
			<p className="some-header"> </p>

			<div className="panel panel-default routes-list-menu">
			  <div className="panel-heading">Список маршрутов "Жилищник Крылатское"</div>
			  <div className="panel-body">
			    <p>Выберите маршрут из списка для просмотра</p>
			  </div>
			  <ul className="list-group">
			  	{routesList}
				  </ul>
				  <Button bsStyle="primary" block onClick={this.createRoute.bind(this)}>Создать новый</Button>
				</div>
				<div className="routes-list-info">
					<div className="route-name">
						{IS_CREATING ? 
							<input name="route-name" value={newRoute.name}/>
							: 
							route.name 
						}
					</div>
						<div className="route-odhs-on-map">
						
							<Map 
									//selectInteraction={selectSingleClick}
									onFeatureClick={this.onFeatureClick.bind(this)}
									zoom={MAP_INITIAL_ZOOM}
	               	center={MAP_INITIAL_CENTER}
	               	polys={route.polys}/>
	            <div className="route-odhs-list">
	            	<h4>Список ОДХ/ДТ</h4>
	            	<ul>
	            		{route.odhNames.map((odh)=> <li>{odh}</li>)}
	            	</ul>
	            </div>
						</div>
					
					
					
				</div>
		</div>
	}
}
