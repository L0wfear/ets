import * as React from 'react';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';
import { YES_NO_SELECT_OPTIONS_INT } from 'constants/dictionary';
import { defaultSelectListMapper } from 'components/ui/input/EtsSelect';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function tableMeta({
  isOkrug = false,
  sensorTypesList = [],
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
        name: 'type_name',
        displayName: 'Тип',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'condition_text',
        displayName: 'Состояние',
        type: 'string',
        filter: {
          type: 'multiselect',
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
          type: 'multiselect',
          options: YES_NO_SELECT_OPTIONS_INT,
        },
      },
      {
        name: 'equipment_sensors_types_ids',
        displayName: 'Установленные КБМ',
        type: 'string',
        filter: {
          type: 'select',
          options: sensorTypesList.map(defaultSelectListMapper),
        },
      },
      {
        name: 'level_sensors_num',
        displayName: 'Количество установленных ДУТ',
        type: 'number',
        filter: {
          type: 'multiselect',
        },
      },
    ],
  };

  return meta;
}

const renderers = {
  fuel_correction_rate: ({ data }) => <div>{data ? parseFloat(data).toFixed(2) : ''}</div>,
  garage_number: ({ data }) => <div>{data && data !== 'null' ? data : ''}</div>,
  model_name: ({ data }) => <div className="white-space-pre-wrap">{data}</div>,
  is_common: ({ data }) => <input type="checkbox" disabled checked={!!data} />,
  company_name_customer: ({ rowData }) => <span>{rowData.company_name}</span>,
  company_name_contractor: ({ rowData }) => <span>{rowData.company_name}</span>,
  equipment_sensors_types_ids: ({ rowData }) => <span>{rowData.equipment_sensors_str}</span>,
};

const Table: React.SFC<any> = props  => {
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
