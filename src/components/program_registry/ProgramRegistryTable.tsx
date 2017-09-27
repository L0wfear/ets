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
        name: 'repair_type_name',
        displayName: 'Тип ремонта',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'state_program_name',
        displayName: 'Гос. программа',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'name',
        displayName: 'Наименование программы',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'status_name',
        displayName: 'Статус',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'plan_date_start',
        displayName: 'План. начало',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'plan_date_end',
        displayName: 'План. завершение',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'fact_date_start',
        displayName: 'Факт. начало',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'fact_date_end',
        displayName: 'Факт. завершение',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'percent',
        displayName: 'Процент выполнения',
        type: 'number',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'objects_count',
        displayName: 'Количество ОДХ/ДТ',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
    ],
  };

  return meta;
}

const Table: React.SFC<any> = props  => {
  const renderers: ISchemaRenderer = {
    plan_date_start: ({ data }) => (<DateFormatter date={data} />),
    plan_date_end: ({ data }) => (<DateFormatter date={data} />),
    fact_date_start: ({ data }) => (<DateFormatter date={data} />),
    fact_date_end: ({ data }) => (<DateFormatter date={data} />),
  };
  console.log(props)

  return (
    <DataTable
      title="Планирование ремонтных работ"
      results={props.data}
      renderers={renderers}
      tableMeta={tableMeta(props)}
      {...props}
    />
  );
};

export default Table;
