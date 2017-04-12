import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';

export const tableMeta = props => ({
  cols: [
    {
      name: 'company_name',
      displayName: 'Организация',
      type: 'text',
      display: props.isOkrug,
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'total_cars_count',
      displayName: 'Кол-во техники указанного типа',
      type: 'number',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'cars_count',
      displayName: 'Задействованная техника',
      type: 'number',
      filter: {
        type: 'multiselect',
      },
    },
  ],
});

export default (props) => {
  const renderers = {
    rowNumber: meta => <div>{meta.rowData.hidden ? '' : meta.data}</div>,
    company_name: meta => <div>{meta.rowData.hidden ? '' : meta.data}</div>,
    func_type: meta => <div>{meta.rowData.hidden ? '' : meta.data}</div>,
    total_cars_count: meta => <div>{meta.rowData.hidden ? '' : meta.data}</div>,
  };

  return <Table
    title="Статистика выхода техники за период"
    tableMeta={tableMeta(props)}
    results={props.data}
    renderers={renderers}
    enableSort={false}
    {...props}
  />;
};
