import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Filter from './Filter.jsx';
import { FluxContext } from '../../decorators/index.js';
import cx from 'classnames';

import statuses from '../../../statuses.js';
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


class LegendWrapper extends Component {

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
        <input type="checkbox" checked={props.showPlates} onChange={e => props.flux.getActions('settings').setShowPlates(e.target.checked)}/> Номер ТС
      </label>
    </div>
  </div>
;

@FluxContext
class Toolbar extends Component {

  constructor(props, context) {
    super(props, context);
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
    this.context.flux.getActions('objects').getTypes();
  }

  render() {

    const currentUser = this.props.currentUser;
    const filters = this.props.filter;
    const pointsStore = this.context.flux.getStore('points');
    const storeState = pointsStore.state;

    let filtersCount = 0;
    let keys = {
      type:  1,
     // okrug: 1,
     // owner: 1
    };

    for (let key in filters) {
      if (key in keys){
        filtersCount += filters[key].length;
      }
    }

    let additiveFilters = {
      owner: filters.owner,
      okrug: filters.okrug,
      type: filters.type
    }

    let byStatus = storeState.byStatus;
    let byConnectionStatus = storeState.byConnectionStatus;
    let carsCount = Object.keys(byConnectionStatus)
                          .map((k)=>byConnectionStatus[k])
                          .reduce((a, b) => a + b);

    return (
      <div className="app-toolbar">
        <div className="row">
          <FluxComponent connectToStores={['points', 'settings']}>
            <LegendWrapper
                byStatus={byStatus}
                byConnectionStatus={byConnectionStatus}
                storeFilter={storeState.filter}
                storeHandleSetFilter={pointsStore.handleSetFilter.bind(pointsStore)}/>
            <ShowPlatesCheckbox/>
          </FluxComponent>
        </div>
        <ToolbarSearch focusOnLonelyCar={this.focusOnLonelyCar.bind(this)} carsCount={carsCount}/>
        <ToolbarFilters store={pointsStore} filters={additiveFilters} haveFilters={filtersCount > 0} currentUser={currentUser} {...this.props}/>
      </div>
    );
  }

}

export default connectToStores(Toolbar, ['objects', 'session', 'points']);
