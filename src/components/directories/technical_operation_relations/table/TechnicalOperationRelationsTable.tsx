

import * as React from 'react';
import DataTable from 'components/ui/tableNew/DataTable';

export const getTableMeta = (props) => {
  return {
    cols: [
      {
        name: 'gov_number',
        displayName: 'Рег. номер ТС',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'employees',
        displayName: 'Водители/машинисты',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'route_names_string',
        displayName: 'Маршруты',
        filter: {
          type: 'multiselect',
        },
      },
    ],
  };
}

const Table: React.SFC<any> = props => {
  return (
    <DataTable
      data={props.data}
      tableMeta={getTableMeta(props)}
      uniqName={'gov_number'}
      onRowClick={props.onRowClick}
      onRowDoubleClick={props.onRowDoubleClick}
      selected={props.selected}
      noFilter
      enumerated={false}
      children={props.children}
    />
  )
}

export default Table;
