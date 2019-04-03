import React from 'react';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { uniqBy } from 'lodash';

import {
  MISSION_STATUS_LABELS,
  YES_NO_SELECT_OPTIONS_INT,
} from 'constants/dictionary';
import DateFormatter from 'components/ui/DateFormatter';
import Table from 'components/ui/table/DataTable';
import { connect } from 'react-redux';
import { selectorGetMissionSourceOptions } from 'redux-main/reducers/modules/some_uniq/mission_source/selectors';
import { getSessionStructuresOptions } from 'redux-main/reducers/modules/session/selectors';

/**
 * подсветка строк таблицы "провальных" поручений
 */
const highlight = [{ is_valid_to_order_operation: false }];

const STATUS_OPTIONS = Object.keys(MISSION_STATUS_LABELS).map((key) => ({
  label: MISSION_STATUS_LABELS[key],
  value: key,
}));

export const getTableMeta = ({
  MISSION_SOURCE_OPTIONS = [],
  carsFilterList = [],
  STRUCTURE_OPTIONS = [],
  technicalOperationsList = [],
  municipalFacilityList = [],
  technicalOperationsObjectsList = [],
  missionCancelReasonsList = [],
} = {}) => {
  const tableMeta = {
    cols: [
      {
        name: 'status',
        displayName: 'Статус',
        type: 'string',
        filter: {
          type: 'multiselect',
          options: STATUS_OPTIONS,
        },
        cssClassName: 'width120',
      },
      {
        name: 'number',
        displayName: 'Номер задания',
        type: 'number',
        filter: {
          type: 'advanced-string',
        },
        cssClassName: 'width60',
      },
      {
        name: 'waybill_number',
        displayName: 'Путевой лист',
        type: 'number',
        filter: {
          type: 'advanced-string',
        },
        cssClassName: 'width60',
      },
      {
        name: 'column_id',
        displayName: 'Номер колонны',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
        cssClassName: 'width60',
      },
      {
        name: 'current_percentage',
        displayName: 'Процент выполнения задания (%)',
        type: 'number',
        sortable: false,
        filter: false,
        cssClassName: 'width120',
      },
      {
        name: 'order_number',
        displayName: 'Факсограмма №',
        type: 'number',
        sortable: true,
        filter: {
          type: 'advanced-string-like',
        },
        cssClassName: 'width120',
      },
      {
        name: 'mission_source_id',
        displayName: 'Источник',
        type: 'number',
        sort: {
          serverFieldName: 'mission_source_name',
        },
        filter: {
          type: 'multiselect',
          options: MISSION_SOURCE_OPTIONS,
        },
        cssClassName: 'width150',
      },
      {
        name: 'date_start',
        displayName: 'Начало',
        type: 'date',
        filter: {
          type: 'advanced-date',
        },
      },
      {
        name: 'date_end',
        displayName: 'Завершение',
        type: 'date',
        filter: {
          type: 'advanced-date',
        },
      },
      {
        name: 'car_id',
        displayName: 'Рег. номер ТС',
        type: 'number',
        sort: {
          serverFieldName: 'car_gov_number',
        },
        filter: {
          type: 'multiselect',
          options: carsFilterList.map((car) => ({
            label: car.gov_number,
            value: car.asuods_id,
          })),
        },
        cssClassName: 'width120',
      },
      {
        name: 'type_id',
        displayName: 'Тип техники',
        type: 'number',
        sort: {
          serverFieldName: 'type_name',
        },
        filter: {
          type: 'multiselect',
          options: uniqBy(
            carsFilterList.map((car) => ({
              label: car.type_name,
              value: car.type_id,
            })),
            'value',
          ),
        },
        cssClassName: 'width120',
      },
      {
        name: 'route_name',
        displayName: 'Маршрут',
        type: 'number',
        filter: {
          type: 'advanced-string-like',
        },
        cssClassName: 'width120',
      },
      {
        name: 'object_type_id',
        displayName: 'Тип объекта',
        sort: {
          serverFieldName: 'object_type_name',
        },
        filter: {
          type: 'multiselect',
          options: technicalOperationsObjectsList.map(
            ({ id: value, short_name: label }) => ({ value, label }),
          ),
        },
      },
      {
        name: 'passes_count',
        displayName: 'Количество циклов',
        type: 'number',
        filter: {
          type: 'advanced-string',
        },
        cssClassName: 'width120',
      },
      {
        name: 'technical_operation_id',
        displayName: 'Технологическая операция',
        type: 'number',
        sort: {
          serverFieldName: 'technical_operation_name',
        },
        filter: {
          type: 'multiselect',
          options: technicalOperationsList.map((operation) => ({
            value: operation.id,
            label: operation.name,
          })),
        },
      },
      {
        name: 'municipal_facility_id',
        displayName: 'Элемент',
        type: 'number',
        display: false,
        filter: {
          type: 'multiselect',
          options: uniqBy(
            municipalFacilityList.map(
              ({ municipal_facility_id, municipal_facility_name }) => ({
                value: municipal_facility_id,
                label: municipal_facility_name,
              }),
            ),
            'value',
          ),
        },
      },
      {
        name: 'municipal_facility_name',
        displayName: 'Элемент',
        type: 'number',
        filter: false,
      },
      {
        name: 'reason_id',
        displayName: 'Причина отмены/невыполнения',
        type: 'number',
        display: false,
        filter: {
          type: 'multiselect',
          options: missionCancelReasonsList.map(({ id, name }) => ({
            value: id,
            label: name,
          })),
        },
      },
      {
        name: 'reason_name',
        displayName: 'Причина',
        type: 'number',
        filter: false,
      },
      {
        name: 'comment',
        displayName: 'Комментарий',
        type: 'string',
        filter: false,
      },
      {
        name: 'id',
        displayName: 'Показать на карте',
        filter: false,
        cssClassName: 'map-view',
      },
      {
        name: 'structure_id',
        displayName: 'Подразделение',
        cssClassName: 'width80',
        type: 'string',
        filter: {
          type: 'multiselect',
          options: STRUCTURE_OPTIONS,
        },
        display: STRUCTURE_OPTIONS.length,
      },
      {
        name: 'is_valid_to_order_operation',
        displayName: 'Не соответствующие поручению',
        type: 'string',
        filter: {
          type: 'multiselect',
          options: YES_NO_SELECT_OPTIONS_INT,
        },
        display: false,
      },
    ],
  };

  return tableMeta;
};

const MissionTable = (props) => {
  const renderers = {
    current_percentage: ({ data }) => (
      <span>{data !== null ? Math.floor(data) : '-'}</span>
    ),
    column_id: ({ data }) => <span>{data || '-'}</span>,
    mission_source_id: ({ rowData }) => (
      <span>{rowData.mission_source_name}</span>
    ),
    status: ({ data }) => <div>{MISSION_STATUS_LABELS[data]}</div>,
    date_start: ({ data }) => <DateFormatter date={data} time />,
    date_end: ({ data }) => <DateFormatter date={data} time />,
    id: ({ data, rowData }) => {
      if (rowData.status === 'not_assigned') return <div>Нет данных</div>;
      const className
        = Number(rowData.current_percentage) < 100 ? 'td-red' : undefined;

      return (
        <div className={className} style={{ width: '100%', heigth: '100%' }}>
          <span onClick={() => props.mapView(data)}>
            <Glyphicon glyph="info-sign" />
          </span>
        </div>
      );
    },
    structure_id: ({ rowData }) => <div>{rowData.structure_name}</div>,
    car_id: ({ rowData }) => <div>{rowData.car_gov_number}</div>,
    type_id: ({ rowData }) => <div>{rowData.type_name}</div>,
    object_type_id: ({ rowData: { object_type_name } }) => (
      <div>{object_type_name}</div>
    ),
    technical_operation_id: ({ rowData }) => (
      <div>{rowData.technical_operation_name}</div>
    ),
  };

  return (
    <Table
      title={props.is_archive ? 'Архив заданий' : 'Журнал заданий'}
      className="mission-table"
      results={props.data}
      renderers={renderers}
      enumerated
      serverPagination
      externalFilter={props.changeFilter}
      externalChangeSort={props.changeSort}
      tableMeta={getTableMeta(props)}
      initialSort="number"
      initialSortAscending={false}
      multiSelection
      highlight={highlight}
      {...props}
    />
  );
};

export default connect((state) => ({
  MISSION_SOURCE_OPTIONS: selectorGetMissionSourceOptions(state),
  STRUCTURE_OPTIONS: getSessionStructuresOptions(state),
}))(MissionTable);
