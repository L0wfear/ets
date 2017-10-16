import React from 'react';

import { MISSION_STATUS_LABELS as DUTY_MISSION_STATUS_LABELS } from 'constants/dictionary';
import DateFormatter from 'components/ui/DateFormatter.jsx';
import Table from 'components/ui/table/DataTable.jsx';

export const getTableMeta = ({
  structures = [],
  missionSourcesList = [],
  technicalOperationsList = [],
  foremanList = [],
  carDutyMissionList = [],
} = {}) => {
  const tableMeta = {
    cols: [
      {
        name: 'status',
        displayName: 'Статус',
        type: 'string',
        filter: {
          type: 'multiselect',
          options: Object.keys(DUTY_MISSION_STATUS_LABELS).map(key => ({ label: DUTY_MISSION_STATUS_LABELS[key], value: key })),
        },
        cssClassName: 'width120',
      },
      {
        name: 'number',
        displayName: 'Номер',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
        cssClassName: 'width60',
      },
      {
        name: 'mission_source_name',
        displayName: 'Источник',
        type: 'number',
        filter: {
          type: 'multiselect',
          options: missionSourcesList.map(({ name }) => ({ value: name, label: name })),
        },
        cssClassName: 'width120',
      },
      {
        name: 'technical_operation_name',
        displayName: 'Технологическая операция',
        type: 'number',
        filter: {
          type: 'multiselect',
          options: technicalOperationsList.map(({ name }) => ({ value: name, label: name })),
        },
      },
      {
        name: 'plan_date_start',
        displayName: 'Начало план.',
        type: 'date',
        filter: {
          type: 'advanced-datetime',
        },
      },
      {
        name: 'plan_date_end',
        displayName: 'Завершение план.',
        type: 'date',
        filter: {
          type: 'advanced-datetime',
        },
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
        name: 'foreman_fio',
        displayName: 'Бригадир',
        type: 'string',
        filter: {
          type: 'multiselect',
          serverFieldName: 'foreman_id',
          options: foremanList.map(({ fio, id }) => ({ value: id, label: fio })),
        },
      },
      {
        name: 'comment',
        displayName: 'Комментарий',
        type: 'string',
        filter: {
          type: 'advanced-string-like',
        },
        cssClassName: 'width120',
      },
      {
        name: 'car_mission_name',
        displayName: 'Задание на ТС',
        type: 'string',
        filter: {
          type: 'multiselect',
          serverFieldName: 'car_mission_id',
          options: carDutyMissionList.map(({ id, car_mission_name }) => ({ value: id, label: car_mission_name })),
        },
      },
      {
        name: 'structure_id',
        displayName: 'Подразделение',
        cssClassName: 'width80',
        type: 'string',
        sort: {
          serverFieldName: 'structure_name',
        },
        filter: {
          type: 'multiselect',
          options: structures.map(({ id, name }) => ({ value: id, label: name })),
        },
        display: structures.length,
      },
    ],
  };

  return tableMeta;
};

export default (props) => {
  const renderers = {
    rowNumber: ({ data }) => <span>{props.rowNumberOffset + data}</span>,
    mission_source_name: ({ data, rowData: { order_number } }) => <span>{`${data} ${order_number || ''}`}</span>,
    status: ({ data }) => <div>{DUTY_MISSION_STATUS_LABELS[data]}</div>,
    plan_date_start: ({ data }) => <DateFormatter date={data} time />,
    plan_date_end: ({ data }) => <DateFormatter date={data} time />,
    structure_id: ({ data }) => <div>{props.structures.find(s => s.id === data) ? props.structures.find(s => s.id === data).name : ''}</div>,
  };

  return (<Table title="Журнал наряд-заданий"
    results={props.data}
    renderers={renderers}
    tableMeta={getTableMeta(props)}
    serverPagination
    externalFilter={props.changeFilter}
    externalChangeSort={props.changeSort}
    initialSort={'number'}
    initialSortAscending={false}
    multiSelection
    {...props}
  />);
};
