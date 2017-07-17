import React from 'react';
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
      name: 'manufacturer_name',
      displayName: 'Производитель аккумулятора',
      type: 'text',
      cssClassName: 'width300',
      filter: {
        type: 'multiselect',
        options: props.batteryManufacturerList.map(({ name }) => ({ value: name, label: name })),
      },
    },
  ],
});

export default (props) => {
  return (<Table
    title="Марки аккумуляторов"
    results={props.data}
    tableMeta={tableMeta(props)}
    lowerCaseSorting
    {...props}
  />);
};
