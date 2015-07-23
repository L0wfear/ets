import React, { Component } from 'react';
import Panel from './Panel.jsx';
import { getModelById } from '../models.js';
import { getStatusById } from '../statuses.js';
import { getTypeById } from '../types.js';
import { getOwnerById } from '../owners.js';
import { getCustomerById } from '../customers.js';

import config from '../config.js';

class CarInfo extends Component {

  render() {
    let car = this.props.car;

    if (!car) {
      return null;
    }

    let plate = car.car[0];


    return (
      <div>
        <h2 style={{ fontWeight: 200, textAlign: 'center' }}>{plate}</h2>
        {this.renderModel()}
        {this.renderData()}
      </div>
    );
  }

  renderModel() {
    let car = this.props.car;
    let modelId = car.car[2];

    let model = getModelById(modelId);

    if (!model || !model.image || !model.image.length)
      return null;

    return (
      <Panel title={model.title}>
        <img src={config.images + model.image}
             style={{ margin: 10, width: 400 }}/>
      </Panel>
    );
  }

  renderData() {
    let car = this.props.car;
    let ccar = car.car;

    let props = [];

     if (ccar[0] && ccar[0].length) {
       props.push({
         key: 'Гос. номер',
         value: ccar[0]
       });
     }

    if (car['id'] && car['id'].length) {
      props.push({
        key: 'ID БНСО',
        value: car['id']
      });
    }

    props.push({
      key: 'Статус',
      value: getStatusById(car.status).title
    });

    if (ccar[1] && getTypeById(ccar[1])) {
      props.push({
        key: 'Тип техники',
        value: getTypeById(ccar[1]).title
      });
    }

    if (ccar[2] && getModelById(ccar[2])) {
      props.push({
        key: 'Шасси',
        value: getModelById(ccar[2]).title
      });
    }

    if (ccar[3] && getOwnerById(ccar[3])) {
      props.push({
        key: 'Владелец',
        value: getOwnerById(ccar[3]).title
      });
    }

    if (ccar[4] && getCustomerById(ccar[4])) {
      props.push({
        key: 'Заказчик',
        value: getCustomerById(ccar[4]).title
      });
    }

    return (
      <Panel title="Данные">
        {props.map(p => <div style={{ textAlign: 'left', fontWeight: 200}}>{p.key}: <span style={{color:'#666', fontSize: 15}}>{p.value}</span></div>)}
      </Panel>
    );
  }

}

export default CarInfo;
