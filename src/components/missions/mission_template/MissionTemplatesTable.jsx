import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import { get } from 'lodash';

export const getTableMeta = ({ 
  structures = [],
  govNumberFilter = [],
  }) => {
  const tableMeta = {
    cols: [
      {
        name: 'number',
        displayName: 'Номер',
        type: 'number',
        cssClassName: 'width60',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'name',
        displayName: 'Наименование',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'car_gov_number',
        displayName: 'Рег. номер ТС',
        type: 'number',
        filter: {
          type: 'multiselect',
          options: govNumberFilter.map(car => ({ label: car.gov_number, value: car.asuods_id })),
        },
        cssClassName: 'width120',
      },
      {
        name: 'car_type_name',
        displayName: 'Тип техники',
        type: 'number',
        filter: {
          type: 'multiselect',
        },
        cssClassName: 'width120',
      },
      {
        name: 'route_name',
        displayName: 'Маршрут',
        type: 'number',
        filter: {
          type: 'multiselect',
        },
        cssClassName: 'width120',
      },
      {
        name: 'passes_count',
        displayName: 'Количество циклов',
        type: 'number',
        filter: {
          type: 'multiselect',
        },
        cssClassName: 'width120',
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
        name: 'structure_id',
        displayName: 'Подразделение',
        cssClassName: 'width80',
        type: 'string',
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
      },
    ],
  };

  return tableMeta;
};

const renderers = {
  structure_id: ({ rowData }) => <div>{get(rowData, 'structure_name') || '-'}</div>,
};

export default (props) => {

  return (
    <Table
      title="Шаблоны заданий"
      renderers={renderers}
      results={props.data}
      tableMeta={getTableMeta(props)}
      initialSort={'number'}
      initialSortAscending={false}
      {...props}
    />
  );
};
