import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';

const tableMeta = {
  cols: [
    {
      name: 'name',
      displayName: 'Учреждение',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'total_employees',
      displayName: 'Кол-во РКУ',
      type: 'number',
      filter: {
        type: 'input',
      },
    },
    {
      name: 'active_employees',
      displayName: 'Кол-во РКУ, выполняющих работы',
      type: 'number',
      filter: {
        type: 'input',
      },
    },
  ],
};

const TableComponent = props =>
  <Table
    title={props.title}
    tableMeta={tableMeta}
    results={props.data}
    enableSort={false}
    {...props}
  />;

export default TableComponent;
