import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/old/reports/common/@types/ReportHeaderWrapper.h';

import ReportHeaderWrapper from 'components/old/reports/common/ReportHeaderWrapper';

type IPropsReportHeader = {
  date_start: string;
  date_end: string;
} & IPropsReportHeaderCommon & IPropsReportHeaderWrapper;

class ReportHeader extends React.Component<IPropsReportHeader, any> {
  handleSubmit = () => this.props.onClick({});

  render() {
    return (
      <EtsBootstrap.Row className="report-page__header">
        <EtsBootstrap.Col md={8}></EtsBootstrap.Col>
        <EtsBootstrap.Col md={4} style={{ marginTop: 28, textAlign: 'right' }}>
          <EtsBootstrap.Button
            disabled={this.props.readOnly}
            onClick={this.handleSubmit}
          >Сформировать отчёт</EtsBootstrap.Button>
        </EtsBootstrap.Col>
      </EtsBootstrap.Row>
    );
  }
}

export default ReportHeaderWrapper(ReportHeader);
