import * as React from 'react';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import { connect } from 'react-redux';

import { getOrders } from 'redux-main/reducers/modules/order/action-order';
import { onChangeWithKeyOfObject, IOnChangeWithKeyOfObject } from 'components/compositions/hoc';

import { IPropsDatePicker } from 'components/ui/@types/DatePicker.h';
import Datepicker from 'components/ui/input/date-picker/DatePicker';

const DatePickerTsx: React.ComponentClass<IPropsDatePicker & IOnChangeWithKeyOfObject> = onChangeWithKeyOfObject(Datepicker) as any;

const OrdersDatepicker: React.FunctionComponent<any> = (props) =>
    <Row>
      <Col mdOffset={3} md={6} className="datepicker-range">
        <div>
          <DatePickerTsx
            date={props.date_start}
            onChange={props.getOrders}
            boundKey={'date_start'}
            time={true}
          />
        </div>
        <div className="date-divider">—</div>
        <div>
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
const mapDispatchToProps = (dispatch) => ({
  getOrders: (props) => dispatch(getOrders(props)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrdersDatepicker);
