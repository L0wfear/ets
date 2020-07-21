import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/old/reports/common/@types/ReportHeaderWrapper.h';

import { getToday9am, getTomorrow9am, createValidDateTime, diffDates } from 'components/@next/@utils/dates/dates';
import ExtField from 'components/@next/@ui/renderFields/Field';
import ReportHeaderWrapper from 'components/old/reports/common/ReportHeaderWrapper';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';
import { FieldLabel } from 'components/@next/@ui/renderFields/styled';

type IPropsReportHeader = {
  date_start: string;
  date_end: string;
  car: string;
} & IPropsReportHeaderCommon & IPropsReportHeaderWrapper;

class ReportHeader extends React.Component<IPropsReportHeader, any> {
  getState() {
    const {
      date_start = getToday9am(),
      date_end = getTomorrow9am(),
      car = 'all',
    } = this.props;

    return {
      date_start,
      date_end,
      car,
    };
  }
  handleSubmit = () => {
    const {
      date_start,
      date_end,
      car,
    } = this.getState();

    this.props.onClick({
      date_start: createValidDateTime(date_start),
      date_end: createValidDateTime(date_end),
      car,
    });
  };
  render() {
    const { readOnly } = this.props;

    const {
      date_start,
      date_end,
      car,
    } = this.getState();

    const CARS_OBJECTS = [
      { value: 'all', label: 'Все ТС' },
      { value: 'with_level_sensor', label: 'ТС с ДУТ' },
    ];

    let errorText = '';
    const diffDate = diffDates(date_end, date_start, 'days');

    if (diffDate <= 0) {
      errorText = 'Дата окончания периода должна быть позже даты начала';
    }

    return (
      <EtsBootstrap.Row className="report-page__header">
        <EtsBootstrap.Col md={3}>
          <ExtField
            type="select"
            label="ТС"
            options={CARS_OBJECTS}
            value={car}
            boundKeys="car"
            onChange={this.props.handleChange}
            clearable={false}
            disabled={readOnly}
          />
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={9}>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <FieldLabel>
                Период формирования
              </FieldLabel>
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={6}>
          <DatePickerRange
            date_start_id="date_start"
            date_start_value={date_start}
            date_end_id="date_end"
            date_end_value={date_end}
            date_start_error={errorText}
            disabled={readOnly}
            onChange={this.props.handleChange}
          />
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={3}>
          <EtsBootstrap.Button
            block
            disabled={this.props.readOnly || !!errorText}
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
