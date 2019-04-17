import React from 'react';
import Table from 'components/ui/table/DataTable';

const OBJECT = [
  {
    value: 'ОДХ',
    label: 'ОДХ',
  },
  {
    value: 'ДТ',
    label: 'ДТ',
  },
  {
    value: 'ПН',
    label: 'ПН',
  },
];

/*
  Элменты дублируются, из-за особенностей сортировки строки (Не можем отсортировать то, что получаем в renderers)
*/
const getTableMeta = ({
  ELEMENTS = [],
  KIND_TASK_NAMES = [],
  CAR_TYPES = [],
  SENSORS_TYPE_OPTIONS = [],
} = {}) => {
  const tableMeta = {
    cols: [
      {
        name: 'name',
        displayName: 'Наименование',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'elements_names',
        displayName: 'Элемент',
        type: 'string',
        filter: {
          type: 'multiselect',
          someInRowValue: true,
          options: ELEMENTS,
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
        name: 'kind_task_names',
        displayName: 'Способ выполнения',
        type: 'string',
        filter: {
          type: 'multiselect',
          someInRowValue: true,
          options: KIND_TASK_NAMES,
        },
      },
      {
        name: 'work_type_name',
        displayName: 'Способ уборки',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'conditions',
        displayName: 'Условия',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'norm_period',
        displayName: 'Число операций в сутки (норматив)',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'check_type_names',
        displayName: 'Тип проверки',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'objects_names',
        displayName: 'Объект',
        type: 'string',
        filter: {
          type: 'multiselect',
          someInRowValue: true,
          options: OBJECT,
        },
        cssClassName: 'width60',
      },
      {
        name: 'use_in_reports',
        displayName: 'Учет в отчетах',
        type: 'boolean',
        filter: {
          type: 'multiselect',
          labelFunction: (data) => (data ? 'Да' : 'Нет'),
        },
      },
      {
        name: 'car_func_types_text',
        displayName: 'Типы ТС',
        type: 'string',
        cssClassName: 'width1000',
        fullString: true,
        filter: {
          type: 'multiselect',
          someInRowValue: true,
          options: CAR_TYPES,
        },
      },
      {
        name: 'sensor_type_ids',
        displayName: 'Типы навесного оборудования',
        type: 'array',
        display: false,
        filter: {
          type: 'multiselect',
          options: SENSORS_TYPE_OPTIONS,
        },
      },
      {
        name: 'sensor_types_text',
        displayName: 'Типы навесного оборудования',
        type: 'array',
        filter: false,
      },
    ],
  };

  return tableMeta;
};

export default (props) => {
  const renderers = {
    use_in_reports: ({ data: value }) => (
      <input type="checkbox" disabled checked={!!value} />
    ),
    elements_names: ({ data }) => <div>{data.join(',\n')}</div>,
    objects_names: ({ data }) => <div>{data.join(',\n')}</div>,
    kind_task_names: ({ rowData: { kind_task_names_text } }) => (
      <div>{kind_task_names_text}</div>
    ),
    sensor_type_ids: ({ data }) => (
      <span>
        {data
          .map(
            (id) =>
              (
                props.sensorTypesList.find(({ id: id_s }) => id_s === id) || {
                  name: '',
                }
              ).name,
          )
          .join(',')}
      </span>
    ),
  };

  return (
    <Table
      title="Реестр технологических операций"
      results={props.data}
      tableMeta={getTableMeta(props)}
      renderers={renderers}
      initialSort="id"
      {...props}
    />
  );
};
