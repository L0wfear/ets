import React from 'react';
import { Button } from 'react-bootstrap';
import { get } from 'lodash';

import { onClickWithKeys } from 'components/compositions/hoc';
import DateFormatter from 'components/ui/DateFormatter.jsx';
import Table from 'components/ui/table/DataTable.jsx';
import { makeSchema, sortSchemaCols } from 'components/ui/table/utils';

const CloneButton = onClickWithKeys(Button);

export const tableMeta = ({
  organizations = [],
  tireModelList = [],
  tireSizeList = [],
  schemaMakers = {},
} = {}) => {
  const schema = {
    cols: [
      {
        name: 'company_id',
        displayName: 'Организацяи',
        type: 'text',
        filter: {
          type: 'multiselect',
          options: organizations.map(({ company_id, short_name }) => ({ value: company_id, label: short_name })),
        },
      },
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
      {
        name: 'cloneButton',
        displayName: '',
        filter: false,
        orderNum: 7,
      },
    ],
  };

  return makeSchema(schema, schemaMakers);
};

export default (props) => {
  const { organizations = [], tireModelList = [], tireSizeList = [] } = props;
  const renderers = {
    company_id: ({ data }) => <div>{get(organizations.find(s => s.company_id === data), 'short_name', '')}</div>,
    tire_model_id: ({ data }) => <div>{get(tireModelList.find(s => s.id === data), 'name', '')}</div>,
    tire_size_id: ({ data }) => <div>{get(tireSizeList.find(s => s.id === data), 'name', '')}</div>,
    installed_at: ({ data }) => <DateFormatter date={data} />,
    cloneButton: meta =>
      <CloneButton
        onClick={props.onCloneClick}
        boundKeys={[meta.rowData.id]}
      >Создать копированием</CloneButton>,
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
