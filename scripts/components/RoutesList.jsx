import React, {Component} from 'react';
import Griddle from 'griddle-react';
import { getRoadsActual, getRoadByODHId } from '../adapter.js';
import Map from './map/Map.jsx';
import classname from 'classnames';

let ACTUAL_ROADS = [];

const MAP_INITIAL_CENTER = [-399.43090337943863, -8521.192605428025];
const MAP_INITIAL_ZOOM = 3;

getRoadsActual().then(r => {
	ACTUAL_ROADS = r;
	console.log( 'actual roads loaded', ACTUAL_ROADS)
});

let fakeRoutes = [
	{
		id: 1,
		name: 'Крылатское маршрут 1 (ПУ-зима)',
		image: '/images/routes/1_zima.jpg',
		odhs: []
	},
	{
		id:2,
		name: 'Крылатское маршрут 2 (ПЩ-зима)',
		image: '/images/routes/2_zima_psch.jpg',
		odhs: [10000259,10005327,10000260,10005328,10005332,10000257,10000262,10000272,10000258,10000261,10005331,10005330]
	},
	{
		id: 4,
		name: 'Крылатское маршрут 4 (зима)',
		image: '/images/routes/4_zima.jpg',
		odhs: []
	}
]

export default class RoutesList extends Component {

	constructor(props) {
		super(props);

		this.state = {
			selectedRoute: fakeRoutes[0],
			activeTab: 'image'
		}
	}

	selectRoute(id) {

		_.each(fakeRoutes, (route) => {
			if (route.id === id ) {
				this.setState({
					selectedRoute: route
				})

				if (route.odhs.length > 0) {
					route.polys = [];
					route.odhs.forEach((odhID) => getRoadByODHId(odhID).then(r => route.polys.push(r)))
					console.log('есть список ОДХ')
				}
			}
		})

	}

	changeTab(tabName) {
		this.setState({
			activeTab: tabName
		})

		if (tabName === 'map') {
			setTimeout(()=> olmap.updateSize(), 1000);
		}
	}

	render() {

		let route = this.state.selectedRoute;
		let state = this.state;
		let routesList = fakeRoutes.map((route) => {
			let cn = "list-group-item" + (route.id === this.state.selectedRoute.id ? " active" : "");
			return <li className={cn} onClick={this.selectRoute.bind(this, route.id)} key={route.id}>{route.name}</li>
		})

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
				</div>
				<div className="routes-list-info">
					<div className="route-name">
						{route.name}
					</div>
					<ul className="nav nav-tabs">
					  <li role="presentation" className={classname({active : state.activeTab === 'image'})} onClick={this.changeTab.bind(this, 'image')}><a href="javascript:;">Картинкой</a></li>
					  <li role="presentation" className={classname({active : state.activeTab === 'map'})} onClick={this.changeTab.bind(this, 'map')}><a href="javascript:;">На карте (при наличии списка ОДХ)</a></li>
					</ul>
					{
						this.state.activeTab === 'image' ?
						<div className="route-image">
							<img src={route.image} width="800"/>
						</div>
						:
						<div className="route-odhs-on-map">
						
							<Map 
									noMarkers={true} 
									zoom={MAP_INITIAL_ZOOM}
	               center={MAP_INITIAL_CENTER}/>
						</div>
					}
					
					
				</div>
		</div>
	}
}
