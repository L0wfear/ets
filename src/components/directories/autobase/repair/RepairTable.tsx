import * as React from 'react';
import { get } from 'lodash';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';
import DateFormatter from 'components/ui/DateFormatter';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function tableMeta({
  carsList = [],
  repairCompanyList = [],
  repairTypeList = [],
} = {}): IDataTableSchema {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'car_id',
        displayName: 'Транспортное средство',
        type: 'select',
        filter: {
          type: 'multiselect',
          options: carsList.map(el => ({ value: el.asuods_id, label: el.gov_number })),
        },
      },
      {
        name: 'repair_company_id',
        displayName: 'Исполнитель ремонта',
        type: 'select',
        filter: {
          type: 'multiselect',
          options: repairCompanyList.map(el => ({ value: el.id, label: el.name })),
        },
      },
      {
        name: 'repair_type_id',
        displayName: 'Вид ремонта',
        type: 'select',
        filter: {
          type: 'multiselect',
          options: repairTypeList.map(el => ({ value: el.id, label: el.name })),
        },
      },
      {
        name: 'number',
        displayName: 'Номер документа',
        type: 'string',
        filter: {
          type: 'string',
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
        type: 'string',
        filter: {
          type: 'string',
        },
      },
      {
        name: 'note',
        displayName: 'Примечание',
        type: 'string',
        filter: {
          type: 'string',
        },
      },
    ],
  };

  return meta;
}

const Table: React.SFC<any> = props  => {
  const { carsList = [],
          repairCompanyList = [],
          repairTypeList = [],
        } = props;

  const renderers: ISchemaRenderer = {
    plan_date_start: ({ data }) => (<DateFormatter date={data} />),
    plan_date_end: ({ data }) => (<DateFormatter date={data} />),
    fact_date_start: ({ data }) => (<DateFormatter date={data} />),
    fact_date_end: ({ data }) => (<DateFormatter date={data} />),
    car_id: ({ data }) => <div>{get(carsList.find(s => s.asuods_id === data), 'gov_number', '---')}</div>,
    repair_company_id: ({ data }) => <div>{get(repairCompanyList.find(s => s.id === data), 'name', '---')}</div>,
    repair_type_id: ({ data }) => <div>{get(repairTypeList.find(s => s.id === data), 'name', '---')}</div>,
  };

  return (
    <DataTable
      title="Ремонты ТС"
      results={props.data}
      tableMeta={tableMeta(props)}
      renderers={renderers}
      {...props}
    />
  );
};

export default Table;
