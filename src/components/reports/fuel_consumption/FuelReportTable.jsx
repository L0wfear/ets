import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

const tableMeta = {
  cols: [
    {
      name: 'car_model_name',
      displayName: 'Модель ТС',
      type: 'text',
      cssClassName: 'width-fuel-report-large',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'car_gov_number',
      displayName: 'Рег. номер ТС',
      type: 'text',
      cssClassName: 'width-fuel-report-large',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'car_garage_number',
      displayName: 'Гаражный номер ТС',
      type: 'text',
      cssClassName: 'width-fuel-report-large',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'odometr_start',
      displayName: 'Одометр. Выезд',
      type: 'number',
      cssClassName: 'width-fuel-report-small',
      filter: {
        type: 'input',
      },
    },
    {
      name: 'odometr_end',
      displayName: 'Одометр. Возврат',
      type: 'number',
      cssClassName: 'width-fuel-report-small',
      filter: {
        type: 'input',
      },
    },
    {
      name: 'odometr_diff',
      displayName: 'Одометр. Пробег',
      type: 'number',
      cssClassName: 'width-fuel-report-small',
      filter: {
        type: 'input',
      },
    },
    {
      name: 'motohours_start',
      displayName: 'Счетчик моточасов. Выезд',
      type: 'number',
      cssClassName: 'width-fuel-report-small',
      filter: {
        type: 'input',
      },
    },
    {
      name: 'motohours_end',
      displayName: 'Счетчик моточасов. Возврат',
      type: 'number',
      cssClassName: 'width-fuel-report-small',
      filter: {
        type: 'input',
      },
    },
    {
      name: 'motohours_diff',
      displayName: 'Счетчик моточасов. Пробег',
      type: 'number',
      cssClassName: 'width-fuel-report-small',
      filter: {
        type: 'input',
      },
    },
    {
      name: 'motohours_equip_start',
      displayName: 'Счет. обор. моточасов. Выезд',
      type: 'number',
      cssClassName: 'width-fuel-report-small',
      filter: {
        type: 'input',
      },
    },
    {
      name: 'motohours_equip_end',
      displayName: 'Счет. обор. моточасов. Возврат',
      type: 'number',
      cssClassName: 'width-fuel-report-small',
      filter: {
        type: 'input',
      },
    },
    {
      name: 'motohours_equip_diff',
      displayName: 'Счет. обор. моточасов. Пробег',
      type: 'number',
      cssClassName: 'width-fuel-report-small',
      filter: {
        type: 'input',
      },
    },
    {
      name: 'fuel_type_name',
      displayName: 'Тип топлива',
      type: 'text',
      cssClassName: 'width-fuel-report-small',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'fuel_start',
      displayName: 'Топливо. Выезд',
      type: 'number',
      cssClassName: 'width-fuel-report-small',
      filter: {
        type: 'input',
      },
    },
    {
      name: 'fuel_given',
      displayName: 'Топливо. Выдано',
      type: 'number',
      cssClassName: 'width-fuel-report-small',
      filter: {
        type: 'input',
      },
    },
    {
      name: 'fuel_end',
      displayName: 'Топливо. Возврат',
      type: 'number',
      cssClassName: 'width-fuel-report-small',
      filter: {
        type: 'input',
      },
    },
    {
      name: 'fuel_fact',
      displayName: 'Топливо. Расход',
      type: 'number',
      cssClassName: 'width-fuel-report-small',
      filter: {
        type: 'input',
      },
    },
    {
      name: 'equipment_fuel_type_name',
      displayName: 'Тип топлива оборуд.',
      type: 'text',
      cssClassName: 'width-fuel-report-small',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'equipment_fuel_start',
      displayName: 'Топливо. Выезд оборуд.',
      type: 'number',
      cssClassName: 'width-fuel-report-small',
      filter: {
        type: 'input',
      },
    },
    {
      name: 'equipment_fuel_given',
      displayName: 'Топливо. Выдано оборуд.',
      type: 'number',
      cssClassName: 'width-fuel-report-small',
      filter: {
        type: 'input',
      },
    },
    {
      name: 'equipment_fuel_end',
      displayName: 'Топливо. Возврат оборуд.',
      type: 'number',
      cssClassName: 'width-fuel-report-small',
      filter: {
        type: 'input',
      },
    },
    {
      name: 'equipment_fuel_fact',
      displayName: 'Топливо. Расход оборуд.',
      type: 'number',
      cssClassName: 'width-fuel-report-small',
      filter: {
        type: 'input',
      },
    },
    {
      name: 'sensor_consumption',
      displayName: 'Расход по ДУТ, л',
      type: 'number',
      cssClassName: 'width-fuel-report-small',
      filter: {
        type: 'input',
      },
    },
    {
      name: 'consumption_diff',
      displayName: 'Разница расхода',
      type: 'number',
      cssClassName: 'width-fuel-report-small',
      filter: {
        type: 'input',
      },
    },
    {
      name: 'track_length',
      displayName: 'Пройдено по Глонасс, км',
      type: 'number',
      cssClassName: 'width-fuel-report-small',
      filter: {
        type: 'input',
      },
    },
    {
      name: 'length_diff',
      displayName: 'Разница пробега',
      type: 'number',
      cssClassName: 'width-fuel-report-small',
      filter: {
        type: 'input',
      },
    },
  ],
};

export default props => (
  <Table
    title="Отчет по топливу"
    tableMeta={tableMeta}
    results={props.data}
    enumerated={false}
    {...props}
  />
);
