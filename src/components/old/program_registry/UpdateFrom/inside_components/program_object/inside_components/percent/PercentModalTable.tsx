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
        name: 'reviewed_at',
        displayName: 'Дата осмотра',
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
          type: 'string',
        },
      },
      {
        name: 'created_at',
        displayName: 'Дата внесения записи',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'fio',
        displayName: 'Линейщик',
        type: 'string',
        filter: {
          type: 'string',
        },
      },
      {
        name: 'comment',
        displayName: 'Комментарий',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
    ],
  };

  return meta;
}

const renderers: ISchemaRenderer = {
  reviewed_at: ({ data }) => makeDateFormated(data, true),
  created_at: ({ data }) => makeDateFormated(data, true),
};

const Table: React.FC<any> = (props) =>
  <DataTable
    title="Проставление процента выполнения работ"
    noFilter={true}
    results={props.data}
    initialSort={props.selectField}
    renderers={renderers}
    tableMeta={tableMeta(props)}
    className={'table-percent'}
    enumerated={false}
    {...props}
  />;

export default Table;
