import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import { get, uniqBy } from 'lodash';

import { MISSION_STATUS_LABELS } from 'constants/dictionary';
import DateFormatter from 'components/ui/DateFormatter.jsx';
import Table from 'components/ui/table/DataTable.jsx';

const getTableMeta = (props) => {
  const tableMeta = {
    cols: [
      {
        name: 'status',
        displayName: 'Статус',
        type: 'string',
        filter: {
          type: 'multiselect',
          options: Object.keys(MISSION_STATUS_LABELS).map(key => ({ label: MISSION_STATUS_LABELS[key], value: key })),
        },
        cssClassName: 'width120',
      },
      {
        name: 'number',
        displayName: 'Номер',
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
        name: 'mission_source_id',
        displayName: 'Источник',
        type: 'number',
        filter: {
          type: 'multiselect',
          options: props.missionSourcesList.map(missionSource => ({ value: missionSource.id, label: missionSource.name })),
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
        filter: {
          type: 'multiselect',
          options: props.carsList.map(car => ({ label: car.gov_number, value: car.asuods_id })),
        },
        cssClassName: 'width120',
      },
      {
        name: 'type_id',
        displayName: 'Тип техники',
        type: 'number',
        filter: {
          type: 'multiselect',
          options: uniqBy(props.carsList.map(car => ({ label: car.type_name, value: car.type_id })), 'value'),
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
        name: 'passes_count',
        displayName: 'Количество проходов',
        type: 'number',
        filter: {
          type: 'advanced-string',
        },
        cssClassName: 'width120',
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
        name: 'technical_operation_id',
        displayName: 'Технологическая операция',
        type: 'number',
        filter: {
          type: 'multiselect',
          options: props.technicalOperationsList.map(operation => ({ value: operation.id, label: operation.name })),
        },
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
          options: props.structures.map(({ id, name }) => ({ value: id, label: name })),
        },
        display: props.structures.length,
      },
    ],
  };

  return tableMeta;
};


export default (props) => {
  const renderers = {
    current_percentage: ({ data }) => <span>{Math.floor(data) || '-'}</span>,
    rowNumber: ({ data }) => <span>{props.rowNumberOffset + data}</span>,
    status: ({ data }) => <div>{MISSION_STATUS_LABELS[data]}</div>,
    date_start: ({ data }) => <DateFormatter date={data} time />,
    date_end: ({ data }) => <DateFormatter date={data} time />,
    id: (meta) => {
      if (meta.rowData.status === 'not_assigned') return <div>Нет данных</div>;
      return (
        <div>
          <span onClick={() => props.mapView(meta.data)}>
            <Glyphicon glyph="info-sign" />
          </span>
        </div>
      );
    },
    structure_id: ({ data }) => <div>{props.structures.find(s => s.id === data) ? props.structures.find(s => s.id === data).name : ''}</div>,
    car_id: ({ data }) => <div>{props.carsList.find(car => car.asuods_id === data) ? props.carsList.find(car => car.asuods_id === data).gov_number : ''}</div>,
    mission_source_id: ({ data }) => <div>{props.missionSourcesList.find(missonsource => missonsource.id === data) ? props.missionSourcesList.find(missonsource => missonsource.id === data).name : ''}</div>,
    type_id: ({ data }) => <div>{props.carsList.find(car => car.type_id === data) ? props.carsList.find(car => car.type_id === data).type_name : ''}</div>,
    technical_operation_id: ({ data }) => <div>{props.technicalOperationsList.find(operation => operation.id === data) ? props.technicalOperationsList.find(operation => operation.id === data).name : ''}</div>,
  };

  return (
    <Table
      title="Журнал заданий"
      results={props.data}
      renderers={renderers}
      enumerated
      serverPagination
      externalFilter={props.changeFilter}
      externalChangeSort={props.changeSort}
      tableMeta={getTableMeta(props)}
      initialSort={'number'}
      initialSortAscending={false}
      multiSelection
      {...props}
    />
  );
};
