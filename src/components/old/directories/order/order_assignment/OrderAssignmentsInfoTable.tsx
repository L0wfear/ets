import * as React from 'react';
import { connect } from 'react-redux';
import { setSelectedElementAssignment } from 'redux-main/reducers/modules/order/action-order';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';
import DateFormatter from 'components/ui/DateFormatter';
import { ORDER_ASSIGNMENTS_STATUS_KEYS } from 'constants/dictionary';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;
const emptyArr = [];

/**
 * подсветка строк таблицы в зависимости от статуса поручения
 * @param rowData строка реестра поручений
 */
const highlightClassMapper = ({ change_status }) => {
  if (change_status === ORDER_ASSIGNMENTS_STATUS_KEYS.full) {
    return 'standart-row red_line';
  }
  if (change_status === ORDER_ASSIGNMENTS_STATUS_KEYS.partial) {
    return 'standart-row yellow_line';
  }

  return 'standart-row';
};

const meta: IDataTableSchema = {
  cols: [
    {
      name: 'tk_operation_name',
      displayName: 'Операция',
      type: 'string',
    },
    {
      name: 'object_type_name',
      displayName: 'Тип объекта',
      type: 'string',
    },
    {
      name: 'elem',
      displayName: 'Элемент',
      type: 'string',
    },
    {
      name: 'num_exec',
      displayName: 'Количество выполнений',
      type: 'string',
    },
    {
      name: 'date_from',
      displayName: 'Начало действия',
      type: 'data',
    },
    {
      name: 'date_to',
      displayName: 'Окончание действия',
      type: 'data',
    },
    {
      name: 'work_type_name',
      displayName: 'Способ выполнения операции',
      type: 'string',
    },
  ],
};

export const tableMeta = () => meta;
const renderers: ISchemaRenderer = {
  date_from: ({ data }) => <DateFormatter date={data} time empty={'Не указано'} />,
  date_to: ({ data }) => <DateFormatter date={data} time empty={'Не указано'} />,
};

const Table: React.FC<any> = (props) => {
  const { technical_operations = emptyArr } = props.dataSource;

  return (
    <DataTable
      noHeader
      normInitialData
      preventNoDataMessage
      selected={props.seleted}
      selectField={'order_operation_id'}
      initialSort="order_operation_id"
      title="Реестр поручений"
      results={technical_operations}
      renderers={renderers}
      tableMeta={tableMeta()}
      className="order"
      onRowSelected={props.onRowSelectedAssignment}
      highlightClassMapper={highlightClassMapper}
    />
  );
};

const mapStateToProps = (state) => ({
  seleted: state.order.selectedElementAssignment,
  dataSource: state.order.selectedElementOrder,
});
const mapDispatchToProps = (dispatch) => ({
  onRowSelectedAssignment: ({ props: { data: selectedElementAssignment } }) => (
    dispatch(
      setSelectedElementAssignment(selectedElementAssignment),
    )
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Table);
