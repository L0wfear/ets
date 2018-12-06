import * as React from 'react';

import { IDataTableSchema, ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';
import { isNumber } from 'util';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function tableMeta({
  isOkrug = false,
  isKgh = false,
} = {}): IDataTableSchema {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'company_name',
        displayName: isKgh ? 'Наименование ГБУ' : 'Учреждение',
        type: 'string',
        display: isOkrug || isKgh,
        filter: (isOkrug || isKgh) ? { type: 'multiselect' } : false,
      },
      {
        name: 'yard_id',
        displayName: 'Идентификатор (ID)',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
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
        filter: {
          type: 'advanced-number',
        },
      },
      {
        name: 'clean_area',
        displayName: 'Общая уборочная площадь (кв.м.)',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
      },
      {
        name: 'auto_area',
        displayName: 'Площадь механизированной уборки (кв.м.)',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
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

const renderers: ISchemaRenderer = {
  auto_area: ({ data }) => isNumber(data) ? parseFloat(data.toString()).toFixed(2) : '',
  clean_area: ({ data }) => isNumber(data) ? parseFloat(data.toString()).toFixed(2) : '',
  total_area: ({ data }) => isNumber(data) ? parseFloat(data.toString()).toFixed(2) : '',
};

const Table: React.FunctionComponent<any> = (props) => {
  return (
    <DataTable
      title="Реестр ДТ"
      results={props.data}
      tableMeta={tableMeta(props)}
      initialSort={'name'}
      renderers={renderers}
      {...props}
    />
  );
};

export default Table;
