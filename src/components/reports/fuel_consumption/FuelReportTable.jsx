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
        type: 'select',
      },
    },
    {
      name: 'car_gov_number',
      displayName: 'Рег. номер ТС',
      type: 'text',
      cssClassName: 'width-fuel-report-large',
      filter: {
        type: 'select',
      },
    },
    {
      name: 'car_garage_number',
      displayName: 'Гаражный номер ТС',
      type: 'text',
      cssClassName: 'width-fuel-report-large',
      filter: {
        type: 'select',
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
        type: 'select',
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
  ],
};

export default (props) => {
  return (
    <Table
      title="Отчет по топливу"
      tableMeta={tableMeta}
      results={props.data}
      enumerated={false}
      {...props}
    />
  );
};
