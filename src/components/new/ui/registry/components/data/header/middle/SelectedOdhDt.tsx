import * as React from 'react';

import styled from 'styled-components';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { compose } from 'recompose';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { actionChangeGlobalPaylaodInServiceData } from 'components/new/ui/registry/module/actions-registy';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { EtsButtonsContainer } from 'components/new/ui/registry/components/data/header/buttons/styled/styled';

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
      <EtsButtonsContainer>
        <ButtonWrap active={selected_odh_dt_value === 'odh'} onClick={handleSelectOdh}>ОДХ</ButtonWrap>
        <ButtonWrap active={selected_odh_dt_value === 'dt'} onClick={handleSelectDt}>ДТ</ButtonWrap>
      </EtsButtonsContainer>
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
