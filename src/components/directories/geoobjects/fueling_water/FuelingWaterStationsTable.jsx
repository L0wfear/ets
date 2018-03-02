import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';

export const tableMeta = ({
  isKgh = false,
  isOkrug = false,
} = {}) => ({
  cols: [
    {
      name: 'company_name',
      displayName: isKgh ? 'Наименование ГБУ' : 'Учреждение',
      type: 'string',
      display: isOkrug || isKgh,
      filter: (isOkrug || isKgh) ? { type: 'multiselect' } : false,
    },
    {
      name: 'name',
      displayName: 'Полное наименование',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'address',
      displayName: 'Адрес',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
  ],
});

const FuelingWaterStationsTable = props => (
  <Table
    title="Базы гидрантов"
    results={props.data}
    tableMeta={tableMeta(props)}
    {...props}
  />
);

export default FuelingWaterStationsTable;
