import * as React from 'react';
import * as PropTypes from 'prop-types';
import Table from 'components/ui/table/DataTable';
import { get, uniqBy } from 'lodash';

import { employeeFIOLabelFunction } from 'utils/labelFunctions';

export const getTableMeta = ({
  employeesList = [],
  structures = [],
  flux = null,
} = {}) => {
  const tableMeta = {
    cols: [
      {
        name: 'number',
        displayName: 'Номер',
        type: 'number',
        cssClassName: 'width60',
        filter: {
          type: 'advanced-number',
        },
      },
      {
        name: 'route_name',
        displayName: 'Маршрут',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'technical_operation_name',
        displayName: 'Технологическая операция',
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
        name: 'foreman_fio',
        displayName: 'Бригадир',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'brigade_employee_id_list',
        displayName: 'Бригада',
        type: 'string',
        filter: {
          type: 'multiselect',
          someInRowValue: true,
          options: uniqBy(employeesList.map(({ id }) => ({
            value: id,
            label: flux && employeeFIOLabelFunction(flux)(id),
          })), 'value'),
        },
      },
      {
        name: 'structure_id',
        displayName: 'Подразделение',
        cssClassName: 'width80',
        type: 'number',
        filter: {
          type: 'multiselect',
          byLabel: 'structure_name',
        },
        display: structures.length,
      },
      {
        name: 'comment',
        displayName: 'Комментарий',
        type: 'string',
        filter: false,
        cssClassName: 'width300',
      },
    ],
  };

  return tableMeta;
};

export const getRenderers = props => ({
  brigade_employee_id_list: ({ data, rowData }) => (
    <div>
      {
        data.map((id) => (
          get(rowData, ['brigadeEmployeeIdIndex', id, 'employee_fio'], '-')
        )).join(', ')
      }
    </div>
  ),
  structure_id: ({ rowData }) => <div>{get(rowData, 'structure_name') || '-'}</div>,
});

const DataTable = props => (
  <Table
    title="Шаблоны наряд-заданий"
    renderers={getRenderers(props)}
    results={props.data}
    tableMeta={getTableMeta(props)}
    initialSort="number"
    initialSortAscending={false}
    {...props}
    multiSelection
  />
);

DataTable.propTypes = {
  data: PropTypes.array,
};

export default DataTable;
