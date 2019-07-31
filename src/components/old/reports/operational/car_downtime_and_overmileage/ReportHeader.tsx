import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/old/reports/common/@types/ReportHeaderWrapper.h';

import { getToday9am, getTomorrow9am, createValidDate } from 'utils/dates';

import ReportHeaderWrapper from 'components/old/reports/common/ReportHeaderWrapper';
import Div from 'components/old/ui/Div';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';

interface IPropsReportHeader extends IPropsReportHeaderCommon, IPropsReportHeaderWrapper {
  start_date: string;
  end_date: string;
}

class ReportHeader extends React.Component<IPropsReportHeader, any> {
  handleSubmit = () => {
    const {
      start_date = getToday9am(),
      end_date = getTomorrow9am(),
    } = this.props;

    this.props.onClick({
      start_date: createValidDate(start_date),
      end_date: createValidDate(end_date),
    });
  }
  render() {
    const {
      readOnly,
      start_date = getToday9am(),
      end_date = getTomorrow9am(),
    } = this.props;

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
            date_start_id="start_date"
            date_start_value={start_date}
            date_start_time={false}
            date_end_id="end_date"
            date_end_value={end_date}
            date_end_time={false}

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
