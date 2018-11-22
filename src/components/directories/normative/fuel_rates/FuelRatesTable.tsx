import * as React from 'react';
import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';
import DateFormatter from 'components/ui/DateFormatter';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function tableMeta(props: any = {}): IDataTableSchema {
  return {
    cols: [
      {
        name: 'company_name',
        displayName: 'Учреждение',
        type: 'text',
        display: props ? props.isOkrug : false,
        filter: props && props.isOkrug ? { type: 'multiselect' } : false,
      },
      {
        name: 'order_date',
        displayName: 'Дата приказа',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'operation_name',
        displayName: 'Операция',
        type: 'number',
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
        },
      },
      {
        name: 'summer_rate',
        displayName: 'Норма для летнего периода',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
      },
      {
        name: 'winter_rate',
        displayName: 'Норма для зимнего периода',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
      },
      {
        name: 'car_special_model_name',
        displayName: 'Модель ТС',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'full_model_name',
        displayName: 'Марка шасси ТС',
        type: 'string',
        filter: false,
      },
      {
        name: 'model_name',
        displayName: 'Марка шасси ТС',
        display: false,
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'operation_equipment',
        displayName: 'Для спецоборудования',
        type: 'boolean',
        filter: {
          type: 'multiselect',
          labelFunction: (d) => d ? 'Да' : 'Нет',
        },
        cssClassName: 'width80',
      },
      {
        name: 'company_structure_name',
        displayName: 'Подразделение',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'is_excluding_mileage',
        displayName: 'Без учета пробега',
        filter: {
          type: 'multiselect',
          labelFunction: (is_excluding_mileage) => is_excluding_mileage ? 'Да' : 'Нет',
        },
        cssClassName: 'width150',
      },
    ],
  };
}

const renderers: ISchemaRenderer = {
  order_date: ({ data }) => (<DateFormatter date={data} />),
  operation_equipment: ({ data }) => <div style={{ textAlign: 'center' }}><input type="checkbox" checked={!!data} readOnly /></div>,
  is_excluding_mileage: ({ data }) => <div style={{ textAlign: 'center' }}><input type="checkbox" checked={!!data} readOnly /></div>,
  measure_unit_name: ({ data }) => <div>{data || '-'}</div>,
};

const Table: React.SFC<any> = (props) => (
  <DataTable
    title="Нормы расхода топлива"
    results={props.data}
    tableMeta={tableMeta(props)}
    renderers={renderers}
    initialSort={'id'}
    {...props}
  />
);

export default Table;
