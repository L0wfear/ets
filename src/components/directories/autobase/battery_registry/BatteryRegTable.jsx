import React from 'react';

import { makeSchema, sortSchemaCols } from 'components/ui/table/utils';
import Table from 'components/ui/table/DataTable.jsx';
import DateFormatter from 'components/ui/DateFormatter.jsx';

export const tableMeta = ({
  schemaMakers = {},
} = {}) => {
  const schema = {
    cols: [
      {
        name: 'name_org',
        displayName: 'Организация',
        type: 'text',
        orderNum: 0,
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'battery_brand__name',
        displayName: 'Марка аккумулятора',
        type: 'text',
        orderNum: 2,
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'battery__serial_number',
        displayName: 'Серийный номер',
        type: 'text',
        orderNum: 3,
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'battery__lifetime_months',
        displayName: 'Срок службы, мес.',
        type: 'text',
        orderNum: 4,
        filter: {
          type: 'text',
        },
      },
      {
        name: 'todo_pr_date_install',
        displayName: 'Пробег на дату установки',
        type: 'text',
        orderNum: 5,
        filter: false,
      },
      {
        name: 'battery_manufacturer__name',
        displayName: 'Изготовитель',
        type: 'text',
        orderNum: 6,
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'battery__released_at',
        displayName: 'Дата выпуска',
        orderNum: 6,
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'car__gov_number',
        displayName: 'Регистрационный номер',
        orderNum: 7,
        type: 'text',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'battery_on_car__installed_at',
        displayName: 'Дата установки',
        type: '',
        orderNum: 8,
        filter: {
          type: 'date',
        },
      },
    ],
  };

  return makeSchema(schema, schemaMakers);
};

export default (props) => {
  const { data = [] } = props;

  const renderers = {
    todo_pr_date_install: () => (<span>-</span>), 
    battery__released_at: ({ data }) => (<DateFormatter date={data} />),
    battery_on_car__installed_at: ({ data }) => (<DateFormatter date={data} />),
  };

  const meta = tableMeta(props);
  const sortedMeta = sortSchemaCols(meta);

  return (<Table
    title="Реестр аккумуляторов"
    results={data}
    tableMeta={sortedMeta}
    renderers={renderers}
    initialSort={false}
    {...props}
  />);
};
