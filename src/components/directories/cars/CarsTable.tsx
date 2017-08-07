import * as React from 'react';

import { IDataTableSchema, ILabelFunction } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

const getCondition: ILabelFunction = data => !!data ? 'Исправно' : 'Неисправно';

export function tableMeta({
  isOkrug = false,
} = {}): IDataTableSchema {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'okrug_name',
        displayName: 'Округ',
        type: 'string',
        display: isOkrug,
        filter: isOkrug && { type: 'multiselect' } || false,
      },
      {
        name: 'company_name_customer',
        displayName: 'Заказчик',
        type: 'string',
        display: isOkrug,
        filter: false,
      },
      {
        name: 'company_name_contractor',
        displayName: 'Подрядчик',
        type: 'string',
        display: isOkrug,
        filter: false,
      },
      {
        name: 'company_name',
        displayName: 'Заказчик/Подрядчик',
        type: 'string',
        display: false,
        filter: isOkrug && { type: 'multiselect' } || false,
      },
      {
        name: 'owner_name',
        displayName: 'Владелец',
        type: 'string',
        display: isOkrug,
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'gov_number',
        displayName: 'Рег. номер ТС',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'special_model_name',
        displayName: 'Модель ТС',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'model_name',
        displayName: 'Марка шасси ТС',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'type_name',
        displayName: 'Тип',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'condition',
        displayName: 'Состояние',
        type: 'string',
        filter: {
          type: 'multiselect',
          labelFunction: getCondition,
        },
      },
      {
        name: 'garage_number',
        displayName: 'Гаражный номер',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'fuel_correction_rate',
        displayName: 'Поправочный коэффициент',
        type: 'number',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'company_structure_name',
        displayName: 'Подразделение предприятия',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'gps_code',
        displayName: 'Код БНСО',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'is_common',
        displayName: 'Общее',
        type: 'string',
        filter: {
          type: 'select',
          options: [{ label: 'Да', value: 1 }, { label: 'Нет', value: 0 }],
        },
      },
    ],
  };

  return meta;
}

const Table: React.SFC<any> = props  => {
  const renderers = {
    condition: ({ data }) => <div>{getCondition(data)}</div>,
    fuel_correction_rate: ({ data }) => <div>{data ? parseFloat(data).toFixed(2) : ''}</div>,
    garage_number: ({ data }) => <div>{data && data !== 'null' ? data : ''}</div>,
    model_name: ({ data }) => <div className="white-space-pre-wrap">{data}</div>,
    is_common: ({ data }) => <input type="checkbox" disabled checked={!!data} />,
    company_name_customer: ({ rowData }) => <span>{rowData.company_name}</span>,
    company_name_contractor: ({ rowData }) => <span>{rowData.company_name}</span>,
  };

  return (
    <DataTable
      title="Реестр транспортных средств"
      tableMeta={tableMeta(props)}
      results={props.data}
      renderers={renderers}
      {...props}
    />
  );
};

export default Table;
