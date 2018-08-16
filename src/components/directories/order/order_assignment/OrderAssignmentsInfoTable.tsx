import * as React from 'react';
import { connect } from 'react-redux';
import { setSelectedElementAssignment } from 'redux/modules/order/action-order';
  
import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';
import DateFormatter from 'components/ui/DateFormatter';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;
const emptyArr = [];

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

const Table: React.SFC<any> = props  => {
  const { technical_operations = emptyArr } = props.dataSource;

  return (
    <DataTable
      noHeader
      normInitialData
      preventNoDataMessage
      selected={props.seleted}
      selectField={'order_operation_id'}
      title="Реестр централизованных заданий"
      results={technical_operations}
      renderers={renderers}
      tableMeta={tableMeta()}
      className="order"
      onRowSelected={props.onRowSelectedAssignment}
    />
  );
};

const mapStateToProps = (state) => ({
  seleted: state.order.selectedElementAssignment,
  dataSource: state.order.selectedElementOrder,
});
const mapDispatchToProps = dispatch => ({
  onRowSelectedAssignment: ({ props: { data: selectedElementAssignment } }) => (
    dispatch(
      setSelectedElementAssignment(selectedElementAssignment)
    )
  ),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Table);
