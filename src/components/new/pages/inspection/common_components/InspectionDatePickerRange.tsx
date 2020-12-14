import * as React from 'react';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { diffDates, createValidDate, getStartOfWeek } from 'components/@next/@utils/dates/dates';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { actionLoadTimeMoscow } from 'redux-main/reducers/modules/some_uniq/time_moscow/actions';
import styled from 'styled-components';

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

type OwnProps = {
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};

const InspectionDatePickerRange: React.FC<WithSearchProps & OwnProps> = React.memo(
  ({ setDataInSearch, searchState, setRefresh }) => {
    const [datesData, setDatesData] = React.useState({
      date_start: '',
      date_end: '',
      error_date_start: '',
      error_date_end: '',
    });
    const [defaultDates, setDefaultDates] = React.useState({
      date_start: '',
      date_end: '',
    });
    const dispatch = etsUseDispatch();
    const handleChange = React.useCallback(
      (field, value) => {
        setDatesData((oldState) => {
          const newState = {
            ...oldState,
            [field]: value,
          };
          newState.error_date_start
            = diffDates(newState.date_start, newState.date_end) > 0
              ? 'Дата начала периода не может быть больше даты конца периода'
              : '';
          return newState;
        });
      },
      [datesData]
    );

    React.useEffect(() => {
      (async () => {
        const current_date = await dispatch(
          actionLoadTimeMoscow({}, { page: '' })
        );
        const date_start = createValidDate(getStartOfWeek(current_date.date));
        const date_end = createValidDate(current_date.date);
        setDefaultDates({
          date_start,
          date_end,
        });
      })();
    }, []);

    React.useEffect(() => {
      const { date_end, date_start } = defaultDates;
      const objChange = {
        date_end,
        date_start,
      };
      if (date_end && date_start) {
        if (!searchState.date_start && !searchState.date_end) {
          setDataInSearch({
            date_start,
            date_end,
          });
        } else {
          objChange.date_start = searchState.date_start;
          objChange.date_end = searchState.date_end;
        }
        Object.entries(objChange).forEach(([key, value]) => {
          handleChange(key, value);
        });
      }
    }, [defaultDates]);

    React.useEffect(() => {
      if (!searchState.date_start || !searchState.date_end) {
        setDataInSearch({
          date_start: datesData.date_start,
          date_end: datesData.date_end,
        });
      }
    }, [searchState.date_start, searchState.date_end]);

    const handleClick = React.useCallback(() => {
      const { date_end, date_start } = defaultDates;
      const objChange = {
        date_end,
        date_start,
      };
      if (!datesData.error_date_end && !datesData.error_date_start) {
        objChange.date_start = createValidDate(datesData.date_start);
        objChange.date_end = createValidDate(datesData.date_end);
      } else {
        Object.entries(objChange).forEach(([key, value]) => {
          handleChange(key, value);
        });
      }
      setDataInSearch({
        ...searchState,
        ...objChange,
      });
      setRefresh(true);
    }, [datesData, defaultDates, searchState]);

    return (
      <>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <DatePickerRange
              allWidth={false}
              label={'Показать журнал проверок за период: '}
              date_start_id='date_start'
              date_start_value={datesData.date_start}
              date_start_error={datesData.error_date_start}
              date_end_id='date_end'
              date_end_value={datesData.date_end}
              date_end_error={datesData.error_date_end}
              date_start_time={false}
              date_end_time={false}
              onChange={handleChange}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <StyledButtonContainer>
          <EtsBootstrap.Button disabled={false} onClick={handleClick}>
            Применить
          </EtsBootstrap.Button>
        </StyledButtonContainer>
      </>
    );
  }
);

export default withSearch<OwnProps>(InspectionDatePickerRange);
