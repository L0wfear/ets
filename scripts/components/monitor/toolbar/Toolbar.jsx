import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTypes } from 'redux/modules/types';
import connectToStores from 'flummox/connect';
import cx from 'classnames';
import Filter from './Filter.jsx';
import { FluxContext } from 'utils/decorators';
import { TRACK_COLORS } from 'constants/track.js';
import GeometryLegendWrapper from 'components/map/LegendWrapper.jsx';

import statuses from 'constants/statuses';
import { GEOOBJECTS_TYPES, GEOOBJECTS_TYPES_LABELS } from 'constants/geoobjects';
import FluxComponent from 'flummox/component';
import ToolbarSearch from './ToolbarSearch.jsx';
import ToolbarFilters from './ToolbarFilters.jsx';

let StatusComponent = (props) =>
  <span className={cx({'half-visible': !props.active})}>
    {props.status.color ? <button className={'status-filter-icon'} onClick={props.onClick} style={{ backgroundColor: props.status.color}}></button> : null}
    {props.status.title}
    {props.active ? <span style={{ fontSize: '80%', color: '#aaa' }}> ({props.status.amount})</span> : null}
  </span>
;

// TODO jsdoc
class CarsLegendWrapper extends Component {

  render() {

    let totalOnline = this.props.byConnectionStatus[1];
    let byStatus = this.props.byStatus;

    let filter = this.props.storeFilter;

    let items = statuses
      .map(s => Object.assign({ amount: byStatus[s.id] }, s))
      .map((item, i) => {
        return (
          <li key={i}>
            <StatusComponent active={filter.status.indexOf(item.id) !== -1}
                             status={item}
                             onClick={() => this.toggleFilter(item)}/>
          </li>
        );
      });

    return (
      <div className="legend-wrapper app-toolbar-fill">
        <ul style={{paddingLeft: 0}}>
          <li style={{fontSize: '16px',textAlign: 'center'}}>
            <span> Активно:
              <span>&nbsp;{totalOnline}</span>
            </span>
          </li>
          {items}
        </ul>
      </div>
    );
  }

  toggleFilter(i) {

    let filter = this.props.filter.status.slice();
    let id = i.id;
    let index = filter.indexOf(id);

    if (index === -1 ) {
      filter.push(id);
    } else {
      filter.splice(index, 1);
    }

    this.props.storeHandleSetFilter({
      status: filter
    });

  }
}

let ShowPlatesCheckbox = (props) =>
  <div className="app-toolbar-fill app-toolbar-show-govnumber" >
    <div className="checkbox">
      <label style={{fontSize:'13px', fontWeight:'200'}}>
        <input type="checkbox" checked={props.showPlates} onChange={e => props.flux.getActions('settings').setShowPlates(e.target.checked)}/> Рег. номер ТС
      </label>
    </div>
  </div>
;

let ShowGeoobjectsCheckbox = (props) => {
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

  function setShowGeoobjects(checked) {
    props.flux.getActions('geoObjects').setSelectedPolysType(null);
    props.flux.getActions('settings').setShowGeoobjects(checked);
  }

  const geoObjectsList = ['dt', 'odh', 'ssp', 'msp', 'carpool', 'fueling_water', 'danger_zone', 'pgm_store', 'snow_storage'].map((type, index) => {
    return (
      <li key={index}>
        <div className="checkbox">
          <label style={{fontSize:'13px', fontWeight:'200'}}>
            <input type="checkbox" checked={selectedPolysTypes.indexOf(GEOOBJECTS_TYPES[type]) > -1} onChange={e => setSelectedPolysType(type)}/> {GEOOBJECTS_TYPES_LABELS[type]}
          </label>
        </div>
      </li>
    )
  });

  return (
    <div className="app-toolbar-fill app-toolbar-show-geoobjects" >
      <div className="checkbox">
        <label style={{fontSize:'13px', fontWeight:'200'}}>
          <input type="checkbox" checked={props.showGeoobjects} onChange={e => setShowGeoobjects(e.target.checked)}/> Объекты
        </label>
      </div>
      <ul style={listStyle}>
        {geoObjectsList}
      </ul>
    </div>
  );
}

@connect(
  state => state.types,
  {
    getTypes
  }
)
@FluxContext
class Toolbar extends Component {

  constructor(props, context) {
    super(props, context);
    this._pointsStore = this.context.flux.getStore('points');
  }

  focusOnLonelyCar() {

    let store = this.context.flux.getStore('points');
    let onlyPoint = store.getVisiblePoints()[0];
    let map = olmap;
    let view = map.getView();
    let size = map.getSize();

    view.centerOn(onlyPoint.marker.coords, size, [size[0]/2, size[1]/2])
    view.setZoom(15);
  }

  shouldComponentUpdate(props) {
    // сделать обновление только во время изменений!
    return true;
  }

  componentDidMount() {
    this.props.getTypes();
  }

  render() {

    const { selectedPolysTypes, currentUser, filter } = this.props;
    const filters = filter;
    const pointsStore = this.context.flux.getStore('points');
    const storeState = pointsStore.state;

    let filtersCount = 0;
    let keys = {
      type:  1
    };

    for (let key in filters) {
      if (key in keys){
        filtersCount += filters[key].length;
      }
    }

    let byStatus = storeState.byStatus;
    let byConnectionStatus = storeState.byConnectionStatus;
    let carsCount = Object.keys(byConnectionStatus)
                          .map((k)=>byConnectionStatus[k])
                          .reduce((a, b) => a + b);

    return (
      <div className="app-toolbar">
        <div className="row">
          <FluxComponent connectToStores={['points', 'settings', 'geoObjects']}>
            <CarsLegendWrapper
              byStatus={byStatus}
              byConnectionStatus={byConnectionStatus}
              storeFilter={storeState.filter}
              storeHandleSetFilter={pointsStore.handleSetFilter.bind(pointsStore)}/>
            <GeometryLegendWrapper
              controlTitles={{
                route: 'Геообъекты'
              }}
              controls={['track', 'route']}
              className="legend-wrapper app-toolbar-fill"
              marker={() => this._pointsStore.getSelectedMarker()}/>
            <ShowPlatesCheckbox/>
            <ShowGeoobjectsCheckbox selectedPolysTypes={selectedPolysTypes}/>
          </FluxComponent>
        </div>
        <ToolbarSearch focusOnLonelyCar={this.focusOnLonelyCar.bind(this)} carsCount={carsCount}/>
        <ToolbarFilters store={pointsStore} filters={filters} haveFilters={filtersCount > 0} currentUser={currentUser} {...this.props}/>
      </div>
    );
  }

}

export default connectToStores(Toolbar, ['objects', 'session', 'points']);
