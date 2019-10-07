import * as React from 'react';
import { get } from 'lodash';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/old/reports/common/@types/ReportHeaderWrapper.h';

import { getToday9am, getTomorrow9am, createValidDateTime } from 'components/@next/@utils/dates/dates';

import ReportHeaderWrapper from 'components/old/reports/common/ReportHeaderWrapper';
import Div from 'components/old/ui/Div';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { OBJECT_TYPE_OPTION } from 'constants/dictionary';

interface IPropsMissionProgressReportHeader extends IPropsReportHeaderCommon, IPropsReportHeaderWrapper {
  date_from: string;
  date_to: string;
  object_type: string;
  with_working_idle: string;
}

class MissionProgressReportHeader extends React.Component<IPropsMissionProgressReportHeader, any> {
  getState() {
    const {
      date_from = getToday9am(),
      date_to = getTomorrow9am(),
      object_type = 'all',
      with_working_idle = 'false',
    } = this.props;

    return {
      date_from,
      date_to,
      object_type,
      with_working_idle: with_working_idle === 'true',
    };
  }

  handleChangeWithWorkingIdle = (key, event) => {
    const value = get(event, 'target.checked', event);

    this.props.handleChange(key, value.toString());
  };
  handleSubmit = () => {
    const {
      date_from,
      date_to,
      object_type,
      with_working_idle,
    } = this.getState();

    this.props.onClick({
      date_from: createValidDateTime(date_from),
      date_to: createValidDateTime(date_to),
      object_type,
      with_working_idle,
    });
  }
  render() {
    const { readOnly } = this.props;

    const {
      date_from,
      date_to,
      object_type,
      with_working_idle,
    } = this.getState();

    return (
      <EtsBootstrap.Row className="report-page__header">
        <EtsBootstrap.Col md={12}>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={2}>
              <Div><label htmlFor=" ">Тип объекта</label></Div>
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={5}>
              <Div><label htmlFor=" ">Период формирования</label></Div>
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={2}>
              <Div><label htmlFor=" "></label></Div>
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={2}>
          <ExtField
            id={'object_type'}
            type="select"
            label={false}
            options={OBJECT_TYPE_OPTION}
            value={object_type}
            boundKeys="object_type"
            clearable={false}
            onChange={this.props.handleChange}
          />
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={5}>
          <DatePickerRange
            date_start_id="date_from"
            date_start_value={date_from}
            date_end_id="date_to"
            date_end_value={date_to}

            disabled={readOnly}
            onChange={this.props.handleChange}
          />
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={2}>
          <ExtField
            id="with_working_idle"
            type="boolean"
            label="Вывести пробеги с рабочим и холостым ходом"
            value={with_working_idle}
            boundKeys="with_working_idle"
            onChange={this.handleChangeWithWorkingIdle}
            className="checkbox-input flex-reverse"
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

export default ReportHeaderWrapper(MissionProgressReportHeader);
