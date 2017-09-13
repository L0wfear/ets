import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

export const tableMeta = props => ({
  cols: [
    {
      name: 'company_name',
      displayName: 'Учреждение',
      type: 'text',
      display: props ? props.isOkrug : false,
      filter: props && props.isOkrug ? { type: 'multiselect' } : false,
    },
    {
      name: 'name',
      displayName: 'Наименование',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'address',
      displayName: 'Адрес',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'liquid_pgm_volume',
      displayName: 'Объем жидких ПГМ',
      type: 'number',
      filter: {
        type: 'advanced-number',
      },
    },
    {
      name: 'solid_pgm_volume',
      displayName: 'Объем твердых ПГМ',
      type: 'number',
      filter: {
        type: 'advanced-number',
      },
    },
    {
      name: 'pgm_stores_type_name',
      displayName: 'Тип ПГМ',
      type: 'number',
      filter: {
        type: 'advanced-number',
      },
    },
  ],
});

export default (props) => {
  return (<Table
    title="Пункты отпуска ПГМ"
    results={props.data}
    tableMeta={tableMeta(props)}
    {...props}
  />);
};
