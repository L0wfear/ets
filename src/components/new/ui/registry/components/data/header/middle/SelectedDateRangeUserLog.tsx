import * as React from 'react';
import styled from 'styled-components';

import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';
import { createValidDateTime, getToday0am, getToday2359, diffDates } from 'components/@next/@utils/dates/dates';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getSessionState } from 'redux-main/reducers/selectors';

type SelectedDateRangeUserLogOwnProps = {
  registryKey: string;
};
type SelectedDateRangeUserLogProps = (
  SelectedDateRangeUserLogOwnProps
  & WithSearchProps
  );

const DatesContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  /* Во имя Edge( */
  max-width: 50%;
  min-width: 550px;
  margin-left: -15px;
`;

const SelectedDateRangeUserLog: React.FC<SelectedDateRangeUserLogProps> = React.memo(
  (props) => {
    const [datesData, setDatesData] = React.useState({
      errorDateTo: '',
      errorDateFrom: '',
      date_from: props.searchState.date_from || createValidDateTime(getToday0am()),
      date_to: props.searchState.date_to || createValidDateTime(getToday2359()),
    });
    const [error, setError] = React.useState(true);
    const userCompanyId = etsUseSelector((state) => getSessionState(state).userData.company_id);

    const handleSubmit = React.useCallback(
      () => {
        const { date_from, date_to } = datesData;

        const exportPayload = {
          date_from: date_from || createValidDateTime(getToday0am()),
          date_to: date_to || createValidDateTime(getToday2359())
        };

        props.setDataInSearch(exportPayload);
      },
      [datesData, props.setDataInSearch],
    );

    const handleChangeDate = React.useCallback(
      (key, value) => {
        setDatesData(
          (oldState) => {
            const newState = {
              ...oldState,
              [key]: value,
            };

            newState.errorDateFrom = (
              (userCompanyId
                ? (diffDates(newState.date_to, newState.date_from, 'days') > 14
                  ? 'Период формирования не должен превышать 14 дней'
                  : '')
                : (diffDates(newState.date_to, newState.date_from, 'days') > 3
                  ? 'Период формирования не должен превышать 3 дня'
                  : '')
              )
              || (
                !newState.date_from
                  ? 'Дата должна быть заполнена'
                  : ''
              )
            );

            newState.errorDateTo = (
              (
                diffDates(newState.date_from, newState.date_to) >= 0
                  ? 'Дата окончания должна быть позже даты начала'
                  : ''
              )
              || (
                !newState.date_to
                  ? 'Дата должна быть заполнена'
                  : ''
              )
            );

            if (newState.errorDateFrom || newState.errorDateTo) {
              setError(true);
            } else {
              setError(false);
            }

            return newState;
          },
        );
      },
      [datesData, error],
    );

    React.useEffect(() => {
      if (!error) {
        handleSubmit();
      }
    }, [error, datesData]);

    return (
      <DatesContainer>
        <DatePickerRange
          date_start_id="date_from"
          date_start_value={datesData.date_from}
          date_start_error={datesData.errorDateFrom}
          date_end_id="date_to"
          date_end_value={datesData.date_to}
          date_end_error={datesData.errorDateTo}
          allWidth

          onChange={handleChangeDate}
        />
      </DatesContainer>
    );
  },
);

export default withSearch<SelectedDateRangeUserLogProps>(SelectedDateRangeUserLog);
