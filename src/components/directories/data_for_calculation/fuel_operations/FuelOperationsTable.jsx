import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';

const tableMeta = {
  cols: [
    {
      name: 'name',
      displayName: 'Операция',
      type: 'number',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'measure_unit_name',
      displayName: 'Единица измерения',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'is_excluding_mileage',
      displayName: 'Без учета пробега',
      filter: {
        type: 'multiselect',
        labelFunction: is_excluding_mileage => is_excluding_mileage ? 'Да' : 'Нет',
      },
      cssClassName: 'width150',
    },
    {
      name: 'equipment',
      displayName: 'Для спецоборудования',
      filter: {
        type: 'multiselect',
        labelFunction: equipment => equipment ? 'Да' : 'Нет',
      },
      cssClassName: 'width150',
    },
  ],
};

export default (props) => {
  const renderers = {
    equipment: ({ data }) => <div style={{ textAlign: 'center' }}><input type="checkbox" checked={!!data} readOnly /></div>,
    is_excluding_mileage: ({ data }) => <div style={{ textAlign: 'center' }}><input type="checkbox" checked={!!data} readOnly /></div>,
  };

  return (
    <Table
      title="Операции для расчета топлива"
      results={props.data}
      tableMeta={tableMeta}
      renderers={renderers}
      {...props}
    />
  );
};
