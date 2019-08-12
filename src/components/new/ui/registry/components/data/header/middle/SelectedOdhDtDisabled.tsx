import * as React from 'react';

import styled from 'styled-components';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { actionChangeGlobalPaylaodInServiceData } from 'components/new/ui/registry/module/actions-registy';
import { ReduxState } from 'redux-main/@types/state';
import { getServiceData } from 'components/new/ui/registry/module/selectors-registry';
import { getRegistryState } from 'redux-main/reducers/selectors';
import { get } from 'lodash';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { EtsButtonsContainer } from 'components/new/ui/registry/components/data/header/buttons/styled/styled';

type SelectedOdhDtDisabledStateProps = {
  Service: OneRegistryData['Service'];
};
type SelectedOdhDtDisabledDispatchProps = {
  actionChangeGlobalPaylaodInServiceData: HandleThunkActionCreator<typeof actionChangeGlobalPaylaodInServiceData>;
};
type SelectedOdhDtDisabledOwnProps = {
  registryKey: string;
};
type SelectedOdhDtDisabledMergedProps = (
  SelectedOdhDtDisabledStateProps
  & SelectedOdhDtDisabledDispatchProps
  & SelectedOdhDtDisabledOwnProps
);

type SelectedOdhDtDisabledProps = SelectedOdhDtDisabledMergedProps;

const ButtonWrap = styled(EtsBootstrap.Button)``;

const SelectedOdhDtDisabled: React.FC<SelectedOdhDtDisabledProps> = React.memo(
  (props) => {
    const selectedType = get(props.Service, 'getRegistryData.payload.type', null);

    const handleSelectOdh = React.useCallback(
      () => {
        const payload = {
          getRegistryData: {
            type: 'odh',
          },
          getBlobData: {
            format: 'xls',
            type: 'odh',
          },
        };

        props.actionChangeGlobalPaylaodInServiceData(props.registryKey, payload);
      },
      [props.Service, props.actionChangeGlobalPaylaodInServiceData],
    );

    const handleSelectDt = React.useCallback(
      () => {
        const payload = {
          getRegistryData: {
            type: 'dt',
          },
          getBlobData: {
            type: 'dt',
          },
        };

        props.actionChangeGlobalPaylaodInServiceData(props.registryKey, payload);
      },
      [props.Service, props.actionChangeGlobalPaylaodInServiceData],
    );

    return (
      <EtsButtonsContainer>
        <ButtonWrap active={selectedType === 'odh'} onClick={handleSelectOdh}>ОДХ</ButtonWrap>
        <ButtonWrap disabled active={selectedType === 'dt'} onClick={handleSelectDt}>ДТ</ButtonWrap>
      </EtsButtonsContainer>
    );
  },
);

export default connect<SelectedOdhDtDisabledStateProps, SelectedOdhDtDisabledDispatchProps, SelectedOdhDtDisabledOwnProps, ReduxState>(
  (state, { registryKey }) => ({
    Service: getServiceData(getRegistryState(state), registryKey),
  }),
  (dispatch: any) => ({
    actionChangeGlobalPaylaodInServiceData: (...arg) => (
      dispatch(
        actionChangeGlobalPaylaodInServiceData(...arg),
      )
    ),
  }),
)(SelectedOdhDtDisabled);
