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
      name: 'object_address',
      displayName: 'Название ДТ',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'total_area',
      displayName: 'Общая площадь (кв.м.)',
      type: 'number',
    },
    {
      name: 'clean_area',
      displayName: 'Общая уборочная площадь (кв.м.)',
      type: 'number',
    },
    {
      name: 'auto_area',
      displayName: 'Площадь механизированной уборки (кв.м.)',
      type: 'number',
    },
    {
      name: 'company_structure_name',
      displayName: 'Подразделение',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
  ],
});

export default (props) => {
  const renderers = {};

  return (<Table
    title="Реестр ДТ"
    results={props.data}
    tableMeta={tableMeta(props)}
    renderers={renderers}
    initialSort={'name'}
    {...props}
  />);
};
