import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  getOrders,
  resetOrder,
  setSelectedElementOrder,
} from 'redux-main/reducers/modules/order/action-order';
import connectToStores from 'flummox/connect';
import * as queryString from 'query-string';

import { FluxContext } from 'utils/decorators';

import OrdersDatepicker from 'components/directories/order/OrdersDatepicker';
import OrdersTable from 'components/directories/order/OrdersTable';
import OrderTableChildren from 'components/directories/order/OrderTableChildren';
import OrderFormWrap from 'components/directories/order/OrderFormWrap';

import OrderAssignmentsList from 'components/directories/order/order_assignment/OrderAssignmentsList';
import HistoryOrderList from 'components/directories/order/order_history/HistoryOrderList';
import Paginator from 'components/directories/order/Paginator';

import { EtsPageWrap } from 'global-styled/global-styled';
import { isString } from 'util';

import { actionLoadAppConfig } from 'redux-main/reducers/modules/session/action_get_config';

require('components/directories/order/Order.scss');

@FluxContext
class OrderList extends React.Component<any, any> {
  context: any;

  componentDidUpdate(prevProps) {
    if (prevProps.configDateStart !== this.props.configDateStart) {
      prevProps.getOrders({
        date_start: this.props.configDateStart,
        date_end: this.props.configDateEnd,
      });
    }
  }
  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('employees').getEmployees({ active: true });
    flux.getActions('objects').getCars();
    this.props.actionLoadAppConfig();
    const {
      location: { search },
    } = this.props;

    const {
      idOrder,
      dateFrom: date_start,
      dateTo: date_end,
    } = queryString.parse(search);

    let outerIdFax = null;
    if (isString(idOrder)) {
      outerIdFax = Number.parseInt(idOrder, 0);
    }

    const newPartPageOptions = {
      limit: !!outerIdFax ? 10000 : 15,
      date_start,
      date_end,
      haveMax: !outerIdFax,
    };

    this.props
      .getOrders(newPartPageOptions)
      .then(
        ({ payload: { OrdersList } }) => {
          if (!isNaN(outerIdFax)) {
            const selectedElementOrder = OrdersList.find(
              ({ id }) => id === outerIdFax,
            );

            if (selectedElementOrder) {
              this.props.setSelectedElementOrder(selectedElementOrder);
            }

            this.props.history.replace('/orders');
          }
        },
      );

    const etsName = __DEVELOPMENT__ ? `__ETS::${process.env.STAND.toUpperCase()}__` : 'ЕТС';
    if (document) {
      document.title = `${etsName} Реестр централизованных заданий `;
    }
  }

  componentWillUnmount() {
    this.props.resetOrder();
    const etsName = __DEVELOPMENT__ ? `__ETS::${process.env.STAND.toUpperCase()}__` : 'ЕТС';

    if (document) {
      document.title = etsName;
    }
  }

  render() {
    return (
      <EtsPageWrap inheritDisplay>
        <OrdersDatepicker />
        <OrdersTable>
          <OrderTableChildren />
        </OrdersTable>
        <Paginator />
        <OrderAssignmentsList />
        <HistoryOrderList />
        <OrderFormWrap />
      </EtsPageWrap>
    );
  }
}

const mapStateToProps = (state) => ({
  OrdersList: state.order.OrdersList,
  selectedElementOrder: state.order.selectedElementOrder,
  configDateStart: state.session.appConfig.shift.shift_start,
  configDateEnd: state.session.appConfig.shift.shift_end,
  shift: state.session.appConfig.shift,
});
const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      getOrders,
      resetOrder,
      setSelectedElementOrder,
      actionLoadAppConfig,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectToStores(OrderList, ['objects', 'missions']));
