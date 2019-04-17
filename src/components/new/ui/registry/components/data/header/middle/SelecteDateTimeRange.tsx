import * as React from 'react';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import { connect, DispatchProp } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { compose } from 'recompose';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';
import { createValidDateTime, getToday0am, getToday2359 } from 'utils/dates';

type SelecteDateTimeRangeStateProps = {
};
type SelecteDateTimeRangeDispatchProps = DispatchProp;
type SelecteDateTimeRangeOwnProps = {
  registryKey: string;
};
type SelecteDateTimeRangeMergedProps = (
  SelecteDateTimeRangeStateProps
  & SelecteDateTimeRangeDispatchProps
  & SelecteDateTimeRangeOwnProps
);

type SelecteDateTimeRangeProps = (
  SelecteDateTimeRangeMergedProps
  & WithSearchProps
);

const ButtonWrap = styled(Button)``;

const ButtonContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;

  ${ButtonWrap} {
    border-radius: 0;

    &:first-child {
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
    }
    &:last-child {
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
    }
  }
`;

const SelecteDateTimeRange: React.FC<SelecteDateTimeRangeProps> = React.memo(
  (props) => {
    const date_from: string = props.searchState.date_from || createValidDateTime(getToday0am());
    const date_to: string = props.searchState.date_to || createValidDateTime(getToday2359());

    const handleChangeDate = React.useCallback(
      (key, value) => {
        props.setDataInSearch({
          date_from: props.searchState.date_from || createValidDateTime(getToday0am()),
          date_to: props.searchState.date_to || createValidDateTime(getToday2359()),
          [key]: createValidDateTime(value),
        });
      },
      [props.searchState, props.setDataInSearch],
    );

    return (
      <ButtonContainer>
        <DatePickerRange
          date_start_id="date_from"
          date_start_value={date_from}
          date_end_id="date_to"
          date_end_value={date_to}
          allWidth

          onChange={handleChangeDate}
        />
      </ButtonContainer>
    );
  },
);

export default compose<SelecteDateTimeRangeProps, SelecteDateTimeRangeOwnProps>(
  connect<SelecteDateTimeRangeStateProps, SelecteDateTimeRangeDispatchProps, SelecteDateTimeRangeOwnProps, ReduxState>(
    null,
  ),
  withSearch,
)(SelecteDateTimeRange);
