import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import Div from 'components/ui/Div.jsx';
import Datepicker from 'components/ui/input/date-picker/DatePicker';
import withClassMethods from 'components/compositions/vokinda-hoc/with-class-method/WithClassMethod';

const FaxogrammsDatepicker: React.SFC<any> = props => (
  <Row>
    <Col mdOffset={3} md={6} className="datepicker-range">
      <Div>
        <Datepicker date={props.create_date_from} onChange={props.handleChangeDateFrom} />
      </Div>
      <Div className="date-divider">—</Div>
      <Div>
        <Datepicker date={props.create_date_to} onChange={props.handleChangeDateTo} />
      </Div>
    </Col>
  </Row>
);

export default withClassMethods({
  handleChangeDateFrom: props => event => props.handleChange('create_date_from', event),
  handleChangeDateTo: props => event => props.handleChange('create_date_to', event),
})(FaxogrammsDatepicker);
