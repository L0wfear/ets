import React, { Component, PropTypes } from 'react';
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

  doAdditiveFilters() {
    const { typesIndex } = this.props;
    const propsFilters = this.props.filters;
    const cars = this.props.store.state.points;

    let types = [];
    const typeIds = [];

    // фильтруем машины по владельцу и типу
    Object.keys(cars).forEach((key) => {
      const car = cars[key].car;
      if (car !== undefined) {
        if (!{}.hasOwnProperty.call(car, 'owner_id')) {
          car.owner_id = 0;
        } // dirty fix

        // если владелец указан
        if (propsFilters.owner.length > 0) {
          if (propsFilters.owner.indexOf(car.owner_id) > -1 && typeIds.indexOf(car.type_id) === -1) {
            typeIds.push(car.type_id);
          }
        }
      }
    });

    // наполняем селектор типов
    if (typeIds.length > 0) {
      types = typeIds.map(id => typesIndex[id]);
    } else {
      types = this.props.typesList;
    }
    types = types.map(t => ({ title: t.short_name, ...t }));
    return {
      types,
    };
  }

  render() {
    const filters = [];
    const additiveFilters = this.doAdditiveFilters();

    if (additiveFilters === undefined) throw new Error('additive filters is undefined, something went wrong');

    filters.push(
      <Filter
        key={'filter_basic'}
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
}
