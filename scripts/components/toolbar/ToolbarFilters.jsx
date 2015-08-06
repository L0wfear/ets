import React, { Component } from 'react';
import Filter from './Filter.jsx';
import types from '../../types.js';
import okrugs from '../../okrugs.js';
import owners from '../../owners.js';
import TypeComponent from './TypeComponent.jsx';
import ToolbarControl from './ToolbarControl.js';

export default class ToolbarFilters extends Component {

  render(){

    const currentUser = this.props.currentUser;
    const filters = [];

    if (currentUser.role === 'mayor' || currentUser.role === 'prefect') {
      filters.push(
        <Filter name="owner"
                title="Владелец"
                options={owners}
                search={true}/>
      );
    }

    if (currentUser.role === 'mayor') {
      filters.push(
        <Filter name="okrug"
                title="Округ"
                options={okrugs}
                search={true}/>
      );
    }

    filters.push(
      <Filter name="type"
              title="Тип техники"
              options={types}
              search={true}
              itemComponent={TypeComponent}
              valueComponent={TypeComponent}/>
    );

    let style = {
      width: '258px',
      borderRadius: '0px 6px 6px 6px',
      padding: '18px',
      paddingRight: '30px'
    };

    return (
      <ToolbarControl top="49px" controlType="filters" btnClass={this.props.haveFilters ? 'have-filter' : ''} style={style}>
        {filters}
      </ToolbarControl>
    )

  }
}
