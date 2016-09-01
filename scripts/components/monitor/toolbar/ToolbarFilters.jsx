import React, { Component } from 'react';
import Filter from './Filter.jsx';
import TypeComponent from './TypeComponent.jsx';
import ToolbarControl from './ToolbarControl.js';
import { getTypeById } from 'utils/labelFunctions';


export default class ToolbarFilters extends Component {

  static propTypes = {
    typesList: React.PropTypes.array.isRequired
  }

  render(){

    const currentUser = this.props.currentUser;
    let filters = [];
    let additiveFilters = this.doAdditiveFilters();

    if (additiveFilters === undefined) throw new Error('additive filters is undefined, something went wrong')

    filters.push(
      <Filter key={'filter_basic'}
              name="type"
              title="Тип техники"
              options={additiveFilters.types}
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

  doAdditiveFilters(){

    const propsFilters = this.props.filters;
    const cars = this.props.store.state.points;

    let _types = [];
    let _typeIds = [];

    // фильтруем машины по владельцу и типу
    for ( let key in cars ) {
      let car = cars[key].car;

      if (car === undefined ) continue;
      if (!car.hasOwnProperty('owner_id') ) {
        car.owner_id = 0;
      } // dirty fix

      // если владелец указан
      if ( propsFilters.owner.length > 0 ){
        if ( propsFilters.owner.indexOf(car.owner_id) > -1 && _typeIds.indexOf( car.type_id ) === -1 ){
          _typeIds.push( car.type_id)
        }
      }
    }

    // наполняем селектор типов
    if ( _typeIds.length > 0 ){
      _typeIds.forEach( (id) => _types.push(getTypeById(id)))
    } else {
      _types = this.props.typesList;
    }

    return {
      types: _types,
    }
  }
}
