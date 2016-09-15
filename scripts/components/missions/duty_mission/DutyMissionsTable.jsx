import React, { Component } from 'react';
import DateFormatter from 'components/ui/DateFormatter.jsx';
import Table from 'components/ui/table/DataTable.jsx';

const DUTY_MISSION_STATUS_LABELS = {
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
          type: 'select',
          labelFunction: s => DUTY_MISSION_STATUS_LABELS[s],
        },
        cssClassName: 'width120',
      },
      {
        name: 'number',
        displayName: 'Номер',
        type: 'number',
        filter: {
          type: 'select',
        },
        cssClassName: 'width60',
      },
      {
        name: 'mission_source_name',
        displayName: 'Источник',
        type: 'number',
        filter: {
          type: 'select',
        },
        cssClassName: 'width120',
      },
      {
        name: 'technical_operation_name',
        displayName: 'Технологическая операция',
        type: 'number',
        filter: {
          type: 'select',
        },
      },
      {
        name: 'plan_date_start',
        displayName: 'Начало план.',
        type: 'date',
        filter: {
          type: 'date_interval',
        },
      },
      {
        name: 'plan_date_end',
        displayName: 'Завершение план.',
        type: 'date',
        filter: {
          type: 'date_interval',
        },
      },
      {
        name: 'route_name',
        displayName: 'Маршрут',
        type: 'number',
        filter: {
          type: 'select',
        },
        cssClassName: 'width120',
      },
      {
        name: 'foreman_fio',
        displayName: 'Бригадир',
        type: 'string',
        filter: {
          type: 'string',
        },
      },
      {
        name: 'comment',
        displayName: 'Комментарий',
        type: 'string',
        filter: {
          type: 'select',
        },
        cssClassName: 'width120',
      },
      {
        name: 'car_mission_name',
        displayName: 'Задание на ТС',
        type: 'string',
        filter: {
          type: 'select',
        },
      },
    ],
  };

  return tableMeta;
};


export default (props) => {
  const renderers = {
    status: ({ data }) => <div>{DUTY_MISSION_STATUS_LABELS[data]}</div>,
    plan_date_start: ({ data }) => <DateFormatter date={data} time />,
    plan_date_end: ({ data }) => <DateFormatter date={data} time />,
  };

  return (<Table title="Журнал наряд-заданий"
    results={props.data}
    renderers={renderers}
    tableMeta={getTableMeta(props)}
    initialSort={'number'}
    initialSortAscending={false}
    multiSelection
    {...props}
  />);
};
