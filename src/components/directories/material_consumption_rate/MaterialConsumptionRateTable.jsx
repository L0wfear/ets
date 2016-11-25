import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';

const tableMeta = {
  cols: [
    {
      name: 'technical_operation_name',
      displayName: 'Технологическая операция',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'consumable_material_name',
      displayName: 'Расходный материал',
      type: 'text',
      filter: false,
    },
    {
      name: 'season_name',
      displayName: 'Сезон',
      type: 'text',
      filter: false,
      cssClassName: 'width80',
    },
    {
      name: 'clean_category_name',
      displayName: 'Категория',
      type: 'text',
      filter: false,
    },
    {
      name: 'clean_subcategory_name',
      displayName: 'Подкатегория',
      type: 'text',
      filter: false,
    },
    {
      name: 'value',
      displayName: 'Норма',
      type: 'text',
      filter: false,
      cssClassName: 'width60',
    },
  ],
};

export default (props) => {
  const renderers = {
  };

  return (<Table title="Справочник норм на расход расходных материалов"
    results={props.data}
    tableMeta={tableMeta}
    renderers={renderers}
    {...props}
  />);
};
