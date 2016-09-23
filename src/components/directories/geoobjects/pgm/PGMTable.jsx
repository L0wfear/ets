import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

const tableMeta = {
  cols: [
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
        type: 'string',
      },
    },
    {
      name: 'solid_pgm_volume',
      displayName: 'Объем твердых ПГМ',
      type: 'number',
      filter: {
        type: 'string',
      },
    },
    {
      name: 'pgm_stores_type_name',
      displayName: 'Тип ПГМ',
      type: 'number',
      filter: {
        type: 'string',
      },
    },
  ],
};

export default (props) => {
  return (<Table
    title="Пункты отпуска ПГМ"
    results={props.data}
    tableMeta={tableMeta}
    {...props}
  />);
};
