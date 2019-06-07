import React from 'react';
import { get } from 'lodash';
import Table from 'components/ui/table/DataTable';

const forColumnLabelFunction = for_column => for_column ? 'Да' : 'Нет';

require('components/missions/mission_template/MissionTableStyle.scss');

const highlightClassMapper = (_, checkdeData) => {
  if (get(checkdeData, 'front_invalid_interval')) {
    return 'standart-row red_line';
  }

  return 'standart-row';
};

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
        name: 'car_ids',
        displayName: 'Рег. номер ТС',
        type: 'number',
        filter: {
          type: 'multiselect',
          options: govNumberFilter.map(car => ({ label: car.gov_number, value: car.asuods_id })),
        },
        cssClassName: 'width120',
      },
      {
        name: 'car_type_names',
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
        name: 'for_column',
        displayName: 'Колонна',
        type: 'number',
        cssClassName: 'width60',
        filter: {
          type: 'multiselect',
          labelFunction: forColumnLabelFunction,
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
  car_ids: ({ rowData }) => <div>{get(rowData, 'car_gov_numbers_text') || '-'}</div>,
  car_type_names: ({ rowData }) => <div>{get(rowData, 'car_type_names_text') || '-'}</div>,
  for_column: ({ data }) => <div>{forColumnLabelFunction(data)}</div>,
};

const MissionTemplatesTable = (props) => {
  return (
    <Table
      className="mission_template"
      title="Шаблоны заданий"
      renderers={renderers}
      results={props.data}
      tableMeta={getTableMeta(props)}
      initialSort="number"
      initialSortAscending={false}
      highlightClassMapper={highlightClassMapper}
      {...props}
    />
  );
};

export default MissionTemplatesTable;
