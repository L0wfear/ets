import * as React from 'react';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';
import DateFormatter from 'components/ui/DateFormatter';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function tableMeta({
} = {}): IDataTableSchema {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'created_at',
        displayName: 'Дата создания',
        type: 'date',
        filter: false,
      },
      {
        name: 'name',
        displayName: 'Объект',
        type: 'string',
        filter: false,
      },
      {
        name: 'contractor_name',
        displayName: 'Подрядчик',
        type: 'string',
        filter: false,
      },
      {
        name: 'plan_date_start',
        displayName: 'План. Начало',
        type: 'string',
        filter: false,
      },
      {
        name: 'plan_date_end',
        displayName: 'План. Окончание',
        type: 'string',
        filter: false,
      },
      {
        name: 'fact_date_start',
        displayName: 'Факт. Начало',
        type: 'string',
        filter: false,
      },
      {
        name: 'fact_date_end',
        displayName: 'Факт. Окончание',
        type: 'string',
        filter: false,
      },
      {
        name: 'percent',
        displayName: 'Процент Выполнения',
        type: 'string',
        filter: false,
      },
    ],
  };

  return meta;
}

const Table: React.SFC<any> = props  => {
  const renderers: ISchemaRenderer = {
    created_at: ({ data }) => (<DateFormatter date={data} />),
    plan_date_start: ({ data }) => (<DateFormatter date={data} />),
    plan_date_end: ({ data }) => (<DateFormatter date={data} />),
    fact_date_start: ({ data }) => (<DateFormatter date={data} />),
    fact_date_end: ({ data }) => (<DateFormatter date={data} />),
  };

  return (
    <DataTable
      title="Объекты"
      results={props.data}
      renderers={renderers}
      tableMeta={tableMeta(props)}
      noFilter
      className="program-object"
      griddleHidden={!props.displayTable}
      {...props}
    />
  );
};

export default Table;
