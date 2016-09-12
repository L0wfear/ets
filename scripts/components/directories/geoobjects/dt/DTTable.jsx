import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

let getTableMeta = (props) => {
  let tableMeta = {
    cols: [
      {
        name: 'object_address',
        displayName: 'Название ДТ',
        type: 'string',
        filter: {
          type: 'select',
        }
      },
      {
        name: 'total_area',
        displayName: 'Общая площадь (кв.м.)',
        type: 'number',
      },
      {
        name: 'clean_area',
        displayName: 'Общая уборочная площадь (кв.м.)',
        type: 'number',
      },
      {
        name: 'auto_area',
        displayName: 'Площадь механизированной уборки (кв.м.)',
        type: 'number',
      },
      {
        name: 'company_structure_name',
        displayName: 'Подразделение',
        type: 'text',
      },
    ]
  };
  return tableMeta;
};

let DTTable = (props) => {

  const renderers = {};

  return <Table title="Реестр ДТ"
      results={props.data}
      tableMeta={getTableMeta(props)}
      renderers={renderers}
      initialSort={'name'}
      {...props}/>;
};

export default DTTable;
