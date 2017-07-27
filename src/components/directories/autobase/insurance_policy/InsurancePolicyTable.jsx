import React from 'react';
import { get } from 'lodash';

import Table from 'components/ui/table/DataTable.jsx';
import DateFormatter from 'components/ui/DateFormatter.jsx';

export const tableMeta = ({
  carsList = [],
  insuranceTypeList = [],
} = {}) => (
  {
    cols: [
      {
        name: 'car_id',
        displayName: 'Транспортное средство',
        type: 'number',
        orderNum: 0.5,
        filter: {
          type: 'multiselect',
          options: carsList.map(el => ({ value: el.asuods_id, label: el.gov_number })),
        },
      },
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
        name: 'price',
        displayName: 'Стоимость, руб.',
        type: 'number',
        orderNum: 8,
        filter: {
          type: 'date',
        },
      },
    ],
  }
);

export default (props) => {
  const { insuranceTypeList = [], carsList = [], car_id = 0 } = props;

  const renderers = {
    insurance_type_id: ({ data }) => <div>{get(insuranceTypeList.find(s => s.id === data), 'name', '')}</div>,
    date_start: ({ data }) => (<DateFormatter date={data} />),
    date_end: ({ data }) => (<DateFormatter date={data} />),
    car_id: ({ data }) => <div>{get(carsList.find(s => s.asuods_id === data), 'gov_number', '---')}</div>,
  };

  let meta = tableMeta(props);
  if (!!car_id) {
    meta = { cols: meta.cols.filter(el => el.name !== 'car_id') };
  }

  return (<Table
    title="Реестр страховок"
    results={props.data}
    tableMeta={meta}
    renderers={renderers}
    noFilter={!!car_id}
    {...props}
  />);
};
