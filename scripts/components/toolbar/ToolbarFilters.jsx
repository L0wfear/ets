import React, { Component } from 'react';
import Filter from './Filter.jsx';
import types from '../../types.js';
import okrugs from '../../okrugs.js';
import owners from '../../owners.js';
import TypeComponent from './TypeComponent.jsx';

export default class ToolbarFilters extends Component {

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
    if (this.props.haveFilters ){
      c+= ' have-filters'
    }

    return (
      <div className={c}>
        <button className="app-toolbar-btn filters" onClick={this.toggle.bind(this)}></button>
        <div className="toolbar-filters-wrap app-toolbar-fill" style={{display: this.state.visible ? 'block' : 'none', position:'relative',left:42, top:-42, width:'258px'}}>
          <span className="toolbar-filters-wrap__close-btn" onClick={this.toggle.bind(this)}>×</span>
          {filters}
        </div>
      </div>
    )

  }

  toggle(){
    this.setState({visible: !this.state.visible});
  }
}
