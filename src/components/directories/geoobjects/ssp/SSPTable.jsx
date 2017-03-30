import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

export const tableMeta = props => ({
  cols: [
    {
      name: 'company_name',
      displayName: 'Учреждение',
      type: 'text',
      display: props ? props.isOkrug : false,
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'name',
      displayName: 'Полное наименование',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'shortname',
      displayName: 'Краткое наименование',
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
      name: 'productivity',
      displayName: 'Производительность (куб. м в сутки)',
      type: 'number',
      filter: {
        type: 'string',
      },
    },
  ],
});

export default props => (
  <Table
    title="Пункты временного складирования снега"
    results={props.data}
    tableMeta={tableMeta(props)}
    {...props}
  />
);
