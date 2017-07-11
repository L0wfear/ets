import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';

export const tableMeta = props => ({
  cols: [
    {
      name: 'name',
      displayName: 'Производитель аккумулятора',
      type: 'text',
      filter: { type: 'multiselect' },
    },
  ],
});

export default (props) => {
  return (<Table
    title="Производители аккумуляторов"
    results={props.data}
    tableMeta={tableMeta(props)}
    enumerated={false}
    // initialSort={'full_name'}
    {...props}
  />);
};
