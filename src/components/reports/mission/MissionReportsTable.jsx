import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import { getReportStatusLabel } from 'utils/labelFunctions';
import { getFormattedDateTimeSeconds } from 'utils/dates';

const tableMeta = {
  cols: [
    {
      name: 'status',
      displayName: 'Статус',
      type: 'text',
      filter: {
        type: 'multiselect',
        labelFunction: getReportStatusLabel,
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
    status: ({ data }) => <div>{data ? getReportStatusLabel(data) : ''}</div>,
    timestamp_create: ({ data }) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
    timestamp_process_begin: ({ data }) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
    timestamp_process_end: ({ data }) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
  };

  return (
    <Table
      title="Прохождение заданий"
      tableMeta={tableMeta}
      results={props.data}
      renderers={renderers}
      {...props}
    />
  );
};
