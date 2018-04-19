import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import {
  getOrders,
} from 'redux/modules/order/action-order';
import { onChangeWithKeyOfObject, IOnChangeWithKeyOfObject } from 'components/compositions/hoc';

import { connect } from 'react-redux';

import { IPropsDatePicker } from 'components/ui/@types/DatePicker.h';
import Datepicker from 'components/ui/input/DatePicker';

const DatePickerTsx: React.ComponentClass<IPropsDatePicker & IOnChangeWithKeyOfObject> = onChangeWithKeyOfObject(Datepicker);


const OrdersDatepicker: React.SFC<any> = props =>
    <Row>
      <Col mdOffset={3} md={6} className="orders-date-range">
        <div className="inline-block">
          <DatePickerTsx
            date={props.date_start}
            onChange={props.getOrders}
            boundKey={'date_start'}
            time={true}
          />
        </div>
        <div className="date-divider">—</div>
        <div className="inline-block">
          <DatePickerTsx
            date={props.date_end}
            onChange={props.getOrders}
            boundKey={'date_end'}
            time={true}
          />
        </div>
      </Col>
    </Row>;

const mapStateToProps = (state) => ({
  date_start: state.order.pageOptions.date_start,
  date_end: state.order.pageOptions.date_end,
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getOrders,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrdersDatepicker);