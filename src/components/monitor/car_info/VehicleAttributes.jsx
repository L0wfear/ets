import React, { Component } from 'react';
import { makeDate, makeTime } from 'utils/dates';
import { getStatusById } from 'constants/statuses';
import { roundCoordinates } from 'utils/geo';

const makeLastPointString = (p) => {
  const dt = new Date(p.timestamp * 1000);
  return `${makeDate(dt)} ${makeTime(dt, true)} [${roundCoordinates(p.coords_msk)}]`;
};

const addAttributeToTarget = (target, name, value) => {
  if (typeof value !== 'undefined') {
    target.push({
      name,
      value,
    });
  }
};

const getState = (props) => {
  const {
    car,
    lastPoint,
  } = props;

  if (!car) {
    return {};
  }

  const { point } = props;
  const attributes = [];

  if (props.isOkrug) {
    addAttributeToTarget(attributes, 'Организация', car.company_name);
  }
  addAttributeToTarget(attributes, 'Рег. номер ТС', car.gov_number);
  addAttributeToTarget(attributes, 'Гаражный номер', car.garage_number);

  addAttributeToTarget(attributes, 'ID БНСО', point.id);
  getStatusById(point.status) && addAttributeToTarget(attributes, 'Статус', getStatusById(point.status).title);
  addAttributeToTarget(attributes, 'Тип техники', car.type_name);
  addAttributeToTarget(attributes, 'Шасси', car.model_name);
  addAttributeToTarget(attributes, 'Последняя точка', lastPoint ? makeLastPointString(lastPoint) : 'Загрузка');

  return {
    attributes,
    car,
    lastPoint,
  };
};

export default class VehicleAttributes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      attributes: [],
      car: null,
      lastPoint: null,
      point: null,
      ...getState(props),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.car !== nextProps.car || nextProps.lastPoint !== this.state.lastPoint || nextProps.point !== this.state.point) {
      this.setState({ ...getState(nextProps) });
    }
  }

  renderAttribute = ({ name, value }) => {
    return (
      <div key={name} className="vehicle-attributes-list__item">
        {name}: <span className="value">{value}</span>
      </div>
    );
  }

  render() {
    return (
      <div className="vehicle-attributes-list">
        {this.state.attributes.length ? this.state.attributes.map(this.renderAttribute) : 'Нет данных'}
      </div>
    );
  }
}
