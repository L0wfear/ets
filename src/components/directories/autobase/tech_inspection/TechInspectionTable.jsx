import React from 'react';
import DateFormatter from 'components/ui/DateFormatter.jsx';

import Table from 'components/ui/table/DataTable.jsx';

export const tableMeta = () => ({
  cols: [
    {
      name: 'company_name',
      displayName: 'Организация',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'reg_number',
      displayName: 'Регистрационный номер',
      type: 'number',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'date_end',
      displayName: 'Срок действия до',
      type: 'date',
      filter: { type: 'date' },
    },
    {
      name: 'tech_operator',
      displayName: 'Оператор технического осмотра / пункт технического осмотра',
      type: 'text',
      filter: {
        type: 'text',
      },
    },
    {
      name: 'date_start',
      displayName: 'Дата прохождения',
      type: 'date',
      filter: {
        type: 'date',
      },
    },
    {
      name: 'is_allowed',
      displayName: 'Заключение о возможности/невозможности эксплуатации ТС',
      type: 'boolean',
      filter: {
        type: 'boolean',
      },
    },
    {
      name: 'note',
      displayName: 'Примечание',
      type: 'text',
      filter: {
        type: 'text',
      },
    },
  ],
});

export default (props) => {
  const { techInspectionList = []} = props;

  const renderers = {
    date_start: ({ data }) => (<DateFormatter date={data} />),
    date_end: ({ data }) => (<DateFormatter date={data} />),

  };

  return (<Table
    title="Реестр запчастей"
    results={props.data}
    renderers={renderers}
    tableMeta={tableMeta(props)}
    initialSort={''}
    {...props}
  />);
};
