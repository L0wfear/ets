import React from 'react';
import Table from 'components/ui/table/DataTable';

const tableMeta = {
  cols: [
    {
      name: 'full_name',
      displayName: 'Полное наименование',
      type: 'select',
      filter: {
        type: 'multiselect',
      },
      cssClassName: 'width300',
    },
    {
      name: 'group_name',
      displayName: 'Группа',
      type: 'select',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'short_name',
      displayName: 'Краткое наименование',
      type: 'select',
      filter: {
        type: 'multiselect',
      },
      cssClassName: 'width300',
    },
  ],
};

export default props => (
  <Table
    title="Типы техники"
    results={props.data}
    tableMeta={tableMeta}
    {...props}
    onRowSelected={undefined}
  />
);
