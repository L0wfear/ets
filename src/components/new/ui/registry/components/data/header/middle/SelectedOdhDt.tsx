import * as React from 'react';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import { connect, DispatchProp } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { compose } from 'recompose';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

type SelectedOdhDtStateProps = {
};
type SelectedOdhDtDispatchProps = DispatchProp;
type SelectedOdhDtOwnProps = {
  registryKey: string;
};
type SelectedOdhDtMergedProps = (
  SelectedOdhDtStateProps
  & SelectedOdhDtDispatchProps
  & SelectedOdhDtOwnProps
);

type SelectedOdhDtProps = (
  SelectedOdhDtMergedProps
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

const SelectedOdhDt: React.FC<SelectedOdhDtProps> = React.memo(
  (props) => {
    const selected_odh_dt_value = props.match.params.selected_odh_dt_value;

    React.useEffect(
      () => {
        if (selected_odh_dt_value !== 'odh' && selected_odh_dt_value !== 'dt') {
          handleSelectOdh();
        }
      },
      [selected_odh_dt_value],
    );

    const handleSelectOdh = React.useCallback(
      () => {
        props.setParams({
          selected_odh_dt_value: 'odh',
        });
      },
      [props.setParams, props.match.params],
    );

    const handleSelectDt = React.useCallback(
      () => {
        props.setParams({
          selected_odh_dt_value: 'dt',
        });
      },
      [props.setParams, props.match.params],
    );

    return (
      <ButtonContainer>
        <ButtonWrap active={selected_odh_dt_value === 'odh'} onClick={handleSelectOdh}>ОДХ</ButtonWrap>
        <ButtonWrap active={selected_odh_dt_value === 'dt'} onClick={handleSelectDt}>ДТ</ButtonWrap>
      </ButtonContainer>
    );
  },
);

export default compose<SelectedOdhDtProps, SelectedOdhDtOwnProps>(
  connect<SelectedOdhDtStateProps, SelectedOdhDtDispatchProps, SelectedOdhDtOwnProps, ReduxState>(
    null,
  ),
  withSearch,
)(SelectedOdhDt);
