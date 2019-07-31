import * as React from 'react';
import { connect } from 'react-redux';

import { IDataTableSchema } from 'components/old/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/old/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/old/ui/table/DataTable';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

const meta: IDataTableSchema = {
  cols: [
    {
      name: 'instruction',
      displayName: 'Дополнительная информация',
      type: 'string',
      filter: false,
    },
  ],
};
export const tableMeta = () => meta;

const Table: React.FC<any> = (props) => {
  const { dataSource: { instruction = '' } } = props;

  return (
    <DataTable
      noHeader
      preventNoDataMessage
      title="Реестр централизованных заданий"
      tableMeta={tableMeta()}
      className="order"
      initialSort="id"
      results={[{ id: 0, instruction }]}
    />
  );
};

const mapStateToProps = (state) => ({
  dataSource: state.order.selectedElementOrder,
});

export default connect(
  mapStateToProps,
)(Table);
