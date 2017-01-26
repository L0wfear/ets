import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import { REPORT_STATUSES } from 'constants/statuses';
import { getFormattedDateTimeSeconds } from 'utils/dates';

const tableMeta = {
  cols: [
    {
      name: 'status',
      displayName: 'Статус',
      type: 'text',
      filter: {
        type: 'multiselect',
        labelFunction: s => REPORT_STATUSES[s] || REPORT_STATUSES.default,
      },
    },
    {
      name: 'mission_name',
      displayName: 'Задание',
      type: 'number',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'technical_operation_name',
      displayName: 'Тех. операция',
      type: 'number',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'timestamp_create',
      displayName: 'Дата создания',
      type: 'number',
      filter: false,
    },
    {
      name: 'timestamp_process_begin',
      displayName: 'Дата начала обработки',
      type: 'number',
      filter: false,
    },
    {
      name: 'timestamp_process_end',
      displayName: 'Дата завершения обработки',
      type: 'number',
      filter: false,
    },
  ],
};

export default (props) => {
  const renderers = {
    status: ({ data }) => <div>{REPORT_STATUSES[data] || REPORT_STATUSES.default}</div>,
    timestamp_create: ({ data }) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
    timestamp_process_begin: ({ data }) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
    timestamp_process_end: ({ data }) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
  };

  return (
    <Table
      title="Прохождение заданий"
      tableMeta={tableMeta}
      initialSort={'timestamp_create'}
      initialSortAscending={false}
      results={props.data}
      renderers={renderers}
      {...props}
    />
  );
};
