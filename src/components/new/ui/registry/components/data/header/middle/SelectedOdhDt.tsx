import * as React from 'react';

import styled from 'styled-components';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { compose } from 'recompose';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { actionChangeGlobalPaylaodInServiceData } from 'components/new/ui/registry/module/actions-registy';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type SelectedOdhDtStateProps = {
};
type SelectedOdhDtDispatchProps = {
  actionChangeGlobalPaylaodInServiceData: HandleThunkActionCreator<typeof actionChangeGlobalPaylaodInServiceData>;
};
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

const ButtonWrap = styled(EtsBootstrap.Button)``;

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

    React.useEffect(
      () => {
        if (selected_odh_dt_value && (selected_odh_dt_value === 'odh' || selected_odh_dt_value === 'dt')) {
          const typeName = props.registryKey === 'cleaningRateRegistry' ? 'type' : 'object_type';
          const payload = {
            getRegistryData: {
              [typeName]: selected_odh_dt_value,
            },
            getBlobData: {
              [typeName]: selected_odh_dt_value,
            },
          };

          props.actionChangeGlobalPaylaodInServiceData(props.registryKey, payload);
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
    (dispatch: any) => ({
      actionChangeGlobalPaylaodInServiceData: (...arg) => (
        dispatch(
          actionChangeGlobalPaylaodInServiceData(...arg),
        )
      ),
    }),
  ),
  withSearch,
)(SelectedOdhDt);
