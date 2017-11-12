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
        name: 'order_info',
        displayName: 'Дополнительная информация',
        type: 'string',
        filter: false,
      },
    ],
  };
  return meta;
}

const Table: React.SFC<any> = props  => {
  return (
    <DataTable
      title="Реестр централизованных заданий"
      results={props.data}
      tableMeta={tableMeta()}
      noHeader={props.noHeader}
      preventNoDataMessage={props.preventNoDataMessage}
    />
  );
};

export default Table;
