import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import { YES_NO_SELECT_OPTIONS_INT } from 'constants/dictionary';

const tableMeta = {
  cols: [
    {
      name: 'short_name',
      displayName: 'Наименование',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'has_remote_checkup',
      displayName: 'Наличие дистанционного мед. осмотра',
      type: 'boolean',
      filter: {
        type: 'multiselect',
        options: YES_NO_SELECT_OPTIONS_INT,
      },
      cssClassName: 'width60',
    },
  ],
};

const renderers = {
  has_remote_checkup: ({ data }) => <input type="checkbox" disabled checked={!!data} />,
};

export default (props) => {
  return (<Table
    title="Реестр организаций"
    results={props.data}
    tableMeta={tableMeta}
    renderers={renderers}
    initialSort={false}
    {...props}
  />);
};
