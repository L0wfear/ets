import * as React from 'react';

import { IDataTableSchema } from 'components/old/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/old/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/old/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/old/ui/table/DataTable';
import { makeDateFormated } from 'components/@next/@utils/dates/dates';

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

const renderers: ISchemaRenderer = {
  created_at: ({ data }) => makeDateFormated(data),
  plan_date_start: ({ data }) => makeDateFormated(data),
  plan_date_end: ({ data }) => makeDateFormated(data),
  fact_date_start: ({ data }) => makeDateFormated(data),
  fact_date_end: ({ data }) => makeDateFormated(data),
};

const Table: React.FC<any> = (props) => (
  <DataTable
    title="Объекты"
    results={props.data}
    initialSort={props.selectField}
    renderers={renderers}
    tableMeta={tableMeta(props)}
    noFilter
    className="program-object"
    griddleHidden={!props.displayTable}
    {...props}
  />
);

export default Table;
