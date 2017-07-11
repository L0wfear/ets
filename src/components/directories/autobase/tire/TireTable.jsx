import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import { get } from 'lodash';

export const tableMeta = props => ({
  cols: [
    {
      name: 'tire_model_id',
      displayName: 'Модель шины',
      type: 'text',
      filter: {
        type: 'multiselect',
        options: props.tireModelList.map(({ id, name }) => ({ value: id, label: name })),
      },
    },
    {
      name: 'tire_size_id',
      displayName: 'Размер',
      type: 'text',
      filter: {
        type: 'multiselect',
        options: props.tireSizeList.map(({ id, name }) => ({ value: id, label: name })),
      },
    },
    {
      name: 'comment',
      displayName: 'Комментарий',
      type: 'text',
      filter: {
        type: 'string',
      },
    },
    {
      name: 'odometr_diff',
      displayName: 'Пробег, км',
      type: 'text',
      filter: {
        type: 'string',
      },
    },
    {
      name: 'motohours_diff',
      displayName: 'Наработка, мч',
      type: 'text',
      filter: {
        type: 'string',
      },
    },
  ],
});

export default (props) => {
  const renderers = {
    tire_model_id: ({ data }) => <div>{get(props.tireModelList.find(s => s.id === data), 'name', '')}</div>,
    tire_size_id: ({ data }) => <div>{get(props.tireSizeList.find(s => s.id === data), 'name', '')}</div>,
  };

  return (<Table
    title="Реестр шин"
    results={props.data}
    tableMeta={tableMeta(props)}
    renderers={renderers}
    // initialSort={'full_name'}
    {...props}
  />);
};
