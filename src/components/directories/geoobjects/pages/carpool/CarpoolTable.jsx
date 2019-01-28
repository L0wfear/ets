import React from 'react';
import Table from 'components/ui/table/DataTable';

export const tableMeta = ({
  isKgh = false,
  isOkrug = false,
} = {}) => ({
  cols: [
    {
      name: 'company_name',
      displayName: isKgh ? 'Наименование ГБУ' : 'Учреждение',
      type: 'string',
      display: isKgh || isOkrug,
      filter: (isKgh || isOkrug) ? { type: 'multiselect' } : false,
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

export default (props) => {
  return (
    <Table
      title="Автобазы"
      results={props.data}
      initialSort={props.selectField}
      tableMeta={tableMeta(props)}
      renderers={renderers}
      {...props}
    />
  );
};
