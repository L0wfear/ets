import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import DateFormatter from 'components/ui/DateFormatter.jsx';

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
      name: 'timestamp',
      displayName: 'Дата действия',
      type: 'text',
      filter: {
        type: 'datetime',
      },
    },
    {
      name: 'user_login',
      displayName: 'Логин пользователя',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'remote_ip',
      displayName: 'IP адрес',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    // {
    //   name: 'action',
    //   displayName: 'Название страницы',
    //   type: 'text',
    //   filter: {
    //     type: 'multiselect',
    //   },
    // },
    {
      name: 'entity_number',
      displayName: 'Номер документа',
      type: 'text',
      filter: {
        type: 'string',
      },
    },
    {
      name: 'action_name',
      displayName: 'Действие',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
  ],
});

const UserActionLogTable = (props) => {
  const renderers = {
    timestamp: ({ data }) => <DateFormatter date={data} time />,
  };

  return (<Table
    title="Журнал действий пользователей"
    initialSort="timestamp"
    initialSortAscending={false}
    results={props.data}
    tableMeta={tableMeta(props)}
    renderers={renderers}
    {...props}
  />);
};

export default UserActionLogTable;
