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
        displayName: 'Марка аккумулятора',
        type: 'select',
        filter: { type: 'multiselect' },
      },
      {
        name: 'manufacturer_name',
        displayName: 'Производитель аккумулятора',
        type: 'select',
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
    title="Марки аккумуляторов"
    results={props.data}
    tableMeta={tableMeta(props)}
    lowerCaseSorting
    {...props}
  />
);

export default Table;
