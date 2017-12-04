import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';

import { employeeFIOLabelFunction } from 'utils/labelFunctions';

const getTableMeta = ({
  employeesList = [],
  structures = [],
  flux,
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
          options: employeesList.map(({ id: value }) => ({
            value,
            label: employeeFIOLabelFunction(flux)(value),
          })),
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
        name: 'comment',
        displayName: 'Комментарий',
        type: 'string',
        filter: false,
        cssClassName: 'width300',
      },
      {
        name: 'structure_id',
        displayName: 'Подразделение',
        cssClassName: 'width80',
        type: 'string',
        filter: {
          type: 'multiselect',
          options: structures.map(({ id, name }) => ({ value: id, label: name })),
        },
        display: structures.length,
      },
    ],
  };

  return tableMeta;
};

const DataTable = (props) => {
  const {
    structures = [],
    flux,
  } = props;

  const renderers = ({
    structure_id: ({ data }) => <div>{(structures.find(s => s.id === data) || { data: '' }).name}</div>,
    brigade_employee_id_list: ({ data }) => <div>{data.map(({ employee_id }) => employeeFIOLabelFunction(flux)(employee_id)).join(', ')}</div>,
  });

  return (
    <Table
      title="Шаблоны наряд-заданий"
      renderers={renderers}
      results={props.data}
      tableMeta={getTableMeta(props)}
      initialSort={'number'}
      initialSortAscending={false}
      {...props}
    />
  );
};

DataTable.propTypes = {
  structures: React.PropTypes.array,
  flux: React.PropTypes.object,
};

export default DataTable;
