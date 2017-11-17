import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FluxContext } from 'utils/decorators';
import { getTypes } from 'redux/modules/types';
import FluxComponent from 'flummox/component';
import connectToStores from 'flummox/connect';
import MapWrapper from './MapWrapper.jsx';
import Toolbar from './toolbar/Toolbar.jsx';
import Sidebar from './Sidebar.jsx';

@connect(
  state => state.types,
  {
    getTypes,
  }
)
@FluxContext
class MonitorPage extends Component {

  static propTypes = {
    getTypes: PropTypes.func,
  }

  state = {
    availableGpsCodes: [],
  }

  async componentDidMount() {
    this.props.getTypes();
    const { flux } = this.context;
    flux.getActions('points').createConnection();
    flux.getActions('objects').getCars().then(({ result: carsList }) => this.setState({ availableGpsCodes: carsList.map(({ gps_code }) => gps_code) }));
  }

  componentWillUnmount() {
    const { flux } = this.context;
    flux.getActions('points').closeConnection();
  }

  render() {
    if (!this.props.typesList.length || !this.state.availableGpsCodes.length) return <div>Загрузка...</div>;
    const {
      availableGpsCodes,
    } = this.state;
    return (
      <div
        style={{
          position: 'fixed',
          width: '100%',
          top: 0,
          bottom: '30px',
        }}
      >

        <Toolbar />

        <FluxComponent
          connectToStores={{
            points: store => ({
              points: Object.entries(store.state.points).reduce((accPoints, [key, value]) => {
                if (availableGpsCodes.includes(key)) {
                  accPoints[key] = value;
                }
                return accPoints;
              }, {}),
              selected: store.getSelectedPoint(),
            }),
            settings: store => ({
              showPlates: store.state.showPlates,
              showTrack: store.state.showTrack,
              showPolygons: store.state.showPolygons,
              showSelectedElement: store.state.showSelectedElement,
              showMarkers: store.state.showMarkers,
            }),
            session: store => ({
              zoom: store.getCurrentUser().getCompanyMapConfig().zoom,
              center: store.getCurrentUser().getCompanyMapConfig().coordinates,
            }),
            geoObjects: store => ({
              polys: store.getSelectedPolys(),
              selectedFeature: store.getSelectedFeature(),
            }),
          }}
        >

          <MapWrapper />

          <Sidebar />
        </FluxComponent>
      </div>
    );
  }

}

export default connectToStores(MonitorPage);
