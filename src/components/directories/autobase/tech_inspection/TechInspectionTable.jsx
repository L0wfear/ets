import React from 'react';
import { get } from 'lodash';

import Table from 'components/ui/table/DataTable.jsx';
import DateFormatter from 'components/ui/DateFormatter.jsx';

export const tableMeta = ({
  carsList = [],
} = {}) => (
  {
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
        name: 'car_id',
        displayName: 'Транспортное средство',
        type: 'number',
        orderNum: 1.5,
        filter: {
          type: 'multiselect',
          options: carsList.map(el => ({ value: el.asuods_id, label: el.gov_number })),
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
        filter: false,
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
  }
);

export default (props) => {
  const { carsList = [], car_id = 0  } = props;

  const renderers = {
    date_start: ({ data }) => (<DateFormatter date={data} />),
    date_end: ({ data }) => (<DateFormatter date={data} />),
    is_allowed: ({ data }) => <input type="checkbox" disabled checked={data} />,
    car_id: ({ data }) => <div>{get(carsList.find(s => s.asuods_id === data), 'gov_number', '---')}</div>,
  };

  let meta = tableMeta(props);
  if (!!car_id) {
    meta = { cols: meta.cols.filter(el => el.name !== 'car_id') };
  }
  
  
  return (<Table
    title="Реестр техосмотров"
    results={props.data}
    tableMeta={meta}
    renderers={renderers}
    noFilter={!!car_id}
    {...props}
  />);
};
