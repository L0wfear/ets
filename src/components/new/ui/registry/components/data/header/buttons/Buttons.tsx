import * as React from 'react';
import ComponentButton from 'components/new/ui/registry/components/data/header/buttons/component-button/ComponentButton';

import { connect } from 'react-redux';
import { getHeaderData } from 'components/new/ui/registry/module/selectors-registry';
import { EtsButtonsContainer } from 'components/new/ui/registry/components/data/header/buttons/styled/styled';

type PropsButtons = {
  buttons: any;
  registryKey: string;
};

type StateButtons = {
};

class Buttons extends React.Component<PropsButtons, StateButtons> {
  renderButton = (type) => (
    <ComponentButton key={type} type={type} registryKey={this.props.registryKey} />
  )

  render() {
    return (
      <EtsButtonsContainer>
        { this.props.buttons.map(this.renderButton) }
      </EtsButtonsContainer>
    );
  }
}

const mapStateToProps = (state, { registryKey }) => ({
  buttons: getHeaderData(state.registry, registryKey).buttons,
});

export default connect(
  mapStateToProps,
)(Buttons);
