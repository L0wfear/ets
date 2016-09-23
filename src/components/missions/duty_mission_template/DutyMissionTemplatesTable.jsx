import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';

const getTableMeta = () => {
  const tableMeta = {
    cols: [
      {
        name: 'number',
        displayName: 'Номер',
        type: 'number',
        cssClassName: 'width60',
      },
      {
        name: 'route_name',
        displayName: 'Маршрут',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'technical_operation_name',
        displayName: 'Технологическая операция',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'comment',
        displayName: 'Комментарий',
        type: 'string',
        filter: false,
        cssClassName: 'width300',
      },
    ],
  };

  return tableMeta;
};


export default props =>
  <Table
    title="Шаблоны наряд-заданий"
    results={props.data}
    tableMeta={getTableMeta(props)}
    initialSort={'number'}
    initialSortAscending={false}
    {...props}
  />
;
