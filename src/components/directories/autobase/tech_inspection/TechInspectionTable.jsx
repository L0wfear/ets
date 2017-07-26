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
        type: 'text',
        orderNum: 1,
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'reg_number',
        displayName: 'Регистрационный номер',
        type: 'number',
        orderNum: 2,
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'date_end',
        displayName: 'Срок действия до',
        type: 'date',
        orderNum: 3,
        filter: {
          type: 'date',
        },
      },
      {
        name: 'insurance_type_id',
        displayName: 'Тип страхования',
        type: 'text',
        orderNum: 3,
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'tech_operator',
        displayName: 'Оператор технического осмотра / пункт технического осмотра',
        type: 'text',
        orderNum: 4,
        filter: {
          type: 'text',
        },
      },
      {
        name: 'date_start',
        displayName: 'Дата прохождения',
        type: 'date',
        orderNum: 5,
        filter: {
          type: 'date',
        },
      },
      {
        name: 'is_allowed',
        displayName: 'Заключение о возможности/невозможности эксплуатации ТС',
        type: 'boolean',
        orderNum: 6,
        filter: {
          type: 'boolean',
        },
      },
      {
        name: 'note',
        displayName: 'Примечание',
        type: 'text',
        orderNum: 7,
        filter: {
          type: 'text',
        },
      },
    ],
  };

  return makeSchema(schema, schemaMakers);
};

export default (props) => {

  const renderers = {
    date_start: ({ data }) => (<DateFormatter date={data} />),
    date_end: ({ data }) => (<DateFormatter date={data} />),
  };

  const meta = tableMeta(props);
  const sortedMeta = sortSchemaCols(meta);

  return (<Table
    title="Реестр техосмотров"
    results={props.data}
    tableMeta={sortedMeta}
    renderers={renderers}
    noFilter
    {...props}
  />);
};
