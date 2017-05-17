import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';

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
    ],
  };

  return (<Table
    title="Реестр факсограмм"
    results={props.data}
    tableMeta={tableMeta}
    {...props}
  />);
};
