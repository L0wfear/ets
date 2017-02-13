import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import { PERIODIC_REPORT_STATUSES } from 'constants/statuses';
import { isEmpty } from 'utils/functions';


const getTableMeta = (props) => {
  const displayNameByElement = {
    'roadway': 'Площадь проезжей части',
    'footway': 'Площадь тротуаров с мехуборкой',
    'yard': 'Механизированная площадь двора',
  };

  const tableMeta = {
    cols: [
      {
        name: 'geozone_name',
        displayName: 'Наименование объекта',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'geozone_element_area',
        displayName: displayNameByElement[props.element] || '',
        type: 'number',
        filter: false,
      },
      {
        name: 'car_type_list',
        displayName: 'Тип техники',
        type: 'string',
        filter: false,
      },
      {
        name: 'gov_number_list',
        displayName: 'Список ТС',
        type: 'string',
        filter: false,
      },
      {
        name: 'fact_traveled_area',
        displayName: 'Пройдено',
        type: 'string',
        filter: false,
      },
      {
        name: 'planned_passed_count',
        displayName: 'Плановое посещение',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'fact_traveled_percentage',
        displayName: 'Процент посещения',
        type: 'string',
        filter: false,
      },
      {
        name: 'status',
        displayName: 'Статус посещения',
        type: 'string',
        filter: {
          type: 'multiselect',
          labelFunction: s => PERIODIC_REPORT_STATUSES[s] || PERIODIC_REPORT_STATUSES.default
        },
      },
    ],
  };

  return tableMeta;
};

export default (props) => {
  const renderers = {
    geozone_element_area: ({ data }) => <div>{!isEmpty(data) ? parseFloat(data).toFixed(2) : ''}</div>,
    fact_traveled_area: ({ data }) => <div>{!isEmpty(data) ? parseFloat(data).toFixed(2) : ''}</div>,
    fact_traveled_percentage: ({ data }) => <div>{!isEmpty(data) ? parseFloat(data).toFixed(2) : ''}</div>,
    car_type_list: ({ data }) => <div>{data.map(el => el.name).join(', ')}</div>,
    status: ({ data }) => <div>{PERIODIC_REPORT_STATUSES[data] || PERIODIC_REPORT_STATUSES.default}</div>,
    gov_number_list: ({ data }) => <div>{data && data.join ? data.join(', ') : ''}</div>,
  };

  const tableMeta = getTableMeta(props);

  return (
    <Table
      title="Статус по уборке (ЦАФАП)"
      tableMeta={tableMeta}
      results={props.data}
      renderers={renderers}
      {...props}
    />
  );
};
