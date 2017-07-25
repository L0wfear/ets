import React from 'react';
import { get } from 'lodash';

import { makeSchema, sortSchemaCols } from 'components/ui/table/utils';
import Table from 'components/ui/table/DataTable.jsx';
import DateFormatter from 'components/ui/DateFormatter.jsx';

export const tableMeta = ({
  insuranceTypeList = [],
  schemaMakers = {},
} = {}) => {
  const schema = {
    cols: [
      {
        name: 'insurer',
        displayName: 'Страховая организация',
        type: 'text',
        orderNum: 1,
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'insurance_name',
        displayName: 'Наименование страхования',
        type: 'text',
        orderNum: 2,
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'insurance_type_id',
        displayName: 'Тип страхования',
        type: 'text',
        orderNum: 3,
        filter: {
          type: 'multiselect',
          options: insuranceTypeList.map(({ id, name }) => ({ value: id, label: name })),
        },
      },
      {
        name: 'seria',
        displayName: 'Серия',
        type: 'text',
        orderNum: 4,
        filter: {
          type: 'text',
        },
      },
      {
        name: 'number',
        displayName: 'Номер',
        type: 'number',
        orderNum: 5,
        filter: {
          type: 'number',
        },
      },
      {
        name: 'date_start',
        displayName: 'Дата начала действия',
        type: 'date',
        orderNum: 6,
        filter: {
          type: 'date',
        },
      },
      {
        name: 'date_end',
        displayName: 'Дата окончания действия',
        orderNum: 6,
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'qwe',
        displayName: 'Срок действия, мес.',
        orderNum: 7,
        type: 'number',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'price',
        displayName: 'Стоимость, руб.',
        type: 'number',
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
  const { insuranceTypeList = [] } = props;

  const renderers = {
    insurance_type_id: ({ data }) => <div>{get(insuranceTypeList.find(s => s.id === data), 'name', '')}</div>,
    date_start: ({ data }) => (<DateFormatter date={data} />),
    date_end: ({ data }) => (<DateFormatter date={data} />),
  };

  const meta = tableMeta(props);
  const sortedMeta = sortSchemaCols(meta);

  return (<Table
    title="Реестр страховок"
    results={props.data}
    tableMeta={sortedMeta}
    renderers={renderers}
    {...props}
  />);
};
