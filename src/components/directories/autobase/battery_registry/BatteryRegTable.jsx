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
        name: 'company_name',
        displayName: 'Организация',
        type: 'string',
        orderNum: 2,
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'brand_name',
        displayName: 'Марка аккумулятора',
        type: 'string',
        orderNum: 2,
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'serial_number',
        displayName: 'Серийный номер',
        type: 'string',
        orderNum: 3,
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'lifetime_months',
        displayName: 'Срок службы',
        type: 'number',
        orderNum: 4,
        filter: {
          type: 'number',
        },
      },
      {
        name: 'worked_months',
        displayName: 'Количество месяцев наработки',
        type: 'number',
        orderNum: 4,
        filter: {
          type: 'number',
        },
      },
      {
        name: 'manufacturer_name',
        displayName: 'Изготовитель',
        type: 'select',
        orderNum: 6,
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'released_at',
        displayName: 'Дата выпуска',
        orderNum: 6,
        type: 'string',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'gov_number',
        displayName: 'Рег. номер ТС',
        orderNum: 7,
        type: 'select',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'installed_at',
        displayName: 'Дата установки',
        type: 'date',
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
  const renderers = {
    todo_pr_date_install: () => (<span>-</span>),
    released_at: ({ data }) => (<DateFormatter date={data} />),
    installed_at: ({ data }) => (<DateFormatter date={data} />),
  };

  const meta = tableMeta(props);
  const sortedMeta = sortSchemaCols(meta);

  return (<Table
    title="Реестр аккумуляторов"
    results={props.data}
    tableMeta={sortedMeta}
    renderers={renderers}
    {...props}
  />);
};
