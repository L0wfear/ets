import * as React from 'react';
import { get } from 'lodash';

import { IDataTableSchema } from 'components/old/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/old/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/old/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/old/ui/table/DataTable';
import { OneSessionStructure } from 'redux-main/reducers/modules/session/@types/session';
import { makeDateFormated } from 'components/@next/@utils/dates/dates';
import { actionGetMissionTemplatesCars } from 'redux-main/reducers/modules/order/action-order';
import { Order } from 'redux-main/reducers/modules/order/@types';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

require('components/old/directories/order/forms/OrderMissionTemplate/MissionTableStyle.scss');

const highlightClassMapper = (_, checkdeData) => {
  if (get(checkdeData, 'front_invalid_interval')) {
    return 'standart-row red_line';
  }

  return 'standart-row';
};

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

const forColumnLabelFunction = (for_column) => for_column ? 'Да' : 'Нет';

type MissionTemplateOrderTableProps = {
  data: Array<any>;
  order_id: Order['id'];
  page: string;
  path: string;
  structures: Array<OneSessionStructure>;
  onRowSelected: (...props: Array<any>) => void;
  onRowChecked: (...props: Array<any>) => void;
  onAllRowsChecked: (...props: any) => void;
  selected: any | null;
  checked: object | null;
};

export function getTableMeta(props: MissionTemplateOrderTableProps, govNumberFilterOptions: Array<any>): IDataTableSchema {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'date_from',
        displayName: 'Начало действия',
        type: 'datetime',
        filter: {
          type: 'datetime',
        },
      },
      {
        name: 'date_to',
        displayName: 'Окончание действия',
        type: 'datetime',
        filter: {
          type: 'datetime',
        },
      },
      {
        name: 'for_column',
        displayName: 'Колонна',
        type: 'number',
        cssClassName: 'width60',
        filter: {
          type: 'multiselect',
          labelFunction: forColumnLabelFunction,
        },
      },
      {
        name: 'number',
        displayName: 'Номер',
        type: 'number',
        cssClassName: 'width60',
        filter: {
          type: 'multiselect',
        },
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
        name: 'car_ids',
        displayName: 'Рег. номер ТС',
        type: 'number',
        display: false,
        filter: {
          type: 'multiselect',
          options: govNumberFilterOptions,
        },
        cssClassName: 'width120',
      },
      {
        name: 'car_gov_numbers_text',
        displayName: 'Рег. номер ТС',
        type: 'number',
        filter: false,
        cssClassName: 'width120',
      },
      {
        name: 'car_type_names',
        displayName: 'Тип техники',
        type: 'number',
        filter: {
          type: 'multiselect',
        },
        cssClassName: 'width120',
      },
      {
        name: 'route_name',
        displayName: 'Маршрут',
        type: 'number',
        filter: {
          type: 'multiselect',
        },
        cssClassName: 'width120',
      },
      {
        name: 'passes_count',
        displayName: 'Количество циклов',
        type: 'number',
        filter: {
          type: 'multiselect',
        },
        cssClassName: 'width120',
      },
      {
        name: 'technical_operation_name',
        displayName: 'Технологическая операция',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'municipal_facility_name',
        displayName: 'Элемент',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'structure_id',
        displayName: 'Подразделение',
        cssClassName: 'width80',
        type: 'string',
        filter: {
          type: 'multiselect',
          byLabel: 'structure_name',
        },
        display: !!props.structures.length,
      },
      {
        name: 'comment',
        displayName: 'Комментарий',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
    ],
  };
  return meta;
}

const renderers: ISchemaRenderer = {
  date_from: ({ data }) => makeDateFormated(data, true),
  date_to: ({ data }) => makeDateFormated(data, true),
  structure_id: ({ rowData }) => <div>{get(rowData, 'structure_name') || '-'}</div>,
  car_type_names: ({ rowData }) => <div>{get(rowData, 'car_type_names_text') || '-'}</div>,
  for_column: ({ data }) => <div>{forColumnLabelFunction(data)}</div>,
};

const Table: React.FC<MissionTemplateOrderTableProps> = React.memo(
  (props) => {
    const [govNumberFilterOptions, setOptions] = React.useState([]);
    const dispatch = etsUseDispatch();
    React.useEffect(
      () => {
        const loadData = async () => {
          const result = await dispatch(actionGetMissionTemplatesCars({ order_id: props.order_id }, props));
          setOptions(result.map((car) => ({ label: car.gov_number, value: car.asuods_id })));
        };

        loadData();
      },
      [props.order_id],
    );

    return (
      <DataTable
        className="order_mission_template"
        multiSelection={true}
        results={props.data}
        renderers={renderers}
        tableMeta={getTableMeta(props, govNumberFilterOptions)}
        onRowSelected={props.onRowSelected}
        onRowChecked={props.onRowChecked}
        onAllRowsChecked={props.onAllRowsChecked}
        selected={props.selected}
        initialSort="frontId"
        selectField="frontId"
        checked={props.checked}
        highlightClassMapper={highlightClassMapper}
        withPerPageSelector
      />
    );
  },
);

export default Table;
