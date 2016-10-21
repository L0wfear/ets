import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

export const tableMeta = {
  cols: [
    {
      name: 'address_comm',
      displayName: 'Адрес',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'roadway_area',
      displayName: 'Площадь на проезжей части, м²',
      type: 'number',
      filter: {
        type: 'string',
      },
    },
    {
      name: 'sidewalk_area',
      displayName: 'Площадь на тротуаре, м²',
      type: 'number',
      filter: {
        type: 'string',
      },
    },
    {
      name: 'sidelines_area',
      displayName: 'Площадь на обочинах, м²',
      type: 'number',
      filter: {
        type: 'string',
      },
    },
  ],
};

export default (props) => {
  const renderers = {};

  return (<Table
    title="Особо опасные места"
    results={props.data}
    tableMeta={tableMeta}
    renderers={renderers}
    {...props}
  />);
};
