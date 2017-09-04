import React from 'react';
import { get } from 'lodash';

import { makeSchema, sortSchemaCols } from 'components/ui/table/utils';
import Table from 'components/ui/table/DataTable.jsx';
import DateFormatter from 'components/ui/DateFormatter.jsx';

export const tableMeta = ({
  batteryBrandList = [],
  batteryManufacturerList = [],
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
          options: batteryBrandList.map(({ id, name }) => ({ value: id, label: name })),
        },
      },
      {
        name: 'brand_id',
        displayName: 'Марка аккумулятора',
        type: 'string',
        orderNum: 2,
        filter: {
          type: 'multiselect',
          options: batteryBrandList.map(({ id, name }) => ({ value: id, label: name })),
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
        name: 'manufacturer_id',
        displayName: 'Изготовитель',
        type: 'select',
        orderNum: 6,
        filter: {
          type: 'multiselect',
          options: batteryManufacturerList.map(({ id, name }) => ({ value: id, label: name })),
        },
      },
      {
        name: 'released_at',
        displayName: 'Дата выпуска',
        orderNum: 6,
        type: 'date',
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
  const { batteryBrandList = [], batteryManufacturerList = [] } = props;

  const renderers = {
    brand_id: ({ data }) => <div>{get(batteryBrandList.find(s => s.id === data), 'name', '')}</div>,
    manufacturer_id: ({ data }) => <div>{get(batteryManufacturerList.find(s => s.id === data), 'name', '')}</div>,
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
