import * as React from 'react';

import { connect, DispatchProp } from 'react-redux';

import { getFilterData } from 'components/new/ui/registry/module/selectors-registry';

import Filters from 'components/new/ui/registry/components/data/filters/Filters';
import { PanelWrap, PanelBodyWrap } from 'components/new/ui/registry/components/data/filters/styled/styled';
import { ReduxState } from 'redux-main/@types/state';
import { compose } from 'recompose';
import { OneRegistryData } from '../../../module/registry';
import { DivNone } from 'global-styled/global-styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type FiltersWrapStateProps = {
  isOpen: OneRegistryData['filter']['isOpen'];
  fields: OneRegistryData['filter']['fields'];
};
type FiltersWrapDispatchProps = DispatchProp;
type FiltersWrapOwnProps = {
  registryKey: string;
};
type FiltersWrapMergedProps = (
  FiltersWrapStateProps
  & FiltersWrapDispatchProps
  & FiltersWrapOwnProps
);
type FiltersWrapProps = FiltersWrapMergedProps;

type StateFiltersWrap = {
  wasFirstOpen: boolean;
};

class FiltersWrap extends React.PureComponent<FiltersWrapProps, StateFiltersWrap> {
  state = {
    wasFirstOpen: this.props.isOpen,
  };

  static getDerivedStateFromProps(nextProps: FiltersWrapProps, prevState: StateFiltersWrap) {
    if (!prevState.wasFirstOpen && nextProps.isOpen) {
      return {
        wasFirstOpen: true,
      };
    }

    return null;
  }

  handleToggle = () => {
    //
  };

  render() {
    const { registryKey } = this.props;

    return (
      this.props.fields.length
       ? (
          <PanelWrap expanded={this.props.isOpen} onToggle={this.handleToggle}>
            <EtsBootstrap.PanelCollapse>
              <PanelBodyWrap>
                <Filters registryKey={registryKey} wasFirstOpen={this.state.wasFirstOpen} />
              </PanelBodyWrap>
            </EtsBootstrap.PanelCollapse>
          </PanelWrap>
        )
        : (
          <DivNone />
        )
    );
  }
}

export default compose<FiltersWrapProps, FiltersWrapOwnProps>(
  connect<FiltersWrapStateProps, FiltersWrapDispatchProps, FiltersWrapOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      isOpen: getFilterData(state.registry, registryKey).isOpen,
      fields: getFilterData(state.registry, registryKey).fields,
    }),
  ),
)(FiltersWrap);
