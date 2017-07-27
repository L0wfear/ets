import React from 'react';
import { get } from 'lodash';

import Table from 'components/ui/table/DataTable.jsx';
import DateFormatter from 'components/ui/DateFormatter.jsx';

export const tableMeta = ({
  carsList = [],
  repairCompanyList = [],
  repairTypeList = [],
} = {}) => (
  {
    cols: [
      {
        name: 'car_id',
        displayName: 'Транспортное средство',
        type: 'number',
        filter: {
          type: 'multiselect',
          options: carsList.map(el => ({ value: el.asuods_id, label: el.gov_number })),
        },
      },
      {
        name: 'repair_company_id',
        displayName: 'Исполнитель ремонта',
        type: 'number',
        filter: {
          type: 'multiselect',
          options: repairCompanyList.map(el => ({ value: el.id, label: el.name })),
        },
      },
      {
        name: 'repair_type_id',
        displayName: 'Вид ремонта',
        type: 'number',
        filter: {
          type: 'multiselect',
          options: repairTypeList.map(el => ({ value: el.id, label: el.name })),
        },
      },
      {
        name: 'number',
        displayName: 'Номер документа',
        type: 'text',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'plan_date_start',
        displayName: 'Плановая дата начала ремонта',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'plan_date_end',
        displayName: 'Плановая дата окончания ремонта',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'fact_date_start',
        displayName: 'Фактическая дата начала ремонта',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'fact_date_end',
        displayName: 'Фактическая дата окончания ремонта',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'description',
        displayName: 'Описание неисправности',
        type: 'text',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'note',
        displayName: 'Примечание',
        type: 'text',
        filter: {
          type: 'text',
        },
      },
    ],
  }
);

export default (props) => {
  const { carsList = [],
          repairCompanyList = [],
          repairTypeList = [],
          car_id = 0  
        } = props;

  const renderers = {
    plan_date_start: ({ data }) => (<DateFormatter date={data} />),
    plan_date_end: ({ data }) => (<DateFormatter date={data} />),
    fact_date_start: ({ data }) => (<DateFormatter date={data} />),
    fact_date_end: ({ data }) => (<DateFormatter date={data} />),
    car_id: ({ data }) => <div>{get(carsList.find(s => s.asuods_id === data), 'gov_number', '---')}</div>,
    repair_company_id: ({ data }) => <div>{get(repairCompanyList.find(s => s.id === data), 'name', '---')}</div>,
    repair_type_id: ({ data }) => <div>{get(repairTypeList.find(s => s.id === data), 'name', '---')}</div>,
  };

  let meta = tableMeta(props);
  if (!!car_id) {
    meta = { cols: meta.cols.filter(el => el.name !== 'car_id') };
  }

  return (<Table
    title="Ремонты ТС"
    results={props.data}
    tableMeta={meta}
    renderers={renderers}
    noFilter={!!car_id}
    {...props}
  />);
};
