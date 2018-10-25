import * as React from 'react';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';
import * as Button from 'react-bootstrap/lib/Button';

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
    const {
      readOnly = true,
    } = this.props;

    return (
      <Row className="report-page__header">
        <Col md={8}></Col>
        <Col md={4} style={{ marginTop: 28, textAlign: 'right' }}>
          <Button
            disabled={readOnly}
            onClick={this.handleSubmit}
          >Сформировать отчёт</Button>
        </Col>
      </Row>
    );
  }
}

export default ReportHeaderWrapper(ReportHeader);
