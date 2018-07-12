import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';

import { employeeFIOLabelFunction, newEmployeeFIOLabelFunction } from 'utils/labelFunctions';

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
          options: employeesList.map((option) => {
            return ({
              value: option.id,
              label: employeeFIOLabelFunction(flux)(option.id, false),
            });
          }),
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
        type: 'number',
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

export default (props) => {
  const {
    employeesList = [],
    structures = [],
    flux,
  } = props;

  const renderers = ({
    structure_id: ({ data }) => <div>{(structures.find(s => s.id === data) || { data: '' }).name}</div>,
    brigade_employee_id_list: ({ data }) => <div>
      {/* {data.map(({ employee_id }) => employeeFIOLabelFunction(flux)(employee_id)).join(', ')} */}
      {data.map(({ employee_fio }) => employee_fio).join(', ')}
    </div>,
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
