import * as React from 'react';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function tableMeta(props): IDataTableSchema {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'tech_maintenance_type_id',
        displayName: 'Тип ТО',
        type: 'select',
        filter: {
          type: 'multiselect',
        },
      },
    ],
  };

  return meta;
}

const Table: React.SFC<any> = props => {
  console.log(props);
  return (
    <DataTable
      title="Реестр регламентов ТО"
      results={props.data}
      tableMeta={tableMeta(props)}
      // initialSort={'full_name'}
      {...props}
    />
  );
};

export default Table;
