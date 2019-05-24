import * as React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

import {
  getOrders,
  getOrderHistory,
  setSelectedElementOrder,
} from 'redux-main/reducers/modules/order/action-order';

import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';
import DateFormatter from 'components/ui/DateFormatter';
import { ORDER_STATUS_LABELS, ORDER_STATUS_KEYS } from 'constants/dictionary';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

const STATUS_OPTIONS = Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({ value, label }));

/**
 * подсветка строк таблицы в зависимости от статуса ц. задания
 * @param rowData строка реестра ц. заданий
 */
const highlightClassMapper = ({ status }) => {
  if (status === ORDER_STATUS_KEYS.cancelled || status === ORDER_STATUS_KEYS.suspended) {
    return 'standart-row red_line';
  }
  if (status === ORDER_STATUS_KEYS.partially_cancelled || status === ORDER_STATUS_KEYS.partially_suspended) {
    return 'standart-row yellow_line';
  }

  return 'standart-row';
};

export const tableMeta = {
  cols: [
    {
      name: 'number', // сделать номер
      displayName: '№',
      type: 'string',
      cssClassName: 'width120',
      filter: false,
    },
    {
      name: 'create_date',
      displayName: 'Дата создания',
      type: 'date',
      filter: {
        type: 'date',
      },
    },
    {
      name: 'order_date',
      displayName: 'Начало действия',
      type: 'datetime',
      filter: false,
    },
    {
      name: 'order_date_to',
      displayName: 'Окончание действия',
      type: 'datetime',
      filter: false,
    },
    {
      name: 'order_type_id',
      displayName: 'Тип',
      type: 'string',
      filter: {
        type: 'multiselect',
        byLabel: 'order_type_name',
      },
      cssClassName: 'width60',
    },
    {
      name: 'status',
      displayName: 'Статус',
      type: 'string',
      filter: {
        type: 'multiselect',
        options: STATUS_OPTIONS,
      },
    },
  ],
};

const renderers: ISchemaRenderer = {
  order_date: ({ data }) => <DateFormatter date={data} time empty={'Не указано'} />,
  order_date_to: ({ data }) => <DateFormatter date={data} time empty={'Не указано'} />,
  status: ({ data }) => <div>{ORDER_STATUS_LABELS[data]}</div>,
  create_date: ({ data }) => <DateFormatter date={data} time empty={'Не указано'} />,
  pgm_deny: ({ data }) => <div>{data === 1 ? 'Не применять' : 'Применять'}</div>,
  order_type_id: ({ rowData }) => <div>{get(rowData, 'order_type_name', '')}</div>,
};

const Table: React.FC<any> = (props) => (
  <DataTable
    title="Реестр централизованных заданий (факсограмм)"
    results={props.data}
    renderers={renderers}
    tableMeta={tableMeta}
    serverPagination
    enumerated={false}
    externalFilter={props.changeFilter}
    externalChangeSort={props.changeSort}
    useServerFilter={true}
    useServerSort={true}
    initialSort="create_date"
    initialSortAscending={false}
    className="order"
    selectField={'id'}
    highlightClassMapper={highlightClassMapper}
    {...props}
  />
);

const mapStateToProps = (state) => ({
  data: state.order.OrdersList,
  selected: state.order.selectedElementOrder,
  filterValues: state.order.pageOptions.filter,
  haveMax: state.order.pageOptions.haveMax,
});
const mapDispatchToProps = (dispatch) => ({
  onRowSelected: ({ props: { data: selectedElementOrder } }) => {
    dispatch(setSelectedElementOrder(selectedElementOrder));
    dispatch(getOrderHistory(selectedElementOrder)(dispatch));
  },
  changeSort: (field, direction) => dispatch(getOrders({ sort_by: `${field}:${direction ? 'asc' : 'desc'}` })),
  changeFilter: (filter) => dispatch(getOrders({ filter })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
 )(Table);
