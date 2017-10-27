import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';

const getTableMeta = (props) => {
  const CAR_TYPES = props.typesList.map(({ asuods_id, short_name }) => ({ value: asuods_id, label: short_name }));
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
        name: 'name',
        displayName: 'Наименование',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'municipal_facility_name',
        displayName: 'Элемент',
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
        name: 'max_speed',
        displayName: 'Максимальная скорость',
        type: 'number',
        filter: {
          type: 'multiselect',
        },
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
