import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/old/reports/common/@types/ReportHeaderWrapper.h';

import { getToday859am, getYesterday9am , createValidDateTime } from 'components/@next/@utils/dates/dates';
import { GEOZONE_OBJECTS } from 'constants/dictionary';

import ReportHeaderWrapper from 'components/old/reports/common/ReportHeaderWrapper';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';
import { ExtField } from 'components/old/ui/new/field/ExtField';

interface IPropsReportHeader extends IPropsReportHeaderCommon, IPropsReportHeaderWrapper {
  date_start: Date;
  date_end: Date;
  object_type: string;
}

class ReportHeader extends React.Component<IPropsReportHeader, any> {
  getState() {
    const {
      date_start = getYesterday9am(),
      date_end = getToday859am(),
      object_type = 'dt',
    } = this.props;

    return {
      date_start,
      date_end,
      object_type,
    };
  }
  handleSubmit = () => {
    const {
      date_start,
      date_end,
      object_type,
    } = this.getState();

    this.props.onClick({
      date_start: createValidDateTime(date_start),
      date_end: createValidDateTime(date_end),
      object_type,
    });
  }
  render() {
    const { readOnly } = this.props;
    const {
      date_start,
      date_end,
      object_type,
    } = this.getState();

    return (
      <>
        <EtsBootstrap.Row className="report-page__header">
          <EtsBootstrap.Col md={4}>
            <ExtField
              type="select"
              label="Объекты"
              options={GEOZONE_OBJECTS}
              value={object_type}
              boundKeys="object_type"
              onChange={this.props.handleChange}
              clearable={false}
              disabled={readOnly}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={8}>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={12}>
                <label htmlFor=" ">Период формирования</label>
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
            <DatePickerRange
              date_start_id="date_start"
              date_start_value={date_start}
              date_end_id="date_end"
              date_end_value={date_end}

              disabled={readOnly}
              onChange={this.props.handleChange}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={3} mdOffset={9}>
            <EtsBootstrap.Button
              block
              bsSize="small"
              onClick={this.handleSubmit}
              disabled={readOnly}
            >Сформировать отчет</EtsBootstrap.Button>
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      </>
    );
  }
}

export default ReportHeaderWrapper(ReportHeader);
