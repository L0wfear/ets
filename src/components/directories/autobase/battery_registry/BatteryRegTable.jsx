import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import DateFormatter from 'components/ui/DateFormatter.jsx';

export const tableMeta = props => ({
  cols: [
    {
      name: 'name_org',
      displayName: 'Организация',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'battery_brand__name',
      displayName: 'Марка аккумулятора',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'battery__serial_number',
      displayName: 'Серийный номер',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'battery__lifetime_months',
      displayName: 'Срок службы, мес.',
      type: 'text',
      filter: {
        type: 'text',
      },
    },
    {
      name: 'todo_pr_date_install',
      displayName: 'Пробег на дату установки',
      type: 'text',
      filter: false,
    },
    {
      name: 'battery_manufacturer__name',
      displayName: 'Изготовитель',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'battery__released_at',
      displayName: 'Дата выпуска',
      type: 'date',
      filter: {
        type: 'date',
      },
    },
    {
      name: 'car__gov_number',
      displayName: 'Регистрационный номер',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'battery_on_car__installed_at',
      displayName: 'Дата установки',
      type: '',
      filter: {
        type: 'date',
      },
    },
  ],
});

export default (props) => {
  const { data = [] } = props;

  const renderers = {
    todo_pr_date_install: () => (<span>-</span>), 
    battery__released_at: ({ data }) => (<DateFormatter date={data} />),
    battery_on_car__installed_at: ({ data }) => (<DateFormatter date={data} />),
  };

  return (<Table
    title="Реестр аккумуляторов"
    results={data}
    tableMeta={tableMeta(props)}
    renderers={renderers}
    initialSort={false}
    {...props}
  />);
};
