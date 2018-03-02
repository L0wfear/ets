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
        name: 'object_address',
        displayName: 'Название ДТ',
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
        name: 'clean_area',
        displayName: 'Общая уборочная площадь (кв.м.)',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
      },
      {
        name: 'auto_area',
        displayName: 'Площадь механизированной уборки (кв.м.)',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
      },
      {
        name: 'company_structure_name',
        displayName: 'Подразделение',
        type: 'string',
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

export default props => (
  <Table
    title="Реестр ДТ"
    results={props.data}
    tableMeta={tableMeta(props)}
    renderers={renderers}
    initialSort={'name'}
    {...props}
  />
);
