import * as React from 'react';
import ComponentButton from 'components/new/ui/registry/components/data/header/buttons/component-button/ComponentButton';

import { connect, DispatchProp } from 'react-redux';
import { getHeaderData } from 'components/new/ui/registry/module/selectors-registry';
import { EtsButtonsContainer } from 'components/new/ui/registry/components/data/header/buttons/styled/styled';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { ReduxState } from 'redux-main/@types/state';

type ButtonsStateProps = {
  buttons: OneRegistryData['header']['buttons'];
};
type ButtonsDispatchProps = DispatchProp;
type ButtonsOwnProps = {
  registryKey: string;
};
type ButtonsMergedProps = (
  ButtonsStateProps
  & ButtonsDispatchProps
  & ButtonsOwnProps
);
type ButtonsProps = ButtonsMergedProps;

const Buttons: React.FC<ButtonsProps> = (props) => {
  return (
    <EtsButtonsContainer>
      {
        props.buttons.map(
          (type) => (
            <ComponentButton key={type} type={type} registryKey={props.registryKey} />
          ),
        )
      }
    </EtsButtonsContainer>
  );
};

export default connect<ButtonsStateProps, ButtonsDispatchProps, ButtonsOwnProps, ReduxState>(
  (state, { registryKey }) => ({
    buttons: getHeaderData(state.registry, registryKey).buttons,
  }),
)(Buttons);
