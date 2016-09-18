import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';

const tableMeta = {
  cols: [
    {
      name: 'mission_number',
      displayName: '№ Задания',
      type: 'string',
      filter: {
        type: 'select',
      },
    },
    {
      name: 'mission_name',
      displayName: 'Название',
      type: 'string',
      filter: {
        type: 'select',
      },
    },
    {
      name: 'driver_name',
      displayName: 'Водитель',
      type: 'string',
      filter: {
        type: 'select',
      },
    },
    {
      name: 'car_gov_number',
      displayName: 'Рег. номер ТС',
      type: 'string',
      filter: {
        type: 'select',
      },
    },
    {
      name: 'technical_operation_name',
      displayName: 'Тех. операция',
      type: 'string',
      filter: {
        type: 'select',
      },
    },
    {
      name: 'route_name',
      displayName: 'Маршрут',
      type: 'string',
      filter: {
        type: 'select',
      },
    },
    {
      name: 'route_traveled_percentage',
      displayName: 'Пройдено',
      type: 'string',
      filter: false,
    },
    {
      name: 'route_left_percentage',
      displayName: 'Осталось',
      type: 'string',
      filter: false,
    },
  ],
};

export default (props) => {
  const renderers = {
    route_traveled_percentage: ({ data }) => <div>{ data ? parseFloat(data) * 100 + '%' : 'Нет данных'}</div>,
    route_left_percentage: ({ data }) => <div>{ data ? parseFloat(data) * 100 + '%' : 'Нет данных'}</div>,
  };

  return (<Table
    title="Прохождение заданий"
    tableMeta={tableMeta}
    results={props.data}
    renderers={renderers}
    {...props}
  />);
};
