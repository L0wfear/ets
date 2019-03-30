import * as React from 'react';
import * as Row from 'react-bootstrap/lib/Row';
import { connect } from 'react-redux';

import { getOrders } from 'redux-main/reducers/modules/order/action-order';

import { Col } from 'react-bootstrap';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';

const OrdersDatepicker: React.FC<any> = (props) => (
  <Row>
    <Col md={6} mdOffset={3} sm={6} smOffset={3}>
      <DatePickerRange
        date_start_id="date_start"
        date_start_value={props.date_start}
        date_end_id="date_end"
        date_end_value={props.date_end}

        onChange={props.getOrders}
      />
    </Col>
  </Row>
);

const mapStateToProps = (state) => ({
  date_start: state.order.pageOptions.date_start,
  date_end: state.order.pageOptions.date_end,
});
const mapDispatchToProps = (dispatch) => ({
  getOrders: (key, value) => {
    return dispatch(getOrders({
      [key]: value,
    }));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrdersDatepicker);
