import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

let getTableMeta = (props) => {
  let tableMeta = {
    cols: [
      {
        name: 'object_address',
        caption: 'Название ДТ',
        type: 'string',
        filter: {
          type: 'select',
        }
      },
      {
        name: 'total_area',
        caption: 'Общая площадь (кв.м.)',
        type: 'number',
      },
      {
        name: 'clean_area',
        caption: 'Общая уборочная площадь (кв.м.)',
        type: 'number',
      },
      {
        name: 'auto_area',
        caption: 'Площадь механизированной уборки (кв.м.)',
        type: 'number',
      },
      {
        name: 'company_structure_name',
        caption: 'Подразделение',
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
