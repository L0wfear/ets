import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import connectToStores from 'flummox/connect';

import { FluxContext } from 'utils/decorators';
import GeometryLegendWrapper from 'components/map/LegendWrapper.jsx';

import FluxComponent from 'flummox/component';
import ToolbarSearch from './ToolbarSearch.jsx';
import ToolbarFilters from './ToolbarFilters.jsx';
import CarsLegendWrapper from './items/CarsLegendWrapper';
import ShowGeoobjectsCheckbox from './items/ShowGeoobjectsCheckbox';
import FuelLeak from './items/FuelLeak';

const ShowPlatesCheckbox = props =>
  <div className="app-toolbar-fill app-toolbar-show-govnumber" >
    <div className="checkbox">
      <label style={{ fontSize: '13px', fontWeight: '200' }}>
        <input type="checkbox" checked={props.showPlates} onChange={e => props.flux.getActions('settings').setShowPlates(e.target.checked)} /> Рег. номер ТС
      </label>
    </div>
  </div>;

@connect(
  state => state.types
)
@FluxContext
@autobind
class Toolbar extends Component {

  static get propTypes() {
    return {
      selectedPolysTypes: PropTypes.array,
      filter: PropTypes.object,
    };
  }

  constructor(props, context) {
    super(props, context);
    this._pointsStore = this.context.flux.getStore('points');
  }
  shouldComponentUpdate() {
    // сделать обновление только во время изменений!
    return true;
  }
  componentDidMount() {
    this.context.flux.getActions('companyStructure').getLinearCompanyStructure();
  }
  focusOnLonelyCar() {
    const store = this.context.flux.getStore('points');
    const carPoint = store.getVisiblePoints()[0];
    const map = global.olmap;
    const view = map.getView();
    const size = map.getSize();

    view.centerOn(carPoint.marker.coords, size, [size[0] / 2, size[1] / 2]);
    view.setZoom(15);

    store.handleSelectPoint(carPoint);
    // Это очень жёсткий хак. После выпила флюммокса такое делать не придётся.
    setTimeout(() => {
      store.setTracking(true);
    }, 200);
  }

  render() {
    const { selectedPolysTypes, filter } = this.props;
    const filters = filter;
    const pointsStore = this.context.flux.getStore('points');
    const storeState = pointsStore.state;

    let filtersCount = 0;
    const keys = {
      type: 1,
    };

    for (const key in filters) {
      if (key in keys) {
        filtersCount += filters[key].length;
      }
    }
    const byStatus = storeState.byStatus;
    const byConnectionStatus = storeState.byConnectionStatus;
    const carsCount = Object.keys(byConnectionStatus)
                          .map(k => byConnectionStatus[k])
                          .reduce((a, b) => a + b);
    return (
      <div className="app-toolbar">
        <div className="row">
          <FluxComponent connectToStores={['points', 'settings', 'geoObjects']}>
            <CarsLegendWrapper
              byStatus={byStatus}
              byConnectionStatus={byConnectionStatus}
              storeFilter={storeState.filter}
              storeHandleSetFilter={pointsStore.handleSetFilter}
            />
            <GeometryLegendWrapper
              controlTitles={{
                route: 'Геообъекты',
              }}
              controls={['track', 'route']}
              className="legend-wrapper app-toolbar-fill"
              marker={() => this._pointsStore.getSelectedMarker()}
            />
            <ShowPlatesCheckbox />
            <ShowGeoobjectsCheckbox selectedPolysTypes={selectedPolysTypes} />
            <FuelLeak />
          </FluxComponent>
        </div>
        <ToolbarSearch focusOnLonelyCar={this.focusOnLonelyCar} carsCount={carsCount} />
        <ToolbarFilters store={pointsStore} filters={filters} haveFilters={filtersCount > 0} {...this.props} />
      </div>
    );
  }

}

export default connectToStores(Toolbar, ['objects', 'session', 'points']);
