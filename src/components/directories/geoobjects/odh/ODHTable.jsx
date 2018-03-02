import React from 'react';

import Table from 'components/ui/table/DataTable.jsx';

export const tableMeta = ({
  isOkrug = false,
  isKgh = false,
 } = {}) => (
  {
    cols: [
      {
        name: 'company_name',
        displayName: isKgh ? 'Наименование ГБУ' : 'Учреждение',
        type: 'string',
        display: isOkrug || isKgh,
        filter: (isOkrug || isKgh) ? { type: 'multiselect' } : false,
      },
      {
        name: 'name',
        displayName: 'Название',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'clean_category_name',
        displayName: 'Категория',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'total_area',
        displayName: 'Общая площадь (кв.м.)',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
      },
      {
        name: 'distance',
        displayName: 'Протяженность (п.м.)',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
      },
      {
        name: 'roadway_area',
        displayName: 'Площадь проезжей части (кв.м.)',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
      },
      {
        name: 'footway_area',
        displayName: 'Площадь тротуаров (кв.м.)',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
      },
      {
        name: 'cleaning_area',
        displayName: 'Площадь уборки (кв.м.)',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
      },
      {
        name: 'footway_length',
        displayName: 'Длина тротуара (п.м.)',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
      },
      {
        name: 'auto_footway_area',
        displayName: 'Площадь механизированной уборки тротуаров (кв.м.)',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
      },
      {
        name: 'manual_footway_area',
        displayName: 'Площадь ручной уборки тротуаров (кв.м.)',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
      },
      {
        name: 'snow_area',
        displayName: 'Площадь уборки снега (кв.м.)',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
      },
      {
        name: 'gutters_length',
        displayName: 'Протяженность лотков (п.м.)',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
      },
      {
        name: 'company_structure_name',
        displayName: 'Подразделение',
        type: 'text',
        filter: {
          type: 'multiselect',
        },
      },
    ],
  }
);

const renderers = {
  company_structure_name: ({ data }) => <div>{data || '---'}</div>,
};

const ODHTable = props => (
  <Table
    title="Реестр ОДХ"
    results={props.data}
    tableMeta={tableMeta(props)}
    renderers={renderers}
    initialSort={'name'}
    {...props}
  />
);

export default ODHTable;
