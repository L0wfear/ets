import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';

const tableMeta = {
  cols: [
    {
      name: 'technical_operation_name',
      displayName: 'Технологическая операция',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'maintenance_work_name',
      displayName: 'Наименование регламентной работы',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'season_name',
      displayName: 'Сезон',
      filter: {
        type: 'multiselect',
      },
      cssClassName: 'width80',
    },
    {
      name: 'clean_category_name',
      displayName: 'Категория',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'clean_subcategory_name',
      displayName: 'Подкатегория',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'value',
      displayName: 'Норма',
      cssClassName: 'width60',
    },
    {
      name: 'measure_unit_name',
      displayName: 'Единица измерения',
      cssClassName: 'width60',
      filter: {
        type: 'multiselect',
      },
    },
  ],
};

export default (props) => {
  const renderers = {};

  return (
    <Table
      title="Нормы на содержание объектов"
      results={props.data}
      tableMeta={tableMeta}
      renderers={renderers}
      {...props}
    />
  );
};
