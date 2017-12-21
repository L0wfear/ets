import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
export const tableMeta = props => ({
  cols: [
    {
      name: 'company_name',
      displayName: 'Учреждение',
      type: 'text',
      display: props ? props.isOkrug : false,
      filter: props && props.isOkrug ? { type: 'multiselect' } : false,
    },
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
        type: 'advanced-number',
      },
    },
    {
      name: 'sidewalk_area',
      displayName: 'Площадь на тротуаре, м²',
      type: 'number',
      filter: {
        type: 'advanced-number',
      },
    },
    {
      name: 'sidelines_area',
      displayName: 'Площадь на обочинах, м²',
      type: 'number',
      filter: {
        type: 'advanced-number',
      },
    },
  ],
});
const renderers = {
  roadway_area: ({ data }) => (<div> {parseFloat(data).toFixed(2)} </div>),
  sidewalk_area: ({ data }) => (<div> {parseFloat(data).toFixed(2)} </div>),
  sidelines_area: ({ data }) => (<div> {parseFloat(data).toFixed(2)} </div>),
};

export default (props) => {
  return (<Table
    title="Особо опасные места"
    results={props.data}
    tableMeta={tableMeta(props)}
    renderers={renderers}
    {...props}
  />);
};
