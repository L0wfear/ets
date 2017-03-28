import React, { Component } from 'react';
import { makeDate, makeTime } from 'utils/dates';
import { getStatusById } from 'constants/statuses';
import { roundCoordinates } from 'utils/geo';

export default class VehicleAttributes extends Component {

  constructor(props) {
    super(props);

    this.state = {
      attributes: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.car) return;
    this.setState(state => (state.attributes = this.parseProps(nextProps)));
  }

  parseProps(props) {
    const { point, car } = props;
    const attributes = [];
    const addAttribute = (name, value) => {
      if (typeof value !== 'undefined') {
        attributes.push({
          name,
          value,
        });
      }
    };

    const makeLastPointString = (p) => {
      const dt = new Date(p.timestamp * 1000);
      return `${makeDate(dt)} ${makeTime(dt, true)} [${roundCoordinates(point.coords_msk)}]`;
    };
    addAttribute('Рег. номер ТС', car.gov_number);
    addAttribute('ID БНСО', point.id);
    getStatusById(point.status) && addAttribute('Статус', getStatusById(point.status).title);
    addAttribute('Тип техники', car.type_name);
    addAttribute('Шасси', car.model_name);

    if (props.lastPoint) {
      // todo при клике на "последнюю точку" центрировать по координатам
      addAttribute('Последняя точка', makeLastPointString(props.lastPoint));
    } else {
      addAttribute('Последняя точка', makeLastPointString({
        timestamp: point.timestamp,
        coords_msk: point.coords_msk,
      }));
    }

    return attributes;
  }

  renderAttribute({ name, value }) {
    return (
      <div key={name} className="vehicle-attributes-list__item">
        {name}: <span className="value">{value}</span>
      </div>
    );
  }

  render() {
    return (
      <div className="vehicle-attributes-list">
        {this.state.attributes.length ? this.state.attributes.map(attribute => this.renderAttribute(attribute)) : 'Нет данных'}
      </div>
    );
  }
}
