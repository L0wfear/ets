import React, { Component } from 'react';
import FluxComponent from 'flummox/component';
import connectToStores from 'flummox/connect';
import MapWrapper from './MapWrapper.jsx';
import Toolbar from './toolbar/Toolbar.jsx';
import Sidebar from './Sidebar.jsx';
import WeatherWidget from '../map/WeatherWidget.jsx';
import { FluxContext } from 'utils/decorators';

@FluxContext
class MonitorPage extends Component {

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('objects').getCars();
    flux.getActions('points').createConnection();
  }

  componentWillUnmount() {
    const { flux } = this.context;
    flux.getActions('points').closeConnection();
  }

  openSideBar() {

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
            showPlates: store.state.showPlates,
            showTrack: store.state.showTrack,
            showPolygons: store.state.showPolygons,
            showSelectedElement: store.state.showSelectedElement,
            showMarkers: store.state.showMarkers
          }),
          session: store => ({
            zoom: store.getCurrentUser().getCompanyMapConfig().zoom,
            center: store.getCurrentUser().getCompanyMapConfig().coordinates,
          }),
          geoObjects: store => ({
            polys: store.getSelectedPolys(),
            selectedFeature: store.getSelectedFeature()
          })
        }}>

          <MapWrapper/>

          <Sidebar/>
        </FluxComponent>
        <WeatherWidget/>
      </div>
    );
  }

}

export default connectToStores(MonitorPage);
