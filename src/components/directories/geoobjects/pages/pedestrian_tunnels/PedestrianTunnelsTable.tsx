import * as React from 'react';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function tableMeta({
  isKgh = false,
} = {}) {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'company_name',
        displayName: 'Наименование ГБУ',
        type: 'string',
        display: isKgh,
        filter: (isKgh) ? { type: 'multiselect' } : false,
      },
      {
        name: 'name',
        displayName: 'Наименование',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'adm_area',
        displayName: 'Административный округ',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'district',
        displayName: 'Район',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'location',
        displayName: 'Адресный ориентир',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
    ],
  };

  return meta;
}

const Table: React.SFC<any> = (props) => {
  const renderers: ISchemaRenderer = {
    location: ({ data }) => <span style={{ whiteSpace: 'pre-wrap' }}>{data}</span>,
  };

  return (
    <DataTable
      title="Пешеходные тоннели"
      results={props.data}
      renderers={renderers}
      enumerated
      tableMeta={tableMeta(props)}
      {...props}
    />
  );
};

export default Table;
