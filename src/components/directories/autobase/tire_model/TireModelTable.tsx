import * as React from 'react';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function tableMeta({
} = {}): IDataTableSchema {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'name',
        displayName: 'Марка шины',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'tire_manufacturer_name',
        displayName: 'Производитель шины',
        type: 'string',
        cssClassName: 'width300',
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
    title="Марки шин"
    results={props.data}
    tableMeta={tableMeta(props)}
    {...props}
  />
);

export default Table;
