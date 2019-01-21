import * as React from 'react';

import { get } from 'lodash';

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
        name: 'accident_date',
        displayName: 'Дата',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'driver_fio',
        displayName: 'Водитель',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'cause_name',
        displayName: 'Причина ДТП',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'accident_place',
        displayName: 'Место ДТП',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'is_guilty',
        displayName: 'Виновность',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'damage_price',
        displayName: 'Стоимость ущерба, руб.',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
      },
      {
        name: 'comment',
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

const makeDriverFio = (rowData) => {
  const {
    driver_fio,
    employee_position_name,
  } = rowData;

  const drivers_license = get(rowData, 'drivers_license', '') || '';
  const special_license = get(rowData, 'special_license', '') || '';

  return `${driver_fio} | ${employee_position_name} ${drivers_license ? `${drivers_license} ` : ''}${special_license}`;
};

const renderers: ISchemaRenderer = {
  accident_date: ({ data }) => (<DateFormatter date={data} />),
  is_guilty: ({ data }) => <input type="checkbox" disabled checked={data} />,
  driver_fio: ({ rowData }) => makeDriverFio(rowData),
};

const Table: React.FunctionComponent<any> = (props) => {
  return (
    <DataTable
      title="Реестр ДТП"
      results={props.data}
      tableMeta={tableMeta(props)}
      renderers={renderers}
      noFilter
      initialSort={props.selectField}
      {...props}
    />
  );
};

export default Table;
