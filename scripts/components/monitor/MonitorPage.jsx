import React, { Component } from 'react';
import FluxComponent from 'flummox/component';
import connectToStores from 'flummox/connect';
import Map from '../map/Map.jsx';
import Toolbar from './toolbar/Toolbar.jsx';
import Sidebar from './Sidebar.jsx';
import WeatherWidget from '../map/WeatherWidget.jsx';
import { FluxContext } from '../decorators/index.js';

const MAP_INITIAL_CENTER = [6000,0]//[-199.43090337943863, -8521.192605428025];
const MAP_INITIAL_ZOOM = 3;

@FluxContext
class MonitorPage extends Component {

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.context.flux.getActions('points').createConnection();
  }

  componentWillUnmount() {
    this.context.flux.getActions('points').closeConnection();
  }

  render() {

    return (
      <div>

        <Toolbar/>

        <FluxComponent connectToStores={{
          points: store => ({
            points: store.state.points,
            selected: store.getSelectedPoint()
          }),
          settings: store => ({
            showPlates: store.state.showPlates
          }),
          session: store => ({
            zoom: store.getCurrentUser().getCompanyMapConfig().zoom,
            center: store.getCurrentUser().getCompanyMapConfig().coordinates,
          })
        }}>

          <Map/>

          <Sidebar/>
        </FluxComponent>
        <WeatherWidget/>
      </div>
    );
  }

}

export default connectToStores(MonitorPage);
