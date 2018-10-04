import * as React from 'react';
import * as PropTypes from 'prop-types';
import Table from 'components/ui/table/DataTable';
import DateFormatter from 'components/ui/DateFormatter';

export const tableMeta = ({
  isOkrug = false,
}) => ({
  cols: [
    {
      name: 'company_name',
      displayName: 'Учреждение',
      type: 'text',
      display: isOkrug,
      filter: isOkrug ? { type: 'multiselect' } : false,
    },
    {
      name: 'timestamp',
      displayName: 'Дата действия',
      type: 'date',
      filter: {
        type: 'date',
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
      type: 'number',
      filter: {
        type: 'advanced-number',
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
    {
      displayName: 'ФИО',
      name: 'fio',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
  ],
});

const renderers = {
  timestamp: ({ data }) => <DateFormatter date={data} time />,
};

const UserActionLogTable = props => (
  <Table
    title="Журнал действий пользователей"
    initialSort="timestamp"
    initialSortAscending={false}
    results={props.data}
    tableMeta={tableMeta(props)}
    renderers={renderers}
    {...props}
  />
);

UserActionLogTable.propTypes = {
  data: PropTypes.array,
};

export default UserActionLogTable;
