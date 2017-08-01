import * as React from 'react';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import {
  TIME_MEASURES,
  TIME_MEASURES_SELECT_OPTIONS,
  SEQUENCE_1_TO_20_SELECT_OPTIONS,
  IS_NOT_SELECT_OPTIONS_INT,
} from 'constants/dictionary';
// import { defaultSelectListMapper } from 'components/ui/input/EtsSelect';
import DataTableComponent from 'components/ui/table/DataTable';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function tableMeta({
  // techMaintTypeList = [],
  // specialModelsList = [],
  // measureUnitRunList = [],
} = {}): IDataTableSchema {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'tech_maintenance_type_name',
        displayName: 'Тип ТО',
        type: 'select',
        filter: {
          type: 'multiselect',
          // options: techMaintTypeList.map(defaultSelectListMapper),
        },
      },
      {
        name: 'sequence',
        displayName: 'Последовательность ТО',
        type: 'select',
        filter: {
          type: 'multiselect',
          options: SEQUENCE_1_TO_20_SELECT_OPTIONS,
        },
      },
      {
        name: 'description',
        displayName: 'Описание',
        type: 'text',
        filter: {
          type: 'string',
        },
      },
      {
        name: 'car_model_name',
        displayName: 'Модель ТС',
        type: 'select',
        filter: {
          type: 'multiselect',
          // options: specialModelsList.map(defaultSelectListMapper),
        },
      },
      {
        name: 'is_periodic',
        displayName: 'Признак периодического ТО',
        type: 'boolean',
        filter: {
          type: 'multiselect',
          options: IS_NOT_SELECT_OPTIONS_INT,
        },
      },
      {
        name: 'interval_probeg',
        displayName: 'Интервал до следующего ТО (по пробегу)',
        type: 'number',
        filter: {
          type: 'string',
        },
      },
      {
        name: 'measure_unit_run_name',
        displayName: 'Пробег измеряется',
        type: 'select',
        filter: {
          type: 'multiselect',
          // options: measureUnitRunList.map(defaultSelectListMapper),
        },
      },
      {
        name: 'interval_time',
        displayName: 'Интервал до следующего ТО (по времени)',
        type: 'number',
        filter: {
          type: 'string',
        },
      },
      {
        name: 'interval_time_type',
        displayName: 'Время измеряется',
        type: 'select',
        filter: {
          type: 'multiselect',
          options: TIME_MEASURES_SELECT_OPTIONS,
        },
      },
    ],
  };

  return meta;
}

const renderers: ISchemaRenderer = {
  // tech_maintenance_type_id: meta => <div>{meta.rowData.tech_maintenance_type_name}</div>,
  // car_model_id: meta => <div>{meta.rowData.car_model_name}</div>,
  // measure_unit_run_id: meta => <div>{meta.rowData.measure_unit_run_name}</div>,
  interval_time_type: meta => <div>{TIME_MEASURES[meta.data]}</div>,
  is_periodic: meta => <input type="checkbox" disabled checked={meta.data} />,
};

const Table: React.SFC<any> = props => {
  return (
    <DataTable
      title="Реестр регламентов ТО"
      results={props.data}
      tableMeta={tableMeta(props)}
      renderers={renderers}
      // initialSort={'full_name'}
      {...props}
    />
  );
};

export default Table;
