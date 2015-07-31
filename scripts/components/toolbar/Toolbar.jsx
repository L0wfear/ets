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
          <li>
            <span>
              <span style={{marginLeft: 20}}>&nbsp;</span>
              Активно:
              <span style={{ fontSize: '80%' }}>&nbsp;{TOTAL_ONLINE}</span>
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
      <div className="app-toolbar-fill" >
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

    return (
      <div className="app-toolbar">
        <div className="row">
          <FluxComponent connectToStores={['points']}>
            <LegendWrapper/>
            <ShowPlatesCheckbox/>
          </FluxComponent>
        </div>
        <ToolbarSearch/>
        <ToolbarFilters currentUser={currentUser}/>
      </div>
    );
  }

}

class ToolbarSearch extends Component {

  constructor(props){
    super(props);
    this.state = { visible : false }
  }

  render(){
    let c = this.state.visible ? 'toolbar-search toggled' : 'toolbar-search';
    return (
      <div className={c}>
        <button className="app-toolbar-btn search" onClick={this.toggle.bind(this)}></button>
        <div className="app-toolbar-fill" style={{display: this.state.visible ? 'block' : 'none', position:'relative',left:42, top:-42 }}>
          <Filter className="bnso-filter" name="bnso_gos"/>
        </div>
      </div>
    )
  }

  toggle(){
    this.setState({visible: !this.state.visible});
  }

}

class ToolbarFilters extends Component {

  constructor(props) {
    super(props);
    this.state = {visible: false};
  }

  render(){

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
        <Filter name="owner"
                title="Владелец"
                options={owners}
                search={true}/>
      );
    }


    let c = this.state.visible ? 'toolbar-filters toggled' : 'toolbar-filters';
    return (
      <div className={c}>
        <button className="app-toolbar-btn filters" onClick={this.toggle.bind(this)}></button>
        <div className="toolbar-filters-wrap app-toolbar-fill" style={{display: this.state.visible ? 'block' : 'none', position:'relative',left:42, top:-42 }}>
          {filters}
        </div>
      </div>
    )

  }

  toggle(){
    this.setState({visible: !this.state.visible});
  }
}

export default Toolbar;
