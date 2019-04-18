import * as React from 'react';
import DataTable from 'components/ui/tableNew/DataTable';

const ROUTE_TYPE_OPTIONS = {
  mixed: {
    label: 'ОДХ',
  },
  simple_dt: {
    label: 'ДТ',
  },
  points: {
    label: 'Пункты назначения',
  },
};

export const meta = {
  cols: [
    {
      name: 'name',
      displayName: 'Наименование маршрута',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'type',
      displayName: 'Тип объекта',
      filter: {
        type: 'multiselect',
      },
      render: ({ data }) => ROUTE_TYPE_OPTIONS[data].label,
    },
    {
      name: 'structure_name',
      displayName: 'Подразделение',
      filter: {
        type: 'multiselect',
      },
    },
  ],
};

const ChangeRouteTable: React.FunctionComponent<any> = (props) => {
  return (
    <DataTable
      data={props.data}
      title={'Выберите маршрут для изменения'}
      tableMeta={meta}
      onRowClick={props.onRowClick}
      selected={props.selected}
      noFilter
      uniqName={'id'}
      children={props.children}
    />
  );
};

export default ChangeRouteTable;
