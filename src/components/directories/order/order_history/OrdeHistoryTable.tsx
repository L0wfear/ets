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
        name: 'tech_op_name',
        displayName: 'Операция',
        type: 'string',
      },
      {
        name: 'object_type_name',
        displayName: 'Тип объекта',
        type: 'string',
      },
      {
        name: 'municipal_facility_name',
        displayName: 'Элемент',
        type: 'string',
      },
      {
        name: 'num_execution',
        displayName: 'Количество выполнений',
        type: 'string',
      },
    ],
  };
  return meta;
}

const Table: React.SFC<any> = props  => {
  return (
    <DataTable
      title="Расшифровка централизованного задания предыдущих версий"
      results={props.data}
      tableMeta={tableMeta()}
      className="order"
      {...props}
    />
  );
};

export default Table;
