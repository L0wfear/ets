import * as React from 'react';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function tableMeta({
} = {}): IDataTableSchema {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'name',
        displayName: 'Наименование характиристики',
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
        cssClassName: 'col-md-5',
      },
    ],
  };

  return meta;
}

const Table: React.SFC<any> = props  => {
  const renderers: ISchemaRenderer = {
  };

  return (
    <DataTable
      title="Справочник характеристик объектов"
      results={props.data}
      renderers={renderers}
      tableMeta={tableMeta(props)}
      {...props}
    />
  );
};

export default Table;
