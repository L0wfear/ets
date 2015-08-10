import React, { Component } from 'react';
import Filter from './Filter.jsx';
import { getIcon } from '../../icons/index.js';

export default class TypeComponent extends Component {

  render() {
    const type = this.props.item;

    return (
      <span className="car-type-component">
        {type.icon ? <img className="type-filter-icon" src={getIcon(type.icon).src}/> : null}
        {type.title}
      </span>
    );
  }

}
