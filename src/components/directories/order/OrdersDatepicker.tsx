import * as React from 'react';
import { Row, Col } from 'react-bootstrap';

import { IPropsDatePicker } from '../../ui/@types/DatePicker.h';
import Datepicker from '../../ui/input/DatePicker';

const DatePickerTsx: React.ComponentClass<IPropsDatePicker> = Datepicker;

const OrdersDatepicker: React.SFC<any> = props =>
    <Row>
      <Col md={3} />
      <Col md={6} className="orders-date-range">
        <div className="inline-block">
          <DatePickerTsx
            date={props.dateFrom}
            onChange={props.handleChange.bind(null, 'dateFrom')}
            time={true}
          />
        </div>
        <div className="date-divider">—</div>
        <div className="inline-block">
          <DatePickerTsx
            date={props.dateTo}
            onChange={props.handleChange.bind(null, 'dateTo')}
            time={true}
          />
        </div>
      </Col>
    </Row>;

export default OrdersDatepicker;
