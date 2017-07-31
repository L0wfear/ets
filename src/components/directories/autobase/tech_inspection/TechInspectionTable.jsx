import React from 'react';
import { get } from 'lodash';

import Table from 'components/ui/table/DataTable.jsx';
import DateFormatter from 'components/ui/DateFormatter.jsx';

export const tableMeta = ({
  carsList = [],
  data = [],
} = {}) => {
  const data__car_id = data.map(el => el.car_id);
  const trueCarsList = carsList.reduce((arr, el) => {
    if (data__car_id.includes(el.asuods_id)) {
      arr.push({ value: el.asuods_id, label: el.gov_number });
    }
    return arr;
  }, []);
  const meta = {
    cols: [
      {
        name: 'company_name',
        displayName: 'Организация',
        type: 'text',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'car_id',
        displayName: 'Транспортное средство',
        type: 'number',
        filter: {
          type: 'multiselect',
          options: trueCarsList,
          // options: carsList.map(el => ({ value: el.asuods_id, label: el.gov_number })),
        },
      },
      {
        name: 'reg_number',
        displayName: 'Регистрационный номер',
        type: 'number',
        orderNum: 2,
        filter: {
          type: 'number',
        },
      },
      {
        name: 'date_end',
        displayName: 'Срок действия до',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'tech_operator',
        displayName: 'Оператор технического осмотра / пункт технического осмотра',
        type: 'text',
        filter: {
          type: 'text',
        },
      },
      {
        name: 'date_start',
        displayName: 'Дата прохождения',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'is_allowed',
        displayName: 'Заключение о возможности/невозможности эксплуатации ТС',
        type: 'boolean',
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
  };

  return meta;
};

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
