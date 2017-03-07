import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';

const tableMeta = {
  cols: [
    {
      name: 'company_name',
      displayName: 'Учреждение',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'employee_name',
      displayName: 'ФИО сотрудника',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'duty_missions',
      displayName: 'Количество заданий',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
      cssClassName: 'width80',
    },
    {
      name: 'area',
      displayName: 'Обслуживаемая площадь',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'trashcans',
      displayName: 'Очищаемые урны',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
      cssClassName: 'width80',
    },
    {
      name: 'stations',
      displayName: 'Обслуживаемые остановки',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
      cssClassName: 'width80',
    },
  ],
};

export default (props) => {
  const renderers = {
    // rowNumber: meta => <div>{meta.rowData.hidden ? '' : meta.data}</div>,
    // company_name: meta => <div>{meta.rowData.hidden ? '' : meta.data}</div>,
    // func_type: meta => <div>{meta.rowData.hidden ? '' : meta.data}</div>,
    // total_cars_count: meta => <div>{meta.rowData.hidden ? '' : meta.data}</div>,
  };

  return (
    <Table
      title="Работа сотрудников по ручной уборке"
      tableMeta={tableMeta}
      results={props.data}
      renderers={renderers}
      enableSort={false}
      {...props}
    />
	);
};
