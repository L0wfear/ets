import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';


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

/*
  Элменты дублируются, из-за особенностей сортировки строки (Не можем отсортировать то, что получаем в renderers)
*/
const getTableMeta = ({
  ELEMENTS = [],
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
        name: 'elements',
        displayName: 'Элемент',
        display: false,
        type: 'string',
        filter: {
          type: 'multiselect',
          options: ELEMENTS,
        },
      },
      {
        name: 'elements_text',
        displayName: 'Элемент',
        type: 'string',
        filter: false,
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
        name: 'objects',
        displayName: 'Объект',
        display: false,
        type: 'string',
        filter: {
          type: 'multiselect',
          options: OBJECT,
          strict: true,
        },
      },
      {
        name: 'objects_text',
        displayName: 'Объект',
        type: 'string',
        filter: false,
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
        display: false,
        type: 'string',
        filter: {
          type: 'multiselect',
          options: CAR_TYPES,
        },
      },
      {
        name: 'car_func_types_text',
        displayName: 'Типы ТС',
        type: 'string',
        filter: false,
      },
    ],
  };

  return tableMeta;
};

export default (props) => {
  const renderers = {
    needs_brigade: ({ data: value }) => <input type="checkbox" disabled checked={!!value} />,
    use_in_reports: ({ data: value }) => <input type="checkbox" disabled checked={!!value} />,
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
