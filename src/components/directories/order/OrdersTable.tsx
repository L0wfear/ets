import * as React from 'react';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';
import DateFormatter from 'components/ui/DateFormatter';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function tableMeta({
} = {}): IDataTableSchema {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'order_number',
        displayName: 'Номер',
        type: 'string',
        cssClassName: 'width120',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'create_date',
        displayName: 'Дата создания',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'order_date',
        displayName: 'Начало действия',
        type: 'datetime',
        filter: false,
      },
      {
        name: 'order_date_to',
        displayName: 'Окончание действия',
        type: 'datetime',
        filter: false,
      },
      {
        name: 'order_type_name',
        displayName: 'Тип',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
        cssClassName: 'width60',
      },
      {
        name: 'status_name',
        displayName: 'Статус',
        type: 'string',
        filter: {
          type: 'multiselect',
          options: [
            { label: 'Опубликовано', value: 'Опубликовано' },
            { label: 'Отменено', value: 'Отменено' },
            { label: 'Частично отменено', value: 'Частично отменено' },
          ],
        },
      },
    ],
  };

  return meta;
}

const Table: React.SFC<any> = props  => {
  const renderers: ISchemaRenderer = {
    order_date: ({ data }) => <DateFormatter date={data} time empty={'Не указано'} />,
    order_date_to: ({ data }) => <DateFormatter date={data} time empty={'Не указано'} />,
    create_date: ({ data }) => <DateFormatter date={data} time empty={'Не указано'} />,
    pgm_deny: ({ data }) => <div>{data === 1 ? 'Не применять' : 'Применять'}</div>,
  };

  return (
    <DataTable
      title="Реестр централизованных заданий (факсограмм)"
      results={props.data}
      renderers={renderers}
      tableMeta={tableMeta(props)}
      serverPagination
      enumerated={false}
      externalFilter={props.changeFilter}
      externalChangeSort={props.changeSort}
      initialSort={'create_date'}
      initialSortAscending={false}
      className="order"
      {...props}
    />);
};

export default Table;
