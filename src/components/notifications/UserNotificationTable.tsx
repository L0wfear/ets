import * as React from 'react';
import { Glyphicon } from 'react-bootstrap';

import { IDataTableSchema, ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';
import { IUserNotification } from 'api/@types/services/index.h';

import { READ_NOT_SELECT_OPTIONS_INT } from 'constants/dictionary';
import DataTableComponent from 'components/ui/table/DataTable';
import DateFormatter from 'components/ui/DateFormatter';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function tableMeta({
} = {}): IDataTableSchema {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'type_name',
        displayName: 'Тип',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'gov_number',
        displayName: 'Рег. номер ТС',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
        display: false,
      },
      {
        name: 'title',
        displayName: 'Заголовок',
        type: 'string',
        filter: false,
      },
      {
        name: 'created_at',
        displayName: 'Дата формирования уведомления',
        type: 'datetime',
        filter: false,
      },
      {
        displayName: 'Статус',
        name: 'is_read',
        type: 'boolean',
        filter: {
          type: 'multiselect',
          options: READ_NOT_SELECT_OPTIONS_INT,
        },
      },
    ],
  };

  return meta;
}

const statusStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  fontSize: 16,
};

const alertStyle: React.CSSProperties = {
  background: '#E57373',
  borderRadius: '50%',
  width: 25,
  height: 25,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const AlertIcon = () =>
  <div style={alertStyle}>
    <Glyphicon glyph="exclamation-sign"/>
  </div>;

const renderers: ISchemaRenderer<IUserNotification> = {
  created_at: ({ data }) => <DateFormatter date={data} />,
  is_read: meta =>
    <div style={statusStyle}>
      {!meta.rowData.is_read && <Glyphicon glyph="envelope"/>}
      {meta.rowData.priority === 'alert' && <AlertIcon />}
    </div>,
};

const Table: React.SFC<any> = props  => (
  <DataTable
    title="Уведомления пользователей"
    results={props.data}
    tableMeta={tableMeta(props)}
    enumerated={false}
    // initialSort={'created_at'}
    renderers={renderers}
    className="user-notification-table"
    {...props}
  />
);

export default Table;
