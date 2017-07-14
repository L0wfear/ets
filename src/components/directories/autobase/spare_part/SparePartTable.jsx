import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';

export const tableMeta = () => ({
  cols: [
    {
      name: 'company_name',
      displayName: 'Организация',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'group_name',
      displayName: 'Группа',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'number',
      displayName: 'Номер',
      type: 'number',
      filter: { type: 'text' },
    },
    {
      name: 'name',
      displayName: 'Наименование',
      type: 'text',
      filter: {
        type: 'text',
      },
    },
    {
      name: 'measure_unit_name',
      displayName: 'Единица измерения',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'price',
      displayName: 'Цена, руб.',
      type: 'text',
      filter: {
        type: 'text',
      },
    },
  ],
});

export default (props) => {
  return (<Table
    title="Реестр запчастей"
    results={props.data}
    tableMeta={tableMeta(props)}
    enumerated={false}
    {...props}
  />);
};
