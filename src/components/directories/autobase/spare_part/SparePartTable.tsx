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
        name: 'company_name',
        displayName: 'Организация',
        type: 'string',
        filter: {
          type: 'string',
        },
      },
      {
        name: 'group_name',
        displayName: 'Группа',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'number',
        displayName: 'Номер поставки',
        type: 'string',
        filter: {
          type: 'string',
        },
      },
      {
        name: 'name',
        displayName: 'Подгруппа',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'measure_unit_name',
        displayName: 'Единица измерения',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'quantity',
        displayName: 'Количество',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
      },
      {
        name: 'supplied_at',
        displayName: 'Дата поставки',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
    ],
  };

  return meta;
}

const Table: React.SFC<any> = props  => {
  const renderers: ISchemaRenderer = {
    supplied_at: ({ data }) => (<DateFormatter date={data} />),
  };

  return (
    <DataTable
      title="Реестр запчастей"
      results={props.data}
      renderers={renderers}
      tableMeta={tableMeta(props)}
      {...props}
    />
  );
};

export default Table;
