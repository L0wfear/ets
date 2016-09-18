import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

const tableMeta = {
  cols: [
    {
      name: 'name',
      displayName: 'Полное наименование',
      type: 'string',
      filter: {
        type: 'select',
      },
    },
    {
      name: 'address',
      displayName: 'Адрес',
      type: 'string',
      filter: {
        type: 'select',
      },
    },
  ],
};

export default (props) => {
  const renderers = {};

  return (<Table
    title="Автобазы"
    results={props.data}
    tableMeta={tableMeta}
    renderers={renderers}
    {...props}
  />);
};
