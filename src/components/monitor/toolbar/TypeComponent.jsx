import React, { Component, PropTypes } from 'react';
import { getIcon } from 'assets/icons/car.js';

export default class TypeComponent extends Component {

  static get propTypes() {
    return {
      item: PropTypes.object,
    };
  }

  render() {
    const type = this.props.item;

    return (
      <span className="car-type-component">
        {type.icon ? <img role="presentation" className="type-filter-icon" src={getIcon(type.icon).src} /> : null}
        {type.title}
      </span>
    );
  }

}
