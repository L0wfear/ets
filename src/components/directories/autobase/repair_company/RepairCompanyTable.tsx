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
        name: 'company_name',
        displayName: 'Организация',
        type: 'string',
        filter: {
          type: 'string',
        },
      },
      {
        name: 'name',
        displayName: 'Наименование ремонтной организации',
        type: 'string',
        filter: {
          type: 'string',
        },
      },
      {
        name: 'comment',
        displayName: 'Примечание',
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
    title="Реестр ремонтных организаций"
    results={props.data}
    tableMeta={tableMeta(props)}
    {...props}
  />
);

export default Table;
