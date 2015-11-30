import React, { Component } from 'react';
import FluxComponent from 'flummox/component';
import Map from './map/Map.jsx';
import Toolbar from './toolbar/Toolbar.jsx';
import Sidebar from './Sidebar.jsx';
import WeatherWidget from './map/WeatherWidget.jsx';

const MAP_INITIAL_CENTER = [-399.43090337943863, -8521.192605428025];
const MAP_INITIAL_ZOOM = 3;

export default class MainPage extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      showPlates: false
    };
  }

  render() {

    return (
      <div>
        {!this.props.errorLoading && (<FluxComponent connectToStores={['login', 'points']}>
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
