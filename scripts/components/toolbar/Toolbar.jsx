import React, { Component } from 'react';
import Filter from './Filter.jsx';

import { getIcon } from '../../icons/index.js';

import statuses from '../../statuses.js';
import types from '../../types.js';
import owners from '../../owners.js';
import customers from '../../customers.js';
import okrugs from '../../okrugs.js';
import FluxComponent from 'flummox/component';

class TypeComponent extends Component {

  render() {
    const type = this.props.item;

    return (
      <span>
        {type.icon ? <img className="type-filter-icon" src={getIcon(type.icon).url}/> : null}
        {type.title}
      </span>
    );
  }

}

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
    let items = statuses //.concat(connectionStatuses)
      .map(s => Object.assign({ amount: byStatus[s.id] }, s))
      .map(i => {
        return (
          <li>
            <StatusComponent active={filter.indexOf(i.id) !== -1} item={i} onClick={() => this.toggleFilter(i)}/>
          </li>
        );
      });

    return (
      <div className="col-sm-2 legend-wrapper">
        <ul>{items}</ul>
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

class OwnerFilterWrapper extends Component {

  render() {
    var okrugs = this.props.filter.okrug;
    var options = owners;

    if (okrugs.length > 0) {
      options = options.filter(o => okrugs.indexOf(o.okrug) !== -1);
    }


    return (
      <Filter name="owner"
              title="Владелец"
              options={options}
              search={true}/>
    );
  }

}

class ShowPlatesCheckbox {

  render() {
    return (
      <div className="col-sm-2">
        <div className="checkbox" style={{ marginTop: 15 }}>
          <label>
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
    const filters = [];

    filters.push(
      <Filter name="type"
              title="Тип техники"
              options={types}
              search={true}
              itemComponent={TypeComponent}
              valueComponent={TypeComponent}/>
    );

    if (currentUser.role === 'mayor') {
      filters.push(
        <Filter name="okrug"
                title="Округ"
                options={okrugs}
                search={true}/>
      );
    }

    if (currentUser.role === 'mayor' || currentUser.role === 'prefect') {
      filters.push(
        <FluxComponent connectToStores={['points']}>
          <OwnerFilterWrapper/>
        </FluxComponent>
      );
    }

  /*  filters.push(
      <Filter name="own"
              title="Принадлежность"
              options={[{ id: null, title: 'Все'}, { id: 1, title: 'Собственная'}, { id: 0, title: 'Привлеченная'}]}/>
    );*/


    filters.push(
      <FluxComponent connectToStores={['points']}>
        <LegendWrapper/>
      </FluxComponent>
    );

    return (
      <div className="app-toolbar" style={{ paddingLeft: 30 }}>
        <div className="row tools">
          {filters}
          <FluxComponent connectToStores={['points']}>
            <ShowPlatesCheckbox/>
          </FluxComponent>
        </div>
      </div>
    );
  }

}

export default Toolbar;
