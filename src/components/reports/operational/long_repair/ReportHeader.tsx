import * as React from 'react';
import { Button, Row, Col } from 'react-bootstrap';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/reports/common/@types/ReportHeaderWrapper.h';

import ReportHeaderWrapper from 'components/reports/common/ReportHeaderWrapper';

interface IPropsReportHeader extends IPropsReportHeaderCommon, IPropsReportHeaderWrapper {
  date_start: string;
  date_end: string;
}

class ReportHeader extends React.Component<IPropsReportHeader, any> {
  handleSubmit = () => this.props.onClick({});

  render() {
    return (
      <Row className="report-page__header">
        <Col md={4}></Col>
        <Col md={4}></Col>
        <Col md={4} style={{ marginTop: 28, textAlign: 'right' }}>
          <Button
            disabled={this.props.readOnly}
            onClick={this.handleSubmit}
          >Сформировать отчёт</Button>
        </Col>
      </Row>
    );
  }
}

export default ReportHeaderWrapper(ReportHeader);
