import React from 'react';
import { keyBy, get } from 'lodash';
import Table from 'components/ui/table/DataTable.jsx';

export const tableMeta = props => ({
  cols: [
    {
      name: 'name',
      displayName: 'Марка аккумулятора',
      type: 'text',
      filter: { type: 'multiselect' },
    },
    {
      name: 'manufacturer_id',
      displayName: 'Производитель аккумулятора',
      type: 'text',
      filter: {
        type: 'multiselect',
        options: props.batteryManufacturerList.map(({ id, name }) => ({ value: id, label: name })),
      },
    },
  ],
});

export default (props) => {
  // TODO Убрать как будет готово поле на бэке
  const batteryManufacturerList = keyBy(props.batteryManufacturerList, 'id');

  const renderers = {
    manufacturer_id: ({ data }) => <span>{get(batteryManufacturerList, [data, 'name'], 'Нет данных')}</span>,
  };

  return (<Table
    title="Марки аккумуляторов"
    results={props.data}
    tableMeta={tableMeta(props)}
    renderers={renderers}
    enumerated={false}
    // initialSort={'full_name'}
    {...props}
  />);
};
