import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/old/reports/common/@types/ReportHeaderWrapper.h';

import Div from 'components/old/ui/Div';
import { createValidDateTime, getYesterday9am, getToday859am } from 'components/@next/@utils/dates/dates';

import ReportHeaderWrapper from 'components/old/reports/common/ReportHeaderWrapper';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';

type IPropsReportHeader = {
  mission_date_start_from: string;
  mission_date_end_to: string;
} & IPropsReportHeaderCommon & IPropsReportHeaderWrapper;

class ReportHeader extends React.Component<IPropsReportHeader, any> {
  
  getState() {
    const {
      mission_date_start_from = getYesterday9am(),
      mission_date_end_to = getToday859am(),
    } = this.props;

    return {
      mission_date_start_from,
      mission_date_end_to,
    };
  }

  handleSubmit = () => {
    const {
      mission_date_start_from,
      mission_date_end_to,
    } = this.getState();

    this.props.onClick({
      mission_date_start_from: createValidDateTime(mission_date_start_from),
      mission_date_end_to: createValidDateTime(mission_date_end_to),
    });
  };
  render() {
    const {
      readOnly,
    } = this.props;
    const {
      mission_date_start_from,
      mission_date_end_to,
    } = this.getState();

    return (
      <EtsBootstrap.Row className="report-page__header">
        <EtsBootstrap.Col md={12}>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col mdOffset={3} md={6}>
              <Div><label htmlFor=" ">Период формирования</label></Div>
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </EtsBootstrap.Col>
        <EtsBootstrap.Col mdOffset={3} md={6}>
          <DatePickerRange
            date_start_id="mission_date_start_from"
            date_start_value={mission_date_start_from}
            date_end_id="mission_date_end_to"
            date_end_value={mission_date_end_to}

            disabled={readOnly}
            onChange={this.props.handleChange}
          />
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={3}>
          <EtsBootstrap.Button
            block
            disabled={this.props.readOnly}
            onClick={this.handleSubmit}
          >
            Сформировать отчёт
          </EtsBootstrap.Button>
        </EtsBootstrap.Col>
      </EtsBootstrap.Row>
    );
  }
}

export default ReportHeaderWrapper(ReportHeader);
