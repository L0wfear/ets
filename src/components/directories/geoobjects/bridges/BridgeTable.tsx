import * as React from 'react';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function tableMeta({
} = {}) {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'name',
        displayName: 'Наименование',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'district_text',
        displayName: 'Район',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'location',
        displayName: 'Местоположение объекта',
        type: 'string',
        filter: false,
      },
      {
        name: 'crossing',
        displayName: 'Пересечение',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'year_of_commissioning',
        displayName: 'Год ввода в эксплуатацию',
        type: 'select',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'global_id',
        displayName: 'Идентификатор моста',
        display: false,
        type: 'string',
        filter: false,
      },
    ],
  };

  return meta;
}

export const renderers = {
};

export default (props) => {
  return (
    <DataTable
      title="Мосты"
      results={props.data}
      tableMeta={tableMeta(props)}
      {...props}
    />
  );
};
