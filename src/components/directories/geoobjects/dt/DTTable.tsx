import * as React from 'react';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function tableMeta({
  isOkrug = false,
} = {}): IDataTableSchema {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'company_name',
        displayName: 'Учреждение',
        type: 'string',
        display: isOkrug,
        filter: isOkrug ? { type: 'multiselect' } : false,
      },
      {
        name: 'object_address',
        displayName: 'Название ДТ',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'total_area',
        displayName: 'Общая площадь (кв.м.)',
        type: 'number',
      },
      {
        name: 'clean_area',
        displayName: 'Общая уборочная площадь (кв.м.)',
        type: 'number',
      },
      {
        name: 'auto_area',
        displayName: 'Площадь механизированной уборки (кв.м.)',
        type: 'number',
      },
      {
        name: 'company_structure_name',
        displayName: 'Подразделение',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
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
      title="Реестр ДТ"
      results={props.data}
      renderers={renderers}
      tableMeta={tableMeta(props)}
      initialSort={'name'}
      {...props}
    />
  );
};

export default Table;
