import * as React from 'react';
import { Button, Row, Col } from 'react-bootstrap';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/reports/common/@types/ReportHeaderWrapper.h';

import Div from 'components/ui/Div.jsx';
import Datepicker from 'components/ui/input/DatePicker';
import { getYesterday9am , createValidDateTime } from 'utils/dates';
import { bindable } from 'utils/decorators';

import ReportHeaderWrapper from 'components/reports/common/ReportHeaderWrapper';

const DatePicker: any = bindable(Datepicker);

interface IPropsReportHeader extends IPropsReportHeaderCommon, IPropsReportHeaderWrapper {
  date: Date;
}

class ReportHeader extends React.Component<IPropsReportHeader, any> {
  getState() {
    const {
      date = getYesterday9am(),
    } = this.props;

    return {
      date,
    };
  }
  handleSubmit = () => {
    const {
      date,
    } = this.getState();

    this.props.onClick({
      date: createValidDateTime(date),
    });
  }
  render() {
    const { readOnly } = this.props;
    const {
      date,
    } = this.getState();

    return (
      <Div>
        <Row>
          <Col md={4}>
            <Div><label htmlFor=" ">Дата формирования</label></Div>
            <Div className="inline-block reports-date">
              <DatePicker
                date={date}
                onChange={this.props.handleChange}
                bindOnChange={'date'}
                disabled={readOnly}
              />
            </Div>
          </Col>
          <Col md={6}>
          </Col>
          <Col md={2} style={{ marginTop: 28, textAlign: 'right' }}>
            <Button
              bsSize="small"
              onClick={this.handleSubmit}
              disabled={readOnly}
            >Сформировать отчет</Button>
          </Col>
        </Row>
      </Div>
    );
  }
}

export default ReportHeaderWrapper(ReportHeader);
