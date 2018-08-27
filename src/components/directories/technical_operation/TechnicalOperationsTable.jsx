import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import { defaultSelectListMapper } from 'components/ui/input/EtsSelect';

const getTableMeta = (props) => {
  const CAR_TYPES = props.typesList.map(({ asuods_id, full_name }) => ({ value: asuods_id, label: full_name }));
  const SENSORS_TYPE_OPTIONS = props.sensorTypesList.map(defaultSelectListMapper);

  const OBJECT = [
    {
      value: 1,
      label: 'ОДХ',
    },
    {
      value: 2,
      label: 'ДТ',
    },
    {
      value: 3,
      label: 'ПН',
    },
  ];

  const tableMeta = {
    cols: [
      {
        name: 'work_kind_name',
        displayName: 'Вид работ',
        type: 'string',
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
        name: 'season_name',
        displayName: 'Сезон',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
        cssClassName: 'width80',
      },
      {
        name: 'max_speed',
        displayName: 'Максимальная скорость',
        display: false,
        type: 'number',
        filter: false,
      },
      {
        name: 'check_type_name',
        displayName: 'Тип проверки',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'objects',
        displayName: 'Объект',
        type: 'string',
        filter: {
          type: 'multiselect',
          options: OBJECT,
          strict: true,
        },
        cssClassName: 'width60',
      },
      {
        name: 'needs_brigade',
        displayName: 'С участием РКУ',
        type: 'boolean',
        filter: {
          type: 'multiselect',
          labelFunction: data => data ? 'Да' : 'Нет',
        },
      },
      {
        name: 'use_in_reports',
        displayName: 'Учет в отчетах',
        type: 'boolean',
        filter: {
          type: 'multiselect',
          labelFunction: data => data ? 'Да' : 'Нет',
        },
      },
      {
        name: 'car_func_types',
        displayName: 'Типы ТС',
        type: 'string',
        filter: {
          type: 'multiselect',
          options: CAR_TYPES,
        },
      },
      {
        name: 'sensor_type_ids',
        displayName: 'Типы навесного оборудования',
        type: 'array',
        filter: {
          type: 'multiselect',
          options: SENSORS_TYPE_OPTIONS,
        },
      },
    ],
  };

  return tableMeta;
};

export default (props) => {
  const renderers = {
    car_func_types: ({ data }) => {
      const dataAsString = data.map(d => d.name).join(', ');
      return <div>{dataAsString}</div>;
    },
    objects: ({ data }) => {
      const dataAsString = data.map(d => d.name).join(', ');
      return <div>{dataAsString}</div>;
    },
    needs_brigade: ({ data }) => <input type="checkbox" disabled checked={!!data} />,
    use_in_reports: ({ data }) => <input type="checkbox" disabled checked={!!data} />,
    sensor_type_ids: ({ data }) => <span>{data.map(id => (props.sensorTypesList.find(({ id: id_s }) => id_s === id) || { name: '' }).name).join(',')}</span>,
  };

  return (<Table
    title="Реестр технологических операций"
    results={props.data}
    tableMeta={getTableMeta(props)}
    renderers={renderers}
    initialSort={'id'}
    {...props}
  />);
};
