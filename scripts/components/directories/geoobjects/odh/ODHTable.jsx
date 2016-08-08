import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

let getTableMeta = (props) => {
  let tableMeta = {
    cols: [
      {
        name: 'name',
        caption: 'Название',
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
        name: 'distance',
        caption: 'Протяженность (п.м.)',
        type: 'number',
      },
      {
        name: 'roadway_area',
        caption: 'Площадь проезжей части (кв.м.)',
        type: 'number',
      },
      {
        name: 'footway_area',
        caption: 'Площадь тротуаров (кв.м.)',
        type: 'number',
      },
      {
        name: 'cleaning_area',
        caption: 'Площадь уборки (кв.м.)',
        type: 'number',
      },
      {
        name: 'auto_footway_area',
        caption: 'Площадь механизированной уборки тротуаров (кв.м.)',
        type: 'number',
      },
      {
        name: 'manual_footway_area',
        caption: 'Площадь ручной уборки тротуаров (кв.м.)',
        type: 'number',
      },
      {
        name: 'snow_area',
        caption: 'Площадь уборки снега (кв.м.)',
        type: 'number',
      },
      {
        name: 'gutters_length',
        caption: 'Протяженность лотков (п.м.)',
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

let ODHTable = (props) => {

  const renderers = {};

  return <Table title="Реестр ОДХ"
                results={props.data}
                tableMeta={getTableMeta(props)}
                renderers={renderers}
                initialSort={'name'}
                {...props}/>;
};

export default ODHTable;
