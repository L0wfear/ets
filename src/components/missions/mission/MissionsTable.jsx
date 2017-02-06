import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import DateFormatter from 'components/ui/DateFormatter.jsx';
import Table from 'components/ui/table/DataTable.jsx';

const MISSION_STATUS_LABELS = {
  'assigned': 'Назначено',
  'not_assigned': 'Не назначено',
  'complete': 'Выполнено',
  'fail': 'Не выполнено',
};

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
        cssClassName: 'width60',
      },
      {
        name: 'waybill_number',
        displayName: 'Путевой лист',
        type: 'number',
        cssClassName: 'width60',
      },
      {
        name: 'mission_source_name',
        displayName: 'Источник',
        type: 'number',
        filter: {
          type: 'multiselect',
          options: [
            { label: 'Регламентные работы', value: 'Регламентные работы' },
            { label: 'Факсограмма', value: 'Факсограмма' },
          ],
        },
        cssClassName: 'width150',
      },
      {
        name: 'date_start',
        displayName: 'Начало',
        type: 'date',
        filter: {
          type: 'datetime',
        },
      },
      {
        name: 'date_end',
        displayName: 'Завершение',
        type: 'date',
        filter: {
          type: 'datetime',
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
        name: 'route_name',
        displayName: 'Маршрут',
        type: 'number',
        filter: {
          type: 'multiselect',
          options: props.routesList.map(({ name }) => ({ label: name, value: name })),
        },
        cssClassName: 'width120',
      },
      {
        name: 'passes_count',
        displayName: 'Количество проходов',
        type: 'number',
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
      enumerated={false}
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
