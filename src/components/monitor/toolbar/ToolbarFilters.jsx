import React, { Component, PropTypes } from 'react';
import toArray from 'lodash/toArray';

import Filter from './Filter.jsx';
import TypeComponent from './TypeComponent.jsx';
import ToolbarControl from './ToolbarControl.jsx';

export default class ToolbarFilters extends Component {

  static propTypes = {
    typesList: PropTypes.array.isRequired,
    typesIndex: PropTypes.object.isRequired,
    filters: PropTypes.object,
    haveFilters: PropTypes.bool,
    store: PropTypes.object,
  }
  shouldComponentUpdate(nextProps) {
    /**
     * Предотвращаем постоянное передёргивания мульти-селекта в начальное состояние.
     */
    const shouldUpdate = (
      this.props.typesIndex && nextProps.typesIndex &&
      Object.keys(this.props.typesIndex).length !== Object.keys(nextProps.typesIndex).length
    );

    return shouldUpdate;
  }

  render() {
    const { flux } = this.props.store;
    const filters = [];
    const carTypes = toArray(this.props.typesIndex).map(t => ({ title: t.short_name, ...t }));

    filters.push(
      <Filter
        key={'carTypesFilter'}
        name="type"
        valueField={'asuods_id'}
        title="Тип техники"
        options={carTypes}
        search
        itemComponent={TypeComponent}
        valueComponent={TypeComponent}
      />
    );

    if (flux.getStore('session').state.isOkrug) {
      const orgs = flux.getStore('session').getCurrentUser().companies.map(c => ({ title: c.name, ...c }));
      filters.push(
        <Filter
          key={'ownerFilter'}
          name="owner"
          title="Организации"
          options={orgs}
          search
          itemComponent={TypeComponent}
          valueComponent={TypeComponent}
        />
      );
    }

    const style = {
      width: '300px',
      borderRadius: '0px 6px 6px 6px',
      padding: '18px',
      paddingRight: '30px',
    };

    return (
      <ToolbarControl top="49px" controlType="filters" btnClass={this.props.haveFilters ? 'have-filter' : ''} style={style}>
        {filters}
      </ToolbarControl>
    );
  }
}
