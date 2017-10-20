import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import DateFormatter from 'components/ui/DateFormatter.jsx';

export default (props) => {
  const tableMeta = {
    cols: [
      {
        name: 'tk_operation_name',
        displayName: 'Операция',
        type: 'string',
      },
      {
        name: 'object_type_name',
        displayName: 'Тип объекта',
        type: 'string',
      },
      {
        name: 'elem',
        displayName: 'Элемент',
        type: 'string',
      },
      {
        name: 'num_exec',
        displayName: 'Количество выполнений',
        type: 'string',
      },
      {
        name: 'date_from',
        displayName: 'Начало действия',
        type: 'data',
      },
      {
        name: 'date_to',
        displayName: 'Окончание действия',
        type: 'data',
      },
      {
        name: 'work_type_name',
        displayName: 'Способ выполнения операции',
        type: 'string',
      },
    ],
  };
  const renderers = {
    date_from: ({ data }) => <DateFormatter date={data} time empty={'Не указано'} />,
    date_to: ({ data }) => <DateFormatter date={data} time empty={'Не указано'} />,
  };

  return (<Table
    title="Реестр факсограмм"
    results={props.data}
    renderers={renderers}
    tableMeta={tableMeta}
    {...props}
  />);
};
