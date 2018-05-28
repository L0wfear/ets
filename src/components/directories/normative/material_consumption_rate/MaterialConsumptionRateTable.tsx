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
        name: 'technical_operation_name',
        displayName: 'Технологическая операция',
        type: 'text',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'consumable_material_name',
        displayName: 'Расходный материал',
        type: 'text',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'season_name',
        displayName: 'Сезон',
        type: 'text',
        filter: {
          type: 'multiselect',
        },
        cssClassName: 'width80',
      },
      {
        name: 'clean_category_name',
        displayName: 'Категория',
        type: 'text',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'clean_subcategory_name',
        displayName: 'Подкатегория',
        type: 'text',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'value',
        displayName: 'Норма',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
        cssClassName: 'width60',
      },
    ],
  };

  return meta;
}

const Table: React.SFC<any> = props  => {
  const renderers: ISchemaRenderer = {
    value: ({ data }) => <span>{data !== null ? data.toFixed(3) : '' }</span>,
  };

  return (
    <DataTable title="Справочник норм на расход расходных материалов"
      results={props.data}
      tableMeta={tableMeta()}
      renderers={renderers}
      {...props}
    />
  );
};

export default Table;
