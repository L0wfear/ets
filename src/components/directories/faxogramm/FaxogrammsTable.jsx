import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import DateFormatter from 'components/ui/DateFormatter.jsx';

const getTableMeta = () => {
  const tableMeta = {
    cols: [
      {
        name: 'order_number',
        displayName: 'Номер',
        type: 'string',
        cssClassName: 'width120',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'create_date',
        displayName: 'Дата создания',
        type: 'datetime',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'order_date',
        displayName: 'Начало действия',
        type: 'datetime',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'order_date_to',
        displayName: 'Окончание действия',
        type: 'datetime',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'order_type_name',
        displayName: 'Тип',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
        cssClassName: 'width60',
      },
      {
        name: 'status_name',
        displayName: 'Статус',
        type: 'string',
        filter: {
          type: 'multiselect',
          options: [
            { label: 'Опубликовано', value: 'published' },
            { label: 'Отменено', value: 'cancelled' },
            { label: 'Частично отменено', value: 'partially_cancelled' },
          ],
        },
      },
      // {
      //   name: 'pgm_deny',
      //   displayName: 'ПГМ',
      //   type: 'number',
      //   filter: {
      //     type: 'multiselect',
      //   },
      //   cssClassName: 'width120',
      // },
    ],
  };

  return tableMeta;
};


export default (props) => {
  const renderers = {
    order_date: ({ data }) => <DateFormatter date={data} time empty={'Не указано'} />,
    order_date_to: ({ data }) => <DateFormatter date={data} time empty={'Не указано'} />,
    create_date: ({ data }) => <DateFormatter date={data} time empty={'Не указано'} />,
    pgm_deny: ({ data }) => <div>{data === 1 ? 'Не применять' : 'Применять'}</div>,
  };

  return (<Table
    title="Реестр факсограмм"
    results={props.data}
    renderers={renderers}
    tableMeta={getTableMeta(props)}
    serverPagination
    enumerated={false}
    externalFilter={props.changeFilter}
    externalChangeSort={props.changeSort}
    initialSort={'create_date'}
    initialSortAscending={false}
    className="auto-height-table"
    {...props}
  />);
};
