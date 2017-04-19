import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

const tableMeta = {
  cols: [
    {
      name: 'okrug_name',
      displayName: 'Округ',
      type: 'text',
      cssClassName: 'width-fuel-report-large',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'district_name',
      displayName: 'Район',
      type: 'text',
      cssClassName: 'width-fuel-report-large',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'company_name',
      displayName: 'Организация',
      type: 'text',
      cssClassName: 'width-fuel-report-xlarge',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'fuel_type_name',
      displayName: 'Тип топлива',
      type: 'text',
      cssClassName: 'width-fuel-report-large',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'car_model_name',
      displayName: 'Модель ТС',
      type: 'text',
      cssClassName: 'width-fuel-report-xlarge',
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
      displayName: 'Гар. номер ТС',
      type: 'text',
      cssClassName: 'width-fuel-report-large',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'odometr_diff',
      displayName: 'Одометр ТС. Пробег, км',
      type: 'number',
      cssClassName: 'width-fuel-report-large',
      filter: {
        type: 'input',
      },
    },
    {
      name: 'motohours_diff',
      displayName: 'Счетчик моточасов ТС. Пробег, м/ч',
      type: 'number',
      cssClassName: 'width-fuel-report-large',
      filter: {
        type: 'input',
      },
    },
    {
      name: 'track_length',
      displayName: 'Пройдено ТС по Глонасс, км',
      type: 'number',
      cssClassName: 'width-fuel-report-large',
      filter: {
        type: 'input',
      },
    },
    {
      name: 'length_diff',
      displayName: 'Разница пробега',
      type: 'number',
      cssClassName: 'width-fuel-report-large',
      filter: {
        type: 'input',
      },
    },
    {
      name: 'equipment_fuel_diff',
      displayName: 'Топливо NC. Расход, л',
      type: 'number',
      cssClassName: 'width-fuel-report-large',
      filter: {
        type: 'input',
      },
    },
    {
      name: 'sensor_consumption',
      displayName: 'Расход ТС по ДУТ, л',
      type: 'number',
      cssClassName: 'width-fuel-report-large',
      filter: {
        type: 'input',
      },
    },
    {
      name: 'consumption_diff',
      displayName: 'Разница расхода ТС, л',
      type: 'number',
      cssClassName: 'width-fuel-report-large',
      filter: {
        type: 'input',
      },
    },
    {
      name: 'motohours_equip_diff',
      displayName: 'Счетчик моточасов оборудования. Пробег, м/ч',
      type: 'number',
      cssClassName: 'width-fuel-report-large',
      filter: {
        type: 'input',
      },
    },
    {
      name: 'equipment_fuel_diff',
      displayName: 'Топливо оборудования. Расход, л',
      type: 'number',
      cssClassName: 'width-fuel-report-large',
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
