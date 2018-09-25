import React from 'react';
import Table from 'components/ui/table/DataTable';

const tableMeta = {
  cols: [
    {
      name: 'name',
      displayName: 'Наименование',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'measure_unit_name', // unit
      displayName: 'Единица измерения',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
  ],
};

export default (props) => {
  const renderers = {
    consumable_material: ({ data }) => <div style={{ textAlign: 'center' }}><input type="checkbox" checked={!!data} readOnly /></div>,
  };

  return (
    <Table
      title="Справочник расходных материалов"
      results={props.data}
      tableMeta={tableMeta}
      renderers={renderers}
      {...props}
    />
  );
};
