import * as React from 'react';
import DataTable from 'components/old/ui/tableNew/DataTable';
import { TechnicalOperationRelations } from 'redux-main/reducers/modules/technical_operation_relations/@types/technicalOperationRelations';

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
type Props = {
  data: TechnicalOperationRelations['routes'];
  onRowClick: ({ props: { data } }: { props: { data: ValuesOf<TechnicalOperationRelations['routes']>;}; }) => any;
  selected: ValuesOf<TechnicalOperationRelations['routes']>;
};

const ChangeRouteTable: React.FC<Props> = (props) => {
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
