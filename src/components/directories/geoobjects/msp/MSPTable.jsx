import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';

export const tableMeta = ({
  isKgh = false,
  isOkrug = false,
} = {}) => ({
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
      displayName: 'Полное наименование',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'shortname',
      displayName: 'Краткое наименование',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'address',
      displayName: 'Адрес',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'productivity',
      displayName: 'Производительность (куб. м в сутки)',
      type: 'number',
      filter: {
        type: 'advanced-number',
      },
    },
  ],
});

export default props => (
  <Table
    title="Мобильные снегоплавильные пункты"
    results={props.data}
    tableMeta={tableMeta(props)}
    {...props}
  />
);
