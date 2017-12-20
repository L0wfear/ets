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
        type: 'text',
        display: isOkrug,
        filter: isOkrug ? { type: 'multiselect' } : false,
      },
      {
        name: 'name',
        displayName: 'Название',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'clean_category_name',
        displayName: 'Категория',
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
        name: 'distance',
        displayName: 'Протяженность (п.м.)',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
      },
      {
        name: 'roadway_area',
        displayName: 'Площадь проезжей части (кв.м.)',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
      },
      {
        name: 'footway_area',
        displayName: 'Площадь тротуаров (кв.м.)',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
      },
      {
        name: 'cleaning_area',
        displayName: 'Площадь уборки (кв.м.)',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
      },
      {
        name: 'footway_length',
        displayName: 'Длина тротуара (п.м.)',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
      },
      {
        name: 'auto_footway_area',
        displayName: 'Площадь механизированной уборки тротуаров (кв.м.)',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
      },
      {
        name: 'manual_footway_area',
        displayName: 'Площадь ручной уборки тротуаров (кв.м.)',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
      },
      {
        name: 'snow_area',
        displayName: 'Площадь уборки снега (кв.м.)',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
      },
      {
        name: 'gutters_length',
        displayName: 'Протяженность лотков (п.м.)',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
      },
      {
        name: 'company_structure_name',
        displayName: 'Подразделение',
        type: 'text',
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
    auto_footway_area: ({ data }) => <div>{Number.parseFloat(data).toFixed(2)}</div>,
    cleaning_area: ({ data }) => <div>{Number.parseFloat(data).toFixed(2)}</div>,
    distance: ({ data }) => <div>{Number.parseFloat(data).toFixed(2)}</div>,
    footway_area: ({ data }) => <div>{Number.parseFloat(data).toFixed(2)}</div>,
    footway_length: ({ data }) => <div>{Number.parseFloat(data).toFixed(2)}</div>,
    gutters_length: ({ data }) => <div>{Number.parseFloat(data).toFixed(2)}</div>,
    manual_footway_area: ({ data }) => <div>{Number.parseFloat(data).toFixed(2)}</div>,
    roadway_area: ({ data }) => <div>{Number.parseFloat(data).toFixed(2)}</div>,
    snow_area: ({ data }) => <div>{Number.parseFloat(data).toFixed(2)}</div>,
    total_area: ({ data }) => <div>{Number.parseFloat(data).toFixed(2)}</div>,
  };

  return (
    <DataTable
      title="Реестр ОДХ"
      results={props.data}
      renderers={renderers}
      tableMeta={tableMeta(props)}
      initialSort={'name'}
      {...props}
    />
  );
};

export default Table;
;
