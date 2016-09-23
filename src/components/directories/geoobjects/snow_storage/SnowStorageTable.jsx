import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

const tableMeta = {
  cols: [
    {
      name: 'name',
      displayName: 'Наименование',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'address',
      displayName: 'Адрес',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
  ],
};

export default (props) => {
  return (<Table
    title="Стационарные снегоплавильные пункты"
    results={props.data}
    tableMeta={tableMeta}
    {...props}
  />);
};
