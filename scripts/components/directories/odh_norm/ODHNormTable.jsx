import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

const tableMeta = {
  cols: [
    {
      name: 'name',
      displayName: 'Норматив по содержанию ОДХ',
      type: 'text',
      filter: {
        type: 'select',
      },
    },
    {
      name: 'unit',
      displayName: 'Единица измерения',
      type: 'text',
      filter: false,
    },
    {
      name: 'consumable_material',
      displayName: 'Расходный материал',
      filter: {
        type: 'select',
        labelFunction: consumable_material => consumable_material ? 'Да' : 'Нет',
      },
    },
  ],
};

export default (props) => {
  const renderers = {
    consumable_material: ({ data }) => <div style={{ textAlign: 'center' }}><input type="checkbox" checked={!!data} readOnly /></div>,
  };

  return (<Table title="Нормативы по содержанию ОДХ"
    results={props.data}
    tableMeta={tableMeta}
    renderers={renderers}
    {...props}
  />);
};
