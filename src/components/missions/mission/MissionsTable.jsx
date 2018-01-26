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
        name: 'mission_source_name',
        displayName: 'Источник',
        type: 'number',
        filter: {
          type: 'multiselect',
          options: props.missionSourcesList.map(({ name }) => ({ value: name, label: name })),
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
        name: 'car_gov_number',
        displayName: 'Рег. номер ТС',
        type: 'number',
        filter: {
          type: 'multiselect',
          options: props.carsList.map(e => ({ label: e.gov_number, value: e.gov_number })),
        },
        cssClassName: 'width120',
      },
      {
        name: 'type_name',
        displayName: 'Тип техники',
        type: 'number',
        filter: {
          type: 'multiselect',
          options: uniqBy(props.carsList.map(e => ({ label: e.type_name, value: e.type_name })), 'value'),
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
        displayName: 'Количество циклов',
        type: 'number',
        filter: {
          type: 'advanced-string',
        },
        cssClassName: 'width120',
      },
      {
        name: 'technical_operation_name',
        displayName: 'Технологическая операция',
        type: 'number',
        filter: {
          type: 'multiselect',
          options: props.technicalOperationsList.map(({ name }) => ({ value: name, label: name })),
        },
      },
      {
        name: 'municipal_facility_id',
        displayName: 'Элемент',
        type: 'number',
        display: false,
        filter: {
          type: 'multiselect',
          options: props.municipalFacilityList.map(({ municipal_facility_id, municipal_facility_name }) => ({ value: municipal_facility_id, label: municipal_facility_name })),
        },
      },
      {
        name: 'municipal_facility_name',
        displayName: 'Элемент',
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
    rowNumber: ({ data }) => <span>{props.rowNumberOffset + data}</span>,
    mission_source_name: ({ rowData: { mission_source_text } }) => <span>{mission_source_text}</span>,
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
