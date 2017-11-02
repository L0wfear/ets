import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';

export default (props) => {
  const tableMeta = {
    cols: [
      {
        name: 'order_info',
        displayName: 'Дополнительная информация',
        type: 'string',
      },
    ],
  };

  return (<Table
    title="Реестр централизованных заданий"
    results={props.data}
    tableMeta={tableMeta}
    {...props}
  />);
};
