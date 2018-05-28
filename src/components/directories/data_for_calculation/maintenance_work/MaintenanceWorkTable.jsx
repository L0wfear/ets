import React from 'react';
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
      name: 'measure_unit_name',
      displayName: 'Единица измерения',
      filter: {
        type: 'multiselect',
      },
      cssClassName: 'width150',
    },
  ],
};

export default (props) => {
  const renderers = {};

  return (
    <Table
      title="Показатели регламентных работ"
      results={props.data}
      tableMeta={tableMeta}
      renderers={renderers}
      {...props}
    />
  );
};
