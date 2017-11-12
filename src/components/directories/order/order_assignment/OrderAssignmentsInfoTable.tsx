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
        name: 'tk_operation_name',
        displayName: 'Операция',
        type: 'string',
      },
      {
        name: 'object_type_name',
        displayName: 'Тип объекта',
        type: 'string',
      },
      {
        name: 'elem',
        displayName: 'Элемент',
        type: 'string',
      },
      {
        name: 'num_exec',
        displayName: 'Количество выполнений',
        type: 'string',
      },
      {
        name: 'date_from',
        displayName: 'Начало действия',
        type: 'data',
      },
      {
        name: 'date_to',
        displayName: 'Окончание действия',
        type: 'data',
      },
      {
        name: 'work_type_name',
        displayName: 'Способ выполнения операции',
        type: 'string',
      },
    ],
  };
  return meta;
}

const Table: React.SFC<any> = props  => {
  const renderers: ISchemaRenderer = {
    date_from: ({ data }) => <DateFormatter date={data} time empty={'Не указано'} />,
    date_to: ({ data }) => <DateFormatter date={data} time empty={'Не указано'} />,
  };

  return (
    <DataTable
      title="Реестр централизованных заданий"
      results={props.data}
      renderers={renderers}
      tableMeta={tableMeta()}
      {...props}
    />
  );
};

export default Table;
