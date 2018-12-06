import * as React from 'react';
import DataTable from 'components/ui/tableNew/DataTable';

const filterByRoutes = (f_data, value, rowData) => {
  return !f_data.value.some((val) => rowData.routes.some(({ id }) => id === val));
};

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
        name: 'route_names',
        displayName: 'Маршруты',
        filter: {
          type: 'multiselect',
          options: props.ROUTES_OPTIONS,
          customFilter: filterByRoutes,
        },
      },
    ],
  };
};

const Table: React.FunctionComponent<any> = (props) => {
  return (
    <DataTable
      data={props.data}
      tableMeta={getTableMeta(props)}
      uniqName={'car_id'}
      onRowClick={props.onRowClick}
      onRowDoubleClick={props.onRowDoubleClick}
      selected={props.selected}
      enumerated={false}
      children={props.children}
    />
  );
};

export default Table;
