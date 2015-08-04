import React, { Component } from 'react';
import Filter from './Filter.jsx';

import statuses from '../../statuses.js';
import types from '../../types.js';
import owners from '../../owners.js';
import customers from '../../customers.js';
import okrugs from '../../okrugs.js';
import FluxComponent from 'flummox/component';
import ToolbarSearch from './ToolbarSearch.jsx';
import ToolbarFilters from './ToolbarFilters.jsx';


class StatusComponent extends Component {

  render() {
    const status = this.props.item;
    const active = this.props.active;

    if (!active) {
      return this.renderNotActive();
    }

    return (
      <span>
        {status.color ? <button className="status-filter-icon" onClick={this.onClick.bind(this)} style={{ backgroundColor: status.color}}></button> : null}
        {status.title}
        <span style={{ fontSize: '80%', color: '#aaa' }}> ({status.amount})</span>
      </span>
    );
  }

  renderNotActive() {
    const status = this.props.item;

    return (
      <span style={{ opacity: 0.5 }}>
        {status.color ? <button className="status-filter-icon" onClick={this.onClick.bind(this)} style={{ backgroundColor: status.color}}></button> : null}
        {status.title}
      </span>
    );
  }

  onClick() {
    this.props.onClick();
  }

}


class LegendWrapper extends Component {

  render() {
    let byStatus = this.props.byStatus;
    let filter = this.props.filter.status;
    let items = statuses
      .map(s => Object.assign({ amount: byStatus[s.id] }, s))
      .map(i => {
        return (
          <li>
            <StatusComponent active={filter.indexOf(i.id) !== -1} item={i} onClick={() => this.toggleFilter(i)}/>
          </li>
        );
      });


    let TOTAL_ONLINE = this.props.totalOnline;
    return (
      <div className="legend-wrapper app-toolbar-fill">
        <ul style={{'padding-left': '0'}}>
          <li style={{fontSize: '16px',textAlign: 'center'}}>
            <span> Активно:
              <span>&nbsp;{TOTAL_ONLINE}</span>
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

    this.props.flux.getActions('points').setFilter({
      status: filter
    });

  }
}

class ShowPlatesCheckbox {

  render() {
    return (
      <div className="app-toolbar-fill app-toolbar-show-govnumber" >
        <div className="checkbox">
          <label style={{fontSize:'13px', fontWeight:'200'}}>
            <input type="checkbox" checked={this.props.showPlates} onChange={e => this.props.flux.getActions('points').setShowPlates(e.target.checked)}/> Номер ТС
          </label>
        </div>
      </div>
    );
  }

}

class Toolbar extends Component {

  render() {

    const currentUser = this.props.currentUser;

    let filtersCount = 0;
    let keys = {'type':1, 'okrug':1, 'owner':1};

    for (let key in this.props.filter) {
      if (key in keys){
        filtersCount += this.props.filter[key].length;
      }
    }

    return (
      <div className="app-toolbar">
        <div className="row">
          <FluxComponent connectToStores={['points']}>
            <LegendWrapper/>
            <ShowPlatesCheckbox/>
          </FluxComponent>
        </div>
        <ToolbarSearch/>
        <ToolbarFilters haveFilters={filtersCount > 0} currentUser={currentUser}/>
      </div>
    );
  }

}


export default Toolbar;
