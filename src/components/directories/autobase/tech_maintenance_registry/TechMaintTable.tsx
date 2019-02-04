import * as React from 'react';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';
import DateFormatter from 'components/ui/DateFormatter';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

const meta: IDataTableSchema = {
  cols: [
    {
      name: 'repair_company_name',
      displayName: 'Исполнитель ремонта',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'tech_maintenance_orders_text',
      displayName: 'Регламент ТО',
      type: 'string',
      filter: {
        type: 'string',
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
      displayName: 'Плановая дата начала',
      type: 'date',
      filter: {
        type: 'date',
      },
    },
    {
      name: 'plan_date_end',
      displayName: 'Плановая дата окончания',
      type: 'date',
      filter: {
        type: 'date',
      },
    },
    {
      name: 'fact_date_start',
      displayName: 'Фактическая дата начала',
      type: 'date',
      filter: {
        type: 'date',
      },
    },
    {
      name: 'fact_date_end',
      displayName: 'Фактическая дата окончания',
      type: 'date',
      filter: {
        type: 'date',
      },
    },
    {
      name: 'odometr_fact',
      displayName: 'Пробег на момент ТО, км',
      type: 'number',
      filter: {
        type: 'advanced-number',
      },
    },
    {
      name: 'motohours_fact',
      displayName: 'Счетчик м/ч на момент ТО, м/ч',
      type: 'number',
      filter: {
        type: 'advanced-number',
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

export function tableMeta({
} = {}): IDataTableSchema {
  return meta;
}

const renderers: ISchemaRenderer = {
  plan_date_start: ({ data }) => <DateFormatter date={data} time={false} />,
  plan_date_end: ({ data }) => <DateFormatter date={data} time={false} />,
  fact_date_start: ({ data }) => <DateFormatter date={data} time={false} />,
  fact_date_end: ({ data }) => <DateFormatter date={data} time={false} />,
};

const Table: React.FunctionComponent<any> = (props) => {
  return (
    <DataTable
      title="Тех. обслуживание"
      results={props.data}
      tableMeta={tableMeta(props)}
      renderers={renderers}
      noFilter={props.car_id !== undefined}
      initialSort={props.selectField}
      {...props}
    />
  );
};

export default Table;
