import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

const tableMeta = {
  cols: [
    {
      name: 'name',
      displayName: 'Полное наименование',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'shortname',
      displayName: 'Краткое наименование',
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
    {
      name: 'productivity',
      displayName: 'Производительность (куб. м в сутки)',
      type: 'number',
      filter: {
        type: 'string',
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
