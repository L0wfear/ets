import * as React from 'react';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function tableMeta({
} = {}) {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'name',
        displayName: 'Производитель аккумулятора',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
    ],
  };

  return meta;
}

const Table: React.SFC<any> = props  => (
  <DataTable
    title="Производители аккумуляторов"
    results={props.data}
    tableMeta={tableMeta(props)}
    // initialSort={'full_name'}
    {...props}
  />
);

export default Table;
