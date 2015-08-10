import React, { Component } from 'react';
import Filter from './Filter.jsx';
import types, {getTypeById} from '../../types.js';
import okrugs, {getOkrugById} from '../../okrugs.js';
import owners, {getOwnerById} from '../../owners.js';
import TypeComponent from './TypeComponent.jsx';
import ToolbarControl from './ToolbarControl.js';


export default class ToolbarFilters extends Component {

  render(){

    const currentUser = this.props.currentUser;
    const filters = [];
    const additiveFilters = this.doAdditiveFilters();

    if (currentUser.role === 'mayor' || currentUser.role === 'prefect') {
      filters.push(
        <Filter name="owner"
                title="Владелец"
                options={additiveFilters.owners}
                search={true}
          />
      );
    }

    if (currentUser.role === 'mayor') {
      filters.push(
        <Filter name="okrug"
                title="Округ"
                options={additiveFilters.okrugs}
                search={true}/>
      );
    }

    filters.push(
      <Filter name="type"
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
    const cars = this.props.store.getFilteredPoints();

    let _okrugIds = [];
    let _okrugs = [];
    let _types = [];
    let _typeIds = [];
    let _owners = [];
    let possibleOwners = [];

    // если указан хотя бы один владелец
    if ( propsFilters.owner.length > 0 ){
      owners.forEach((owner) => {
        if ( propsFilters.owner.indexOf(owner.id) > -1 ){
          owner.okrugs.forEach( (okrugId) => {
            _okrugIds.push( okrugId)
          })
        }
      })
      _okrugIds.forEach( (okrugId) => _okrugs.push( getOkrugById(okrugId)))

      _owners = owners;
    } else {
      // если владелец не указан, но указан округ
      if ( propsFilters.okrug.length > 0 ) {
        // реверсивно находим возможных владельцев
        // чтобы отфильтровать типы машин
        owners.forEach((owner) => {
          propsFilters.okrug.forEach((okrugId) => {
            if ( owner.okrugs.indexOf(okrugId) > -1 ){
              possibleOwners.push(owner.id);
            }
          })
        })
        _owners = possibleOwners.map( (id) => getOwnerById(id) );
      } else {
        _owners = owners;
      }
      // если не указан ни округ, ни владелец
      // ну и ваще
      _okrugs = okrugs;
    }

    // фильтруем машины по владельцу и типу
    for ( let key in cars ) {
      let car = cars[key].car;

      if (car.owner_id === undefined) car.owner_id = -1; // dirty fix

      // если владелец указан
      if ( propsFilters.owner.length > 0 ){
        if ( propsFilters.owner.indexOf(car.owner_id) > -1 && _typeIds.indexOf( car.type_id ) === -1 ){
          _typeIds.push( car.type_id)
        }
      } else {
        // если владелец не указан
        if ( possibleOwners.indexOf(car.owner_id) > -1 && _typeIds.indexOf(car.type_id) === -1){
          _typeIds.push( car.type_id)
        }
      }
    }

    // наполняем селектор типов
    if ( _typeIds.length > 0 ){
      _typeIds.forEach( (id) => _types.push( getTypeById(id)) )
    } else {
      _types = types;
    }

    return {
      owners: _owners,
      types: _types,
      okrugs: _okrugs
    }
  }
}
