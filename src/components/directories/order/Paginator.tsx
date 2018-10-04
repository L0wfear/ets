import * as React from 'react';
import { connect } from 'react-redux';
import { getOrders } from 'redux-main/reducers/modules/order/action-order';

import Paginator from 'components/ui/Paginator';
import Div from 'components/ui/Div';

const PaginatorTsx: any = Paginator;

const OrderPaginator: React.SFC<any> = props =>
  <Div hidden={!props.haveMax} >
    <PaginatorTsx
      currentPage={props.offset}
      maxPage={Math.ceil(props.total_count / 15)}
      setPage={props.setPageOrderTable}
      firstLastButtons
    />
  </Div>

const mapStateToProps = (state) => ({
  offset: state.order.pageOptions.offset,
  haveMax: state.order.pageOptions.haveMax,
  total_count: state.order.total_count,
});
const mapDispatchToProps = dispatch => ({
  setPageOrderTable: offset => dispatch(getOrders({ offset })),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrderPaginator);