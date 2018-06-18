import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';


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
        name: 'elements_text',
        displayName: 'Элемент',
        type: 'string',
        filter: {
          type: 'multiselect',
          some: true,
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
          some: true,
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
        name: 'max_speed_text',
        displayName: 'Максимальная скорость',
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
        name: 'objects_text',
        displayName: 'Объект',
        type: 'string',
        filter: {
          type: 'multiselect',
          options: OBJECT,
          some: true,
        },
        cssClassName: 'width60',
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
        name: 'car_func_types_text',
        displayName: 'Типы ТС',
        type: 'string',
        cssClassName: 'width1000',
        fullString: true,
        filter: {
          type: 'multiselect',
          some: true,
          options: CAR_TYPES,
        },
      },
    ],
  };

  return tableMeta;
};

const renderers = {
  use_in_reports: ({ data: value }) => <input type="checkbox" disabled checked={!!value} />,
  kind_task_names: ({ data }) => <div>{data.join(',\n')}</div>,
};

export default props => (
  <Table
    title="Реестр технологических операций"
    results={props.data}
    tableMeta={getTableMeta(props)}
    renderers={renderers}
    initialSort={'id'}
    {...props}
  />
);
