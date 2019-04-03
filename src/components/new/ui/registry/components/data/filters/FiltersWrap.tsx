import * as React from 'react';
import * as Panel from 'react-bootstrap/lib/Panel';

import { connect, DispatchProp } from 'react-redux';

import { getFilterData } from 'components/new/ui/registry/module/selectors-registry';

import Filters from 'components/new/ui/registry/components/data/filters/Filters';
import { PanelWrap, PanelBodyWrap } from 'components/new/ui/registry/components/data/filters/styled/styled';
import { ReduxState } from 'redux-main/@types/state';
import { compose } from 'recompose';
import { OneRegistryData } from '../../../module/registry';

type FiltersWrapStateProps = {
  isOpen: OneRegistryData['filter']['isOpen'];
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
      <PanelWrap expanded={this.props.isOpen} onToggle={this.handleToggle}>
        <Panel.Collapse>
          <PanelBodyWrap>
            <Filters registryKey={registryKey} wasFirstOpen={this.state.wasFirstOpen} />
          </PanelBodyWrap>
        </Panel.Collapse>
      </PanelWrap>
    );
  }
}

export default compose<FiltersWrapProps, FiltersWrapOwnProps>(
  connect<FiltersWrapStateProps, FiltersWrapDispatchProps, FiltersWrapOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      isOpen: getFilterData(state.registry, registryKey).isOpen,
    }),
  ),
)(FiltersWrap);
