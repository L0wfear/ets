import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import connectToStores from 'flummox/connect';
import cx from 'classnames';
import { FluxContext } from 'utils/decorators';
import GeometryLegendWrapper from 'components/map/LegendWrapper.jsx';

import statuses from 'constants/statuses';
import { GEOOBJECTS_TYPES, GEOOBJECTS_TYPES_LABELS } from 'constants/geoobjects';
import FluxComponent from 'flummox/component';
import ToolbarSearch from './ToolbarSearch.jsx';
import ToolbarFilters from './ToolbarFilters.jsx';

const StatusComponent = props =>
  <span className={cx({ 'half-visible': !props.active })}>
    {props.status.color ? <button className={'status-filter-icon'} onClick={props.onClick} style={{ backgroundColor: props.status.color }} /> : null}
    {props.status.title}
    {props.active ? <span style={{ fontSize: '80%', color: '#aaa' }}> ({props.status.amount})</span> : null}
  </span>
;

// TODO jsdoc
class CarsLegendWrapper extends Component {

  static get propTypes() {
    return {
      filter: PropTypes.object,
      storeHandleSetFilter: PropTypes.func,
      byStatus: PropTypes.object,
      storeFilter: PropTypes.array,
      byConnectionStatus: PropTypes.object,
    };
  }

  toggleFilter(i) {
    const filter = this.props.filter.status.slice();
    const id = i.id;
    const index = filter.indexOf(id);

    if (index === -1) {
      filter.push(id);
    } else {
      filter.splice(index, 1);
    }

    this.props.storeHandleSetFilter({
      status: filter,
    });
  }

  render() {
    const totalOnline = this.props.byConnectionStatus[1];
    const byStatus = this.props.byStatus;

    const filter = this.props.storeFilter;

    const items = statuses
      .map(s => Object.assign({ amount: byStatus[s.id] }, s))
      .map((item, i) =>
         (
           <li key={i}>
             <StatusComponent
               active={filter.status.indexOf(item.id) !== -1}
               status={item}
               onClick={() => this.toggleFilter(item)}
             />
           </li>
        )
      );
    return (
      <div className="legend-wrapper app-toolbar-fill">
        <ul style={{ paddingLeft: 0 }}>
          <li style={{ fontSize: '16px' }}>
            <span className={cx({ 'half-visible': !this.props.storeFilter.status.length })}>
              <button
                className={'status-filter-icon'}
                onClick={() => this.props.storeHandleSetFilter({
                  status: !this.props.storeFilter.status.length ? [1, 2, 3, 4] : [],
                })}
                style={{ backgroundColor: 'white' }}
              />
              Активно:
              <span>&nbsp;{totalOnline}</span>
            </span>
          </li>
          {items}
        </ul>
      </div>
    );
  }
}

const ShowPlatesCheckbox = props =>
  <div className="app-toolbar-fill app-toolbar-show-govnumber" >
    <div className="checkbox">
      <label style={{ fontSize: '13px', fontWeight: '200' }}>
        <input type="checkbox" checked={props.showPlates} onChange={e => props.flux.getActions('settings').setShowPlates(e.target.checked)} /> Рег. номер ТС
      </label>
    </div>
  </div>
;

const ShowGeoobjectsCheckbox = (props) => {
  const { selectedPolysTypes } = props;
  const showGeoobjectsList = props.showGeoobjects;
  const listStyle = {};
  if (!showGeoobjectsList) {
    listStyle.display = 'none';
  }

  function setSelectedPolysType(type) {
    const alreadyChecked = selectedPolysTypes.indexOf(GEOOBJECTS_TYPES[type]) > -1;
    if (!alreadyChecked) {
      props.flux.getActions('geoObjects').getGeozoneByTypeWithGeometry(type);
    }
    props.flux.getActions('geoObjects').setSelectedPolysType(GEOOBJECTS_TYPES[type]);
  }

  function setShowGeoobjects(show) {
    props.flux.getActions('geoObjects').setSelectedPolysType(null);
    props.flux.getActions('settings').setShowGeoobjects(show);
  }

  function selectAllGeoobjects(checked) {
    ['dt', 'odh', 'ssp', 'msp', 'carpool', 'fueling_water', 'danger_zone', 'pgm_store', 'snow_storage']
      .filter(g => checked ? selectedPolysTypes.indexOf(GEOOBJECTS_TYPES[g]) === -1 : selectedPolysTypes.indexOf(GEOOBJECTS_TYPES[g]) > -1)
      .forEach(g => setSelectedPolysType(g));
  }

  const allSelected = selectedPolysTypes.length === Object.keys(GEOOBJECTS_TYPES).length;
  const geoObjectsList = ['dt', 'odh', 'ssp', 'msp', 'carpool', 'fueling_water', 'danger_zone', 'pgm_store', 'snow_storage'].map((type, index) =>
     (
       <li key={index}>
         <div className="checkbox">
           <label style={{ fontSize: '13px', fontWeight: '200' }}>
             <input
               type="checkbox"
               checked={selectedPolysTypes.indexOf(GEOOBJECTS_TYPES[type]) > -1}
               onChange={() => setSelectedPolysType(type)}
             />
             {GEOOBJECTS_TYPES_LABELS[type]}
           </label>
         </div>
       </li>
    )
  );

  return (
    <div className="app-toolbar-fill app-toolbar-show-geoobjects" >
      <div className="checkbox">
        <input
          style={{ marginLeft: 0 }}
          type="checkbox"
          checked={allSelected}
          onChange={e => selectAllGeoobjects(e.target.checked)}
        />
        <label style={{ fontSize: '13px', fontWeight: '200', paddingLeft: 0, marginLeft: 20 }} onClick={() => setShowGeoobjects(!props.showGeoobjects)}>
          Объекты
          <span style={{ fontSize: 10, marginLeft: 3 }}>{props.showGeoobjects ? ' \u25BC' : ' \u25BA'}</span>
        </label>
      </div>
      <ul style={listStyle}>
        {geoObjectsList}
      </ul>
    </div>
  );
};

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

  focusOnLonelyCar() {
    const store = this.context.flux.getStore('points');
    const onlyPoint = store.getVisiblePoints()[0];
    const map = olmap;
    const view = map.getView();
    const size = map.getSize();

    view.centerOn(onlyPoint.marker.coords, size, [size[0] / 2, size[1] / 2]);
    view.setZoom(15);
  }

  shouldComponentUpdate() {
    // сделать обновление только во время изменений!
    return true;
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
          </FluxComponent>
        </div>
        <ToolbarSearch focusOnLonelyCar={this.focusOnLonelyCar} carsCount={carsCount} />
        <ToolbarFilters store={pointsStore} filters={filters} haveFilters={filtersCount > 0} {...this.props} />
      </div>
    );
  }

}

export default connectToStores(Toolbar, ['objects', 'session', 'points']);
