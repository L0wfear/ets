import * as React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { isEqual, pick } from 'lodash';

import Field from 'components/ui/Field.jsx';
import Datepicker from 'components/ui/DatePicker.jsx';
import { getToday9am, getTomorrow9am, createValidDate } from 'utils/dates';
import { bindable } from 'utils/decorators';

import ReportHeaderWrapper from './ReportHeaderWrapper';

const DatePicker: any = bindable(Datepicker);

class ReportHeader extends React.Component<any, any> {
  constructor() {
    super();
    this.state = this.initState();
  }

  initState() {
    return {
      date_from: getToday9am(),
      date_to: getTomorrow9am(),
    };
  }

  componentWillReceiveProps(nextProps) {
    const filteredState = pick(nextProps.queryState, Object.keys(this.state));
    const queryStateLength = Object.keys(filteredState).length;

    if (
      queryStateLength > 0 &&
      !isEqual(this.state, filteredState)
    ) {
      this.setState(filteredState);
      return;
    }

    if (queryStateLength === 0) {
      this.setState(this.initState());
      return;
    }
  }
  handleSubmit = () => {
    this.props.onClick({
      date_from: createValidDate(this.state.date_from),
      date_to: createValidDate(this.state.date_to),
    });
  }
  handleChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }
  render() {
    const { readOnly } = this.props;

    return (
      <div>
        <DatePicker
          date={this.state.date_from}
          onChange={this.handleChange}
          bindOnChange={'date_from'}
          disabled={readOnly}
        />
        <DatePicker
          date={this.state.date_to}
          onChange={this.handleChange}
          bindOnChange={'date_to'}
          disabled={readOnly}
        />
        <Button hidden={this.props.readOnly} onClick={this.handleSubmit}>Submit</Button>
      </div>
    );
  }
}

export default ReportHeaderWrapper<any>(ReportHeader);
