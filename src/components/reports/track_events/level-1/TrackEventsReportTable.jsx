import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import { isEmpty } from 'utils/functions';

const tableMeta = {
  cols: [
    {
      name: 'okrug_name',
      displayName: 'Округ',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'company_name',
      displayName: 'Учреждение',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'event_name',
      displayName: 'Событие',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'event_value',
      displayName: 'Объем, л',
      type: 'number',
    },
  ],
};

const renderers = {
  event_value: ({ data }) => <div>{!isEmpty(data) ? parseFloat(data).toFixed(3) : ''}</div>,
};

export default props => (
  <Table
    title="Отчет по возможным сливам топлива"
    tableMeta={tableMeta}
    renderers={renderers}
    results={props.data}
    enumerated={false}
    {...props}
  />
);
