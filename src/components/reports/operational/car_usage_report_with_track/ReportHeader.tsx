import * as React from 'react';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';
import * as Button from 'react-bootstrap/lib/Button';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/reports/common/@types/ReportHeaderWrapper.h';

import { getToday859am, getYesterday9am , createValidDateTime } from 'utils/dates';
import { GEOZONE_OBJECTS } from 'constants/dictionary';

import ReportHeaderWrapper from 'components/reports/common/ReportHeaderWrapper';
import { ExtField } from 'components/ui/new/field/ExtField';
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
      <Row className="report-page__header">
        <Col md={3}>
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
        </Col>
        <Col md={6}>
          <Row>
            <Col md={12}>
              <label htmlFor=" ">Период формирования</label>
            </Col>
          </Row>
          <DatePickerRange
            date_start_id="date_start"
            date_start_value={date_start}
            date_end_id="date_end"
            date_end_value={date_end}

            disabled={readOnly}
            onChange={this.props.handleChange}
          />
        </Col>
        <Col md={3}>
          <Row>
            <Col md={12}>
              <label htmlFor=" "> </label>
            </Col>
          </Row>
          <Button
            block
            bsSize="small"
            onClick={this.handleSubmit}
            disabled={readOnly}
          >Сформировать отчет</Button>
        </Col>
      </Row>
    );
  }
}

export default ReportHeaderWrapper(ReportHeader);
