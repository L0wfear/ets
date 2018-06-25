import * as React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FluxContext } from 'utils/decorators';
import { getTypes } from 'redux/modules/types';
import FluxComponent from 'flummox/component';
import connectToStores from 'flummox/connect';
import triggerOnChangeCompany from 'components/compositions/vokinda-hoc/trigger-on-change-company/triggerOnChangeCompany';
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
class MonitorPage extends React.Component {

  static propTypes = {
    getTypes: PropTypes.func,
  }

  async componentDidMount() {
    this.props.getTypes();
    const { flux } = this.context;
    await Promise.all([
      flux.getActions('geoObjects').getOdhMkad(),
      flux.getActions('objects').getCars(),
    ]);
    flux.getActions('points').createConnection();
  }

  componentWillUnmount() {
    const { flux } = this.context;
    flux.getActions('points').closeConnection();
    flux.getActions('geoObjects').setInitialState();
    flux.getActions('points').setInitialState();
    flux.getActions('settings').setInitialState();
  }

  render() {
    if (!this.props.typesList.length) return <div>Загрузка...</div>;

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
              points: store.state.points,
              selected: store.getSelectedPoint(),
              filter: store.state.filter,
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
              polys: store.getSelectedPolys('selectedPolysTypes'),
              polysLeak: store.getSelectedPolys('selectedPolysTypesLeak'),
              selectedFeature: store.getSelectedFeature('selectedFeature'),
              selectedFeatureLeak: store.getSelectedFeature('selectedFeatureLeak'),
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

export default triggerOnChangeCompany(connectToStores(MonitorPage));
