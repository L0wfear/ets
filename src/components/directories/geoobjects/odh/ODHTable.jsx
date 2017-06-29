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
      displayName: 'Название',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'clean_category_name',
      displayName: 'Категория',
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
      name: 'distance',
      displayName: 'Протяженность (п.м.)',
      type: 'number',
    },
    {
      name: 'roadway_area',
      displayName: 'Площадь проезжей части (кв.м.)',
      type: 'number',
    },
    {
      name: 'footway_area',
      displayName: 'Площадь тротуаров (кв.м.)',
      type: 'number',
    },
    {
      name: 'cleaning_area',
      displayName: 'Площадь уборки (кв.м.)',
      type: 'number',
    },
    {
      name: 'footway_length',
      displayName: 'Длина тротуара (п.м.)',
      type: 'number',
    },
    {
      name: 'auto_footway_area',
      displayName: 'Площадь механизированной уборки тротуаров (кв.м.)',
      type: 'number',
    },
    {
      name: 'manual_footway_area',
      displayName: 'Площадь ручной уборки тротуаров (кв.м.)',
      type: 'number',
    },
    {
      name: 'snow_area',
      displayName: 'Площадь уборки снега (кв.м.)',
      type: 'number',
    },
    {
      name: 'gutters_length',
      displayName: 'Протяженность лотков (п.м.)',
      type: 'number',
    },
    {
      name: 'company_structure_name',
      displayName: 'Подразделение',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
  ],
});

const ODHTable = (props) => {
  const renderers = {};

  return (<Table
    title="Реестр ОДХ"
    results={props.data}
    tableMeta={tableMeta(props)}
    renderers={renderers}
    initialSort={'name'}
    {...props}
  />);
};

export default ODHTable;
