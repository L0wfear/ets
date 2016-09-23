import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

const tableMeta = {
  cols: [
    {
      name: 'asuods_id',
      displayName: 'ID организации',
      type: 'number',
      filter: {
        type: 'string',
      },
    },
    {
      name: 'name',
      displayName: 'Наименование',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'short_name',
      displayName: 'Краткое наименование',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'ogrn',
      displayName: 'ОГРН',
      type: 'string',
      filter: {
        type: 'string',
      },
    },
    {
      name: 'inn',
      displayName: 'ИНН',
      type: 'string',
      filter: {
        type: 'string',
      },
    },
    {
      name: 'postal_address',
      displayName: 'Почтовый адрес',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'email',
      displayName: 'Электронный адрес',
      type: 'string',
      filter: {
        type: 'string',
      },
    },
    {
      name: 'phone',
      displayName: 'Телефон',
      type: 'string',
      filter: {
        type: 'string',
      },
    },
    {
      name: 'fax',
      displayName: 'Факс',
      type: 'string',
      filter: {
        type: 'string',
      },
    },
  ],
};

export default (props) => {
  return (<Table
    title="Организации"
    results={props.data}
    tableMeta={tableMeta}
    {...props}
  />);
};
