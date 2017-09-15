import * as React from 'react';
import { get } from 'lodash';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';
import DateFormatter from 'components/ui/DateFormatter';
import { AUTOBASE_REPAIR_STATUS } from 'constants/dictionary';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function tableMeta({
} = {}): IDataTableSchema {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'repair_company_name',
        displayName: 'Исполнитель ремонта',
        type: 'select',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'repair_type_name',
        displayName: 'Вид ремонта',
        type: 'select',
        filter: {
          type: 'multiselect',
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
      {
        name: 'status',
        displayName: 'Статус',
        type: 'select',
        filter: {
          type: 'select',
        },
      },
    ],
  };

  return meta;
}

const Table: React.SFC<any> = props  => {
  const { carsList = [],
          car_id = -1,
        } = props;

  const renderers: ISchemaRenderer = {
    plan_date_start: ({ data }) => (<DateFormatter date={data} />),
    plan_date_end: ({ data }) => (<DateFormatter date={data} />),
    fact_date_start: ({ data }) => (<DateFormatter date={data} />),
    fact_date_end: ({ data }) => (<DateFormatter date={data} />),
    car_id: ({ data }) => <div>{get(carsList.find(s => s.asuods_id === data), 'gov_number', '---')}</div>,
    status: ({ data }) => <div>{AUTOBASE_REPAIR_STATUS[data] && AUTOBASE_REPAIR_STATUS[data].name || '---' }</div>,
  };

  return (
    <DataTable
      title="Ремонты ТС"
      results={props.data}
      tableMeta={tableMeta(props)}
      renderers={renderers}
      noFilter={car_id !== -1}
      {...props}
    />
  );
};

export default Table;
