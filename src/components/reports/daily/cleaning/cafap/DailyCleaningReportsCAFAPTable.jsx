import React, { Component } from 'react';
import find from 'lodash/find';
import Table from 'components/ui/table/DataTable.jsx';
import { getReportStatusLabel, getGeozoneTypeLabel } from 'utils/labelFunctions';
import { getFormattedDateTimeSeconds } from 'utils/dates';

const getElementLabel = (el) => {
  const element = find([
    { value: 'roadway', label: 'Проезжая часть' },
    { value: 'footway', label: 'Тротуар' },
    { value: 'yard', label: 'Двор' }], obj => obj.value === el) || {};
  return element.label || '';
};

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
      name: 'geozone_type',
      displayName: 'Объект',
      type: 'number',
      filter: {
        type: 'multiselect',
        labelFunction: getGeozoneTypeLabel,
      },
    },
    {
      name: 'element',
      displayName: 'Элемент',
      type: 'number',
      filter: {
        type: 'multiselect',
        labelFunction: getElementLabel,
      },
    },
    {
      name: 'date_start',
      displayName: 'Начало периода',
      type: 'number',
      filter: {
        type: 'date',
      },
    },
    {
      name: 'date_end',
      displayName: 'Конец периода',
      type: 'number',
      filter: {
        type: 'date',
      },
    },
    {
      name: 'timestamp_create',
      displayName: 'Дата создания',
      type: 'number',
      filter: {
        type: 'date',
      },
    },
    {
      name: 'timestamp_process_begin',
      displayName: 'Дата начала обработки',
      type: 'number',
      filter: {
        type: 'date',
      },
    },
    {
      name: 'timestamp_process_end',
      displayName: 'Дата завершения обработки',
      type: 'number',
      filter: {
        type: 'date',
      },
    },
  ],
};

export default (props) => {
  const renderers = {
    status: ({ data }) => <div>{data ? getReportStatusLabel(data) : ''}</div>,
    geozone_type: ({ data }) => <div>{data ? getGeozoneTypeLabel(data) : ''}</div>,
    element: ({ data }) => <div>{data ? getElementLabel(data) : ''}</div>,
    date_start: ({ data }) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
    date_end: ({ data }) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
    timestamp_create: ({ data }) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
    timestamp_process_begin: ({ data }) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
    timestamp_process_end: ({ data }) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
  };

  return (
    <Table
      title="Статус по уборке (ЦАФАП)"
      tableMeta={tableMeta}
      results={props.data}
      renderers={renderers}
      initialSort={'timestamp_create'}
      initialSortAscending={false}
      {...props}
    />
  );
};
