import * as React from 'react';
import { connect } from 'react-redux';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

const meta: IDataTableSchema = {
  cols: [
    {
      name: 'order_info',
      displayName: 'Дополнительная информация',
      type: 'string',
      filter: false,
    },
  ],
};
export const tableMeta = () => meta;

const Table: React.FunctionComponent<any> = (props) => {
  const { dataSource: { order_info = '' } } = props;

  return (
    <DataTable
      noHeader
      preventNoDataMessage
      title="Реестр централизованных заданий"
      tableMeta={tableMeta()}
      className="order"
      results={[{ id: 0, order_info }]}
    />
  );
};

const mapStateToProps = (state) => ({
  dataSource: state.order.selectedElementOrder,
});

export default connect(
  mapStateToProps,
)(Table);
