import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import DateFormatter from 'components/ui/DateFormatter.jsx';

const tableMeta = {
  cols: [
    {
      name: 'technical_operation_name',
      displayName: 'Технологическая операция',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'source',
      displayName: 'Источник',
      type: 'text',
      filter: {
        type: 'multiselect',
        labelFunction: source => +source ? 'Справочник показателей норм на содержание ОДХ' : 'Реестр ОДХ',
      },
    },
    {
      name: 'areal_feature_name',
      displayName: 'Площадная характеристика',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'ratio',
      displayName: 'Коэффициент',
      type: 'text',
    },
  ],
};

const EfficiencyTable = (props) => {
  const renderers = {
    source: ({ data }) => +data ? <div>Справочник показателей норм на содержание ОДХ</div> : <div>Реестр ОДХ</div>,
  };

  return (<Table
    title="Реестр показателей для расчета эффективности"
    results={props.data}
    tableMeta={tableMeta}
    renderers={renderers}
    {...props}
  />);
};

export default EfficiencyTable;
