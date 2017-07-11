import React from 'react';
import { keyBy, get } from 'lodash';
import Table from 'components/ui/table/DataTable.jsx';

export const tableMeta = props => ({
  cols: [
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
      displayName: 'Цена',
      type: 'text',
      filter: {
        type: 'text',
      },
    },
  ],
});

export default (props) => {
  // TODO Убрать как будет готово поле на бэке

  const renderers = {};

  return (<Table
    title="Реестр запчастей"
    results={props.data}
    tableMeta={tableMeta(props)}
    renderers={renderers}
    enumerated={false}
    {...props}
  />);
};
