import React, { Component } from 'react';
import FluxComponent from 'flummox/component';
import connectToStores from 'flummox/connect';
import Map from '../map/Map.jsx';
import Toolbar from '../toolbar/Toolbar.jsx';
import Sidebar from './Sidebar.jsx';
import WeatherWidget from '../map/WeatherWidget.jsx';
import { FluxContext } from '../decorators/index.js';

const MAP_INITIAL_CENTER = [-399.43090337943863, -8521.192605428025];
const MAP_INITIAL_ZOOM = 3;

@FluxContext
class MonitorPage extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      showPlates: false
    };
  }

  componentDidMount() {
    this.context.flux.getActions('points').createConnection();
  }

  componentWillUnmount() {
    this.context.flux.getActions('points').closeConnection();
  }

  render() {

    console.log(this.props);

    return (
      <div>
        {!this.props.errorLoading && (<FluxComponent connectToStores={['session', 'points']}>
          <Toolbar/>
        </FluxComponent>
        )}

        <FluxComponent connectToStores={{
          points: store => ({
            points: store.state.points,
            selected: store.getSelectedPoint(),
            showPlates: store.state.showPlates
          })
        }}>

          <Map errorLoading={this.props.errorLoading}
               zoom={MAP_INITIAL_ZOOM}
               center={MAP_INITIAL_CENTER}/>

          <Sidebar/>
        </FluxComponent>
        <WeatherWidget/>
      </div>
    );
  }

}

export default connectToStores(MonitorPage);
