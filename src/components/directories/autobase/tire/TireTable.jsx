import React from 'react';
import { get } from 'lodash';

import DateFormatter from 'components/ui/DateFormatter.jsx';
import Table from 'components/ui/table/DataTable.jsx';
import { makeSchema, sortSchemaCols } from 'components/ui/table/utils';


export const tableMeta = ({
  tireModelList = [],
  tireSizeList = [],
  schemaMakers = {},
} = {}) => {
  const schema = {
    cols: [
      {
        name: 'tire_model_id',
        displayName: 'Модель шины',
        type: 'text',
        orderNum: 0,
        filter: {
          type: 'multiselect',
          options: tireModelList.map(({ id, name }) => ({ value: id, label: name })),
        },
      },
      {
        name: 'tire_size_id',
        displayName: 'Размер',
        type: 'text',
        orderNum: 1,
        filter: {
          type: 'multiselect',
          options: tireSizeList.map(({ id, name }) => ({ value: id, label: name })),
        },
      },
      {
        name: 'odometr_diff',
        displayName: 'Пробег, км',
        type: 'text',
        orderNum: 2,
        filter: {
          type: 'string',
        },
      },
      {
        name: 'motohours_diff',
        displayName: 'Наработка, мч',
        type: 'text',
        orderNum: 3,
        filter: {
          type: 'string',
        },
      },
      {
        name: 'comment',
        displayName: 'Комментарий',
        type: 'text',
        orderNum: 4,
        filter: {
          type: 'string',
        },
      },
      {
        name: 'gov_number',
        displayName: 'Рег. номер ТС',
        type: 'text',
        orderNum: 5,
        filter: {
          type: 'string',
        },
      },
      {
        name: 'installed_at',
        displayName: 'Дата монтажа',
        type: 'date',
        orderNum: 6,
        filter: {
          type: 'date',
        },
      },
    ],
  };

  return makeSchema(schema, schemaMakers);
};

export default (props) => {
  const { tireModelList = [], tireSizeList = [] } = props;
  const renderers = {
    tire_model_id: ({ data }) => <div>{get(tireModelList.find(s => s.id === data), 'name', '')}</div>,
    tire_size_id: ({ data }) => <div>{get(tireSizeList.find(s => s.id === data), 'name', '')}</div>,
    installed_at: ({ data }) => <DateFormatter date={data} />,
  };

  const meta = tableMeta(props);
  const sortedMeta = sortSchemaCols(meta);

  return (<Table
    title="Реестр шин"
    results={props.data}
    tableMeta={sortedMeta}
    renderers={renderers}
    initialSort={false}
    {...props}
  />);
};
