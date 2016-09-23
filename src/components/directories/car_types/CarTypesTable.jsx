import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';

const tableMeta = {
  cols: [
    {
      name: 'full_name',
      displayName: 'Полное наименование',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
      cssClassName: 'width300',
    },
    {
      name: 'short_name',
      displayName: 'Краткое наименование',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
      cssClassName: 'width300',
    },
    {
      name: 'plow_width',
      displayName: 'Ширина уборочного оборудования',
      type: 'string',
      filter: false,
    },
  ],
};

export default (props) => {
  return (
    <Table
      title="Типы техники"
      results={props.data}
      tableMeta={tableMeta}
      initialSort={'full_name'}
      {...props}
    />
  );
};
