import * as React from 'react';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';
import DateFormatter from 'components/ui/DateFormatter';
import { YES_NO_SELECT_OPTIONS_INT } from 'constants/dictionary';

const DataTable: React.ComponentClass<
  IPropsDataTable<any>
> = DataTableComponent as any;

export function tableMeta({ structure }): IDataTableSchema {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'number',
        displayName: 'Номер',
        type: 'string',
        filter: {
          type: 'string',
        },
      },
      {
        name: 'fuel_type_text',
        displayName: 'Тип топлива',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'is_common',
        displayName: 'Общая',
        type: 'string',
        filter: {
          type: 'multiselect',
          options: YES_NO_SELECT_OPTIONS_INT,
        },
      },
      {
        name: 'structure_id',
        displayName: 'Подразделение',
        cssClassName: 'width80',
        type: 'string',
        sort: {
          serverFieldName: 'structure_name',
        },
        filter: {
          type: 'multiselect',
          options: structure,
        },
        display: Boolean(structure.length),
      },
      {
        name: 'company',
        displayName: 'Организация',
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
  supplied_at: ({ data }) => <DateFormatter date={data} />,
  is_common: ({ data }) => <input type="checkbox" disabled checked={!!data} />,
  structure_id: ({ rowData }) => <div>{rowData.structure_name}</div>,
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
