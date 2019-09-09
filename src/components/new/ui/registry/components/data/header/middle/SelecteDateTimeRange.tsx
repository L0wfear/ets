import * as React from 'react';
import styled from 'styled-components';

import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';
import { createValidDateTime, getToday0am, getToday2359, diffDates } from 'components/@next/@utils/dates/dates';

type SelecteDateTimeRangeOwnProps = {
  registryKey: string;
};
type SelecteDateTimeRangeProps = (
  SelecteDateTimeRangeOwnProps
  & WithSearchProps
);

const DatesContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
`;

const SelecteDateTimeRange: React.FC<SelecteDateTimeRangeProps> = React.memo(
  (props) => {
    let errorDateTo = null;
    const date_from: string = props.searchState.date_from || createValidDateTime(getToday0am());
    const date_to: string = props.searchState.date_to || createValidDateTime(getToday2359());

    if (diffDates(date_to, date_from) <= 0) {
      errorDateTo = 'Дата окончания должна быть позже даты начала';
    }

    const handleChangeDate = React.useCallback(
      (key, value) => {
        const partialSerachState = {
          date_from: props.searchState.date_from || createValidDateTime(getToday0am()),
          date_to: props.searchState.date_to || createValidDateTime(getToday2359()),
        };

        partialSerachState[key] = createValidDateTime(value) || partialSerachState[key];
        props.setDataInSearch(partialSerachState, 'push');
      },
      [props.searchState.date_from, props.searchState.date_to, props.setDataInSearch],
    );

    return (
      <DatesContainer>
        <DatePickerRange
          date_start_id="date_from"
          date_start_value={date_from}
          date_end_id="date_to"
          date_end_value={date_to}
          date_end_error={errorDateTo}
          allWidth

          onChange={handleChangeDate}
        />
      </DatesContainer>
    );
  },
);

export default withSearch<SelecteDateTimeRangeProps>(SelecteDateTimeRange);
