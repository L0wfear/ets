import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';

const tableMeta = {
  cols: [
    {
      name: 'technical_operation_name',
      displayName: 'Технологическая операция',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'property_text',
      displayName: 'Площадная характеристика',
      filter: {
        type: 'multiselect',
      },
      cssClassName: 'width150',
    },
    {
      name: 'value',
      displayName: 'Коэффициент',
      cssClassName: 'width80',
    },
    {
      name: 'measure_unit_name',
      displayName: 'Единица измерения',
      cssClassName: 'width80',
    },
  ],
};

export default (props) => {
  return (
    <Table
      title="Показатели для расчета эффективности работы бригад"
      results={props.data}
      tableMeta={tableMeta}
      {...props}
    />
  );
};
