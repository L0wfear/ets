import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import moment from 'moment';

const tableMeta = {
  cols: [
    {
      name: 'order_date',
      displayName: 'Дата приказа',
      type: 'date',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'operation_name',
      displayName: 'Операция',
      type: 'number',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'summer_rate',
      displayName: 'Норма для летнего периода',
      type: 'number',
    },
    {
      name: 'winter_rate',
      displayName: 'Норма для зимнего периода',
      type: 'number',
    },
    {
      name: 'car_special_model_name',
      displayName: 'Модель ТС',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'car_model_name',
      displayName: 'Марка шасси',
      type: 'number',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'operation_equipment',
      displayName: 'Для спецоборудования',
      type: 'boolean',
      filter: {
        type: 'multiselect',
        labelFunction: d => d ? 'Да' : 'Нет',
      },
    },
  ],
};

export default (props) => {
  const renderers = {
    order_date: ({ data }) => <div>{moment(data).format(global.APP_DATE_FORMAT)}</div>,
    operation_equipment: ({ data }) => <div style={{ textAlign: 'center' }}><input type="checkbox" checked={!!data} readOnly /></div>,
  };

  return (<Table
    title="Нормы расхода топлива"
    results={props.data}
    tableMeta={tableMeta}
    renderers={renderers}
    {...props}
  />);
};
