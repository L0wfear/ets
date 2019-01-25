import * as React from 'react';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';
import DateFormatter from 'components/ui/DateFormatter';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

const meta: IDataTableSchema = {
  cols: [
    {
      name: 'number',
      displayName: 'Номер',
      type: 'number',
      filter: {
        type: 'number',
      },
    },
    {
      name: 'fuel_type',
      displayName: 'Тип топлива',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'company_name',
      displayName: 'Организация',
      type: 'string',
      filter: {
        type: 'string',
      },
    },
  ],
};

export function tableMeta({
} = {}): IDataTableSchema {
  return meta;
}
const renderers: ISchemaRenderer = {
  supplied_at: ({ data }) => (<DateFormatter date={data} />),
};

const Table: React.FunctionComponent<any> = (props) => (
  <DataTable
    title="Реестр топливных карт"
    results={props.data}
    renderers={renderers}
    tableMeta={tableMeta(props)}
    initialSort={props.selectField}
    {...props}
  />
);

export default Table;
