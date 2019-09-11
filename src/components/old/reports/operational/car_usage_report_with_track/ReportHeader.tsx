import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/old/reports/common/@types/ReportHeaderWrapper.h';

import { getToday859am, getYesterday9am , createValidDateTime } from 'components/@next/@utils/dates/dates';
import { GEOZONE_OBJECTS } from 'constants/dictionary';

import ReportHeaderWrapper from 'components/old/reports/common/ReportHeaderWrapper';
import ExtField from 'components/@next/@ui/renderFields/Field';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';

interface IPropsReportHeader extends IPropsReportHeaderCommon, IPropsReportHeaderWrapper {
  date_start: Date;
  date_end: Date;
  geozone_type: string;
}

class ReportHeader extends React.Component<IPropsReportHeader, any> {
  getState() {
    const {
      date_start = getYesterday9am(),
      date_end = getToday859am(),
      geozone_type = 'dt',
    } = this.props;

    return {
      date_start,
      date_end,
      geozone_type,
    };
  }
  handleSubmit = () => {
    const {
      date_start,
      date_end,
      geozone_type,
    } = this.getState();

    this.props.onClick({
      date_start: createValidDateTime(date_start),
      date_end: createValidDateTime(date_end),
      geozone_type,
    });
  }
  render() {
    const { readOnly } = this.props;
    const {
      date_start,
      date_end,
      geozone_type,
    } = this.getState();

    return (
      <EtsBootstrap.Row className="report-page__header">
        <EtsBootstrap.Col md={3}>
          <ExtField
            type="select"
            label="Объекты"
            options={GEOZONE_OBJECTS}
            value={geozone_type}
            boundKeys="object_type"
            onChange={this.props.handleChange}
            clearable={false}
            disabled={readOnly}
          />
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={6}>
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
        <EtsBootstrap.Col md={3}>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <label htmlFor=" "> </label>
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Button
            block
            bsSize="small"
            onClick={this.handleSubmit}
            disabled={readOnly}
          >Сформировать отчет</EtsBootstrap.Button>
        </EtsBootstrap.Col>
      </EtsBootstrap.Row>
    );
  }
}

export default ReportHeaderWrapper(ReportHeader);
