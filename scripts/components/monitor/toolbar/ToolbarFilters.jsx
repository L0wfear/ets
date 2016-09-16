import React, { Component, PropTypes } from 'react';
import Filter from './Filter.jsx';
import TypeComponent from './TypeComponent.jsx';
import ToolbarControl from './ToolbarControl.jsx';

export default class ToolbarFilters extends Component {

  static propTypes = {
    typesList: PropTypes.array.isRequired,
    typesIndex: PropTypes.object.isRequired,
    filters: PropTypes.object,
  }

  render() {
    const filters = [];
    const additiveFilters = this.doAdditiveFilters();

    if (additiveFilters === undefined) throw new Error('additive filters is undefined, something went wrong');

    filters.push(
      <Filter key={'filter_basic'}
        name="type"
        title="Тип техники"
        options={additiveFilters.types}
        search
        itemComponent={TypeComponent}
        valueComponent={TypeComponent}
      />
    );

    const style = {
      width: '258px',
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

  doAdditiveFilters() {
    const { typesIndex } = this.props;
    const propsFilters = this.props.filters;
    const cars = this.props.store.state.points;

    let _types = [];
    const _typeIds = [];

    // фильтруем машины по владельцу и типу
    for (const key in cars) {
      const car = cars[key].car;
      if (car !== undefined) {
        if (!{}.hasOwnProperty.call(car, 'owner_id')) {
          car.owner_id = 0;
        } // dirty fix

        // если владелец указан
        if (propsFilters.owner.length > 0) {
          if (propsFilters.owner.indexOf(car.owner_id) > -1 && _typeIds.indexOf(car.type_id) === -1) {
            _typeIds.push(car.type_id);
          }
        }
      }
    }

    // наполняем селектор типов
    if (_typeIds.length > 0) {
      _types = _typeIds.map(id => typesIndex[id]);
    } else {
      _types = this.props.typesList;
    }

    return {
      types: _types,
    };
  }
}
