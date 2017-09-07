import * as React from 'react';
import { get } from 'lodash';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';
import DateFormatter from 'components/ui/DateFormatter';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function tableMeta({
  sparePartGroupList = [],
  measureUnitList = [],
} = {}): IDataTableSchema {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'company_name',
        displayName: 'Организация',
        type: 'string',
        filter: {
          type: 'string',
        },
      },
      {
        name: 'spare_part_group_id',
        displayName: 'Группа',
        type: 'string',
        filter: {
          type: 'multiselect',
          options: sparePartGroupList.map(({ id, name }) => ({ value: id, label: name })),
        },
      },
      {
        name: 'number',
        displayName: 'Номер поставки',
        type: 'string',
        filter: {
          type: 'string',
        },
      },
      {
        name: 'name',
        displayName: 'Подгруппа',
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
          // options: measureUnitList.map(({ id, name }) => ({ value: id, label: name })),
        },
      },
      {
        name: 'quantity',
        displayName: 'Количество',
        type: 'string',
        filter: {
          type: 'string',
        },
      },
      {
        name: 'supplied_at',
        displayName: 'Дата поставки',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
    ],
  };

  return meta;
}

const Table: React.SFC<any> = props  => {
  const { measureUnitList = [], sparePartGroupList = [] } = props;

  const renderers: ISchemaRenderer = {
    spare_part_group_id: ({ data }) => <div>{get(sparePartGroupList.find(s => s.id === data), 'name', '')}</div>,
    measure_unit_id: ({ data }) => <div>{get(measureUnitList.find(s => s.id === data), 'name', '')}</div>,
    supplied_at: ({ data }) => (<DateFormatter date={data} />),
  };

  return (
    <DataTable
      title="Реестр запчастей"
      results={props.data}
      renderers={renderers}
      tableMeta={tableMeta(props)}
      {...props}
    />
  );
};

export default Table;
