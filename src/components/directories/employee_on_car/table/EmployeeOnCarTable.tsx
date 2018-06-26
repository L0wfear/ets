

import * as React from 'react';
import DataTable from 'components/ui/tableNew/DataTable';

const BINDING_TYPE_OPTIONS = [
  { value: 'primary', label: 'Основное' },
  { value: 'secondary', label: 'Вторичное' },
];

export const getTableMeta = (props) => {
  return {
    cols: [
      {
        name: 'gov_number',
        displayName: 'Рег. номер ТС',
        filter: {
          type: 'multiselect',
          options: props.GOV_NUMBERS,
        },
      },
      {
        name: 'garage_number',
        displayName: 'Гаражный номер ТС',
        filter: {
          type: 'multiselect',
          options: props.GARAGE_NUMBERS,
        },
      },
      {
        name: 'driver_fio',
        displayName: 'ФИО водителя/машиниста',
        filter: {
          type: 'multiselect',
          options: props.DRIVER_FIOS,
        },
      },
      {
        name: 'binding_type',
        displayName: 'Тип закрепления ',
        filter: {
          type: 'multiselect',
          options: BINDING_TYPE_OPTIONS,
        },
        render: ({ data }) => <span>{(BINDING_TYPE_OPTIONS.find(({ value }) => value === data) || { label: '-' }).label}</span>,
      },
    ],
  };
}

const Table: React.SFC<any> = props => {
  return (
    <DataTable
      data={props.data}
      title={'Итого'}
      tableMeta={getTableMeta(props)}
      enumerated
      uniqName={'gov_number'}
      onRowClick={props.onRowClick}
      onRowDoubleClick={props.onRowDoubleClick}
      selected={props.selected}
    />
  )
}

export default Table;
