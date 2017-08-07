import * as React from 'react';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';
import DateFormatter from 'components/ui/DateFormatter';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function tableMeta({
  car_id = -1,
} = {}): IDataTableSchema {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'company_name',
        displayName: 'Организация',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'gov_number',
        displayName: 'Транспортное средство',
        display: car_id === -1,
        type: 'string',
        filter: car_id === -1 ? { type: 'multiselect' } : false,
      },
      {
        name: 'reg_number',
        displayName: 'Номер диагностической карты',
        type: 'number',
        filter: {
          type: 'number',
        },
      },
      {
        name: 'date_end',
        displayName: 'Срок действия до',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'tech_operator',
        displayName: 'Место выдачи',
        type: 'select',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'date_start',
        displayName: 'Дата прохождения',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'is_allowed',
        displayName: 'Заключение о возможности эксплуатации ТС',
        type: 'boolean',
        filter: false,
      },
      {
        name: 'note',
        displayName: 'Примечание',
        type: 'string',
        filter: {
          type: 'string',
        },
      },
    ],
  };

  return meta;
}

const Table: React.SFC<any> = props  => {
  const { car_id = -1  } = props;

  const renderers: ISchemaRenderer = {
    date_start: ({ data }) => (<DateFormatter date={data} />),
    date_end: ({ data }) => (<DateFormatter date={data} />),
    is_allowed: ({ data }) => <input type="checkbox" disabled checked={data} />,
  };

  let meta = tableMeta(props);
  if (car_id === -1) {
    meta = { cols: meta.cols.filter(el => el.name !== 'car_id') };
  }
  return (
    <DataTable
      title="Реестр техосмотров"
      results={props.data}
      tableMeta={tableMeta(props)}
      renderers={renderers}
      {...props}
    />
  );
};

export default Table;
