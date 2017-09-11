import * as React from 'react';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function tableMeta({
  sparePartGroupList = [],
  measureUnitList = [],
} = {}): IDataTableSchema {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'name',
        displayName: 'Наименование',
        type: 'select',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'inn',
        displayName: 'ИНН',
        type: 'select',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'kpp',
        displayName: 'КПП',
        type: 'select',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'ogrn',
        displayName: 'ОГРН',
        type: 'select',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'okpo',
        displayName: 'ОКПО',
        type: 'select',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'postal_address',
        displayName: 'Почтовый адрес',
        type: 'select',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'email',
        displayName: 'Электронный адрес',
        type: 'select',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'phone',
        displayName: 'Телефон',
        type: 'select',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'fax',
        displayName: 'Факс',
        type: 'select',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'bik',
        displayName: 'БИК',
        type: 'select',
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
      title="Справочник Подрядчиков"
      results={props.data}
      renderers={renderers}
      tableMeta={tableMeta(props)}
      {...props}
    />
  );
};

export default Table;
