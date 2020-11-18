import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/old/reports/common/@types/ReportHeaderWrapper.h';

import {
  getToday859am,
  getYesterday9am,
  createValidDateTime,
  diffDates,
} from 'components/@next/@utils/dates/dates';

import ReportHeaderWrapper from 'components/old/reports/common/ReportHeaderWrapper';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { OBJECT_TYPE_OPTION } from 'constants/dictionary';
import { FieldLabel } from 'components/@next/@ui/renderFields/styled';

type IPropsNotCoveredObjectsReportHeader = {
  date_from: string;
  date_to: string;
  object_type: string;
  with_working_idle: string;
} & IPropsReportHeaderCommon &
  IPropsReportHeaderWrapper;

const NotCoveredObjectsReportHeader: React.FC<IPropsNotCoveredObjectsReportHeader> = React.memo(
  (props) => {
    const {
      readOnly,
      date_from = getYesterday9am(),
      date_to = getToday859am(),
      object_type = 'all',
      onClick,
    } = props;

    const handleSubmit = React.useCallback(() => {
      onClick({
        date_from: createValidDateTime(date_from),
        date_to: createValidDateTime(date_to),
        object_type,
      });
    }, [date_from, date_to, onClick, object_type]);

    const validDateRange = React.useMemo(() => {
      const diffDate = diffDates(date_to, date_from, 'days');
      const date_start_error
        = diffDate < 0
          ? 'Дата начала периода не должна быть больше даты окончания периода'
          : '';

      return {
        date_start_error,
      };
    }, [date_to, date_from]);

    return (
      <EtsBootstrap.Row className="report-page__header">
        <EtsBootstrap.Col md={9}>
          <EtsBootstrap.Col md={3}>
            <ExtField
              id={'object_type'}
              type="select"
              label={'Тип объекта'}
              options={OBJECT_TYPE_OPTION}
              value={object_type}
              boundKeys="object_type"
              clearable={false}
              onChange={props.handleChange}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={9}>
            <DatePickerRange
              date_start_id="date_from"
              date_start_value={date_from}
              date_end_id="date_to"
              date_end_value={date_to}
              date_start_error={validDateRange.date_start_error}
              disabled={readOnly}
              onChange={props.handleChange}
              label={'Период формирования'}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={3}>
          <FieldLabel>&nbsp;</FieldLabel>
          <EtsBootstrap.Button
            block
            bsSize="input"
            disabled={props.readOnly || Boolean(validDateRange.date_start_error)}
            onClick={handleSubmit}
          >
            Сформировать отчёт
          </EtsBootstrap.Button>
        </EtsBootstrap.Col>
      </EtsBootstrap.Row>
    );
  }
);

export default ReportHeaderWrapper(NotCoveredObjectsReportHeader);
