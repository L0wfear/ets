import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

const tableMeta = {
  cols: [
    {
      name: 'name',
      displayName: 'Наименование',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'measure_unit_name', //unit
      displayName: 'Единица измерения',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    // {
    //   name: 'consumable_material',
    //   display: false,
    //   displayName: 'Расходный материал',
    //   filter: {
    //     type: 'multiselect',
    //     labelFunction: consumable_material => consumable_material ? 'Да' : 'Нет',
    //   },
    // },
  ],
};

export default (props) => {
  const renderers = {
    consumable_material: ({ data }) => <div style={{ textAlign: 'center' }}><input type="checkbox" checked={!!data} readOnly /></div>,
  };

  return (<Table title="Справочник расходных материалов"
    results={props.data}
    tableMeta={tableMeta}
    renderers={renderers}
    {...props}
  />);
};
