import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

const tableMeta = {
  cols: [
    {
      name: 'technical_operation_name',
      displayName: 'Технологическая операция',
      type: 'string',
      filter: {
        type: 'select',
      },
    },
    {
      name: 'standard_name',
      displayName: 'Норматив содержания ОДХ',
      type: 'string',
      filter: {
        type: 'select',
      },
    },
    {
      name: 'unit',
      displayName: 'Единица измерения',
      type: 'string',
      filter: false,
    },
    {
      name: 'categorized_1',
      displayName: '1',
      type: 'number',
      filter: false,
    },
    {
      name: 'categorized_2',
      displayName: '2',
      type: 'number',
      filter: false,
    },
    {
      name: 'categorized_3',
      displayName: '3',
      type: 'number',
      filter: false,
    },
    {
      name: 'categorized_4',
      displayName: '4',
      type: 'number',
      filter: false,
    },
    {
      name: 'categorized_5',
      displayName: '5',
      type: 'number',
      filter: false,
    },
    {
      name: 'categorized_6a',
      displayName: '6а',
      type: 'number',
      filter: false,
    },
    {
      name: 'categorized_6b',
      displayName: '6б',
      type: 'number',
      filter: false,
    },
    {
      name: 'categorized_6c',
      displayName: '6в',
      type: 'number',
      filter: false,
    },
    {
      name: 'categorized_7a',
      displayName: '7а',
      type: 'number',
      filter: false,
    },
    {
      name: 'categorized_7b',
      displayName: '7б',
      type: 'number',
      filter: false,
    },
    {
      name: 'uncategorized_highway',
      displayName: 'Магистрали (направления "Внуковское", "Рублевское", "Шереметьевское")',
      type: 'number',
      filter: false,
    },
    {
      name: 'uncategorized_odhs_center',
      displayName: 'ОДХ внутри Садового кольца',
      type: 'number',
      filter: false,
    },
    {
      name: 'uncategorized_odhs_other',
      displayName: 'ОДХ на территории ТиНАО, не отнесенные к иным категориям на территории г. Москвы',
      type: 'number',
      filter: false,
    },
  ],
};

export default (props) => {
  const renderers = {};

  return (<Table
    title="Показатели норм по содержанию ОДХ (лето)"
    results={props.data}
    tableMeta={tableMeta}
    className="small-table"
    renderers={renderers}
    {...props}
  />);
};
