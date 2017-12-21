import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import { YES_NO_SELECT_OPTIONS_INT } from 'constants/dictionary';

export const tableMeta = props => ({
  cols: [
    {
      name: 'company_name',
      displayName: 'Учреждение',
      type: 'text',
      display: props ? props.isOkrug : false,
      filter: props && props.isOkrug ? { type: 'multiselect' } : false,
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
    {
      name: 'is_mobile',
      displayName: 'Мобильность',
      type: 'string',
      filter: {
        type: 'multiselect',
        options: YES_NO_SELECT_OPTIONS_INT,
      },
    },
  ],
});

const renderers = {
  is_mobile: ({ data }) => <input type="checkbox" disabled checked={!!data} />,
};

export default props => (
  <Table
    title="Стационарные снегоплавильные пункты"
    results={props.data}
    tableMeta={tableMeta(props)}
    renderers={renderers}
    {...props}
  />
);
