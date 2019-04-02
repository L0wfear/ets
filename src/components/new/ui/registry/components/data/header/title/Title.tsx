import * as React from 'react';
import { connect } from 'react-redux';
import { getHeaderData } from 'components/new/ui/registry/module/selectors-registry';
import { EtsHeaderTitle } from 'components/new/ui/registry/components/data/header/title/styled/styled';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';

type PropsHeader = {
  title: OneRegistryData['header']['title'];
  registryKey: string;
};

type StateHeader = {

};

class Header extends React.PureComponent<PropsHeader, StateHeader> {
  render() {
    return (
      <EtsHeaderTitle>
        {this.props.title}
      </EtsHeaderTitle>
    );
  }
}

const mapStateToProps = (state, { registryKey }) => ({
  title: getHeaderData(state.registry, registryKey).title,
});

export default connect(
  mapStateToProps,
)(Header);
