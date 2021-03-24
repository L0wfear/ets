import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/old/reports/common/@types/ReportHeaderWrapper.h';

import ReportHeaderWrapper from 'components/old/reports/common/ReportHeaderWrapper';
import {
  createValidDate,
  getYesterday0am,
  getAWeekBefore,
  diffDates,
} from 'components/@next/@utils/dates/dates';
import { FieldLabel } from 'components/@next/@ui/renderFields/styled';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';

type IPropsReportHeader = {
  date_from: string;
  date_to: string;
} & IPropsReportHeaderCommon & IPropsReportHeaderWrapper;

const ReportHeader: React.FC<IPropsReportHeader> = React.memo(
  (props) => {
    const {
      readOnly,
      date_from = getAWeekBefore(),
      date_to = getYesterday0am(),
      onClick,
    } = props;

    const handleSubmit = React.useCallback(() => {
      onClick({
        date_from: createValidDate(date_from),
        date_to: createValidDate(date_to),
      });
    }, [date_from, date_to, onClick]);

    const validDateRange = React.useMemo(() => {
      const diffDate = diffDates(date_to, date_from, 'days');
      const date_start_error
        = diffDate < 0
          ? 'Дата окончания периода формирования не может быть меньше даты начала'
          : diffDate > 7 ? 'Период формирования отчета не должен превышать 7 дней' : '';

      return {
        date_start_error,
      };
    }, [date_to, date_from]);

    return (
      <EtsBootstrap.Row className="report-page__header">
        <EtsBootstrap.Col md={12}>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col mdOffset={3} md={6}>
              <FieldLabel>
                Период формирования
              </FieldLabel>
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </EtsBootstrap.Col>
        <EtsBootstrap.Col mdOffset={3} md={6}>
          <DatePickerRange
            date_start_id="date_from"
            date_start_value={date_from}
            date_start_time={false}
            date_start_error={validDateRange.date_start_error}
            date_end_id="date_to"
            date_end_value={date_to}
            date_end_time={false}

            disabled={readOnly}
            onChange={props.handleChange}
          />
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={3}>
          <EtsBootstrap.Button
            block
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

export default ReportHeaderWrapper(ReportHeader);
