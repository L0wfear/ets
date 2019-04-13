import * as React from 'react';
import * as Panel from 'react-bootstrap/lib/Panel';

import { connect } from 'react-redux';

import { getFilterData } from 'components/new/ui/registry/module/selectors-registry';

import Filters from 'components/new/ui/registry/components/data/filters/Filters';
import { PanelWrap, PanelBodyWrap } from 'components/new/ui/registry/components/data/filters/styled/styled';
import { DivNone } from 'global-styled/global-styled';

type PropsFiltersWrap = {
  registryKey: string;
  isOpen: boolean;
  fields: any[];
  components?: any;
};

type StateFiltersWrap = {
  wasFirstOpen: boolean;
};

class FiltersWrap extends React.Component<PropsFiltersWrap, StateFiltersWrap> {
  state = {
    wasFirstOpen: this.props.isOpen,
  };

  static getDerivedStateFromProps(nextProps: PropsFiltersWrap, prevState: StateFiltersWrap) {
    if (!prevState.wasFirstOpen && nextProps.isOpen) {
      return {
        wasFirstOpen: true,
      };
    }

    return null;
  }

  handleToggle = () => {
    // toggle
  }

  render() {
    const { registryKey } = this.props;

    return (
      this.props.fields.length
       ? (
          <PanelWrap expanded={this.props.isOpen} onToggle={this.handleToggle}>
            <Panel.Collapse>
              <PanelBodyWrap>
                <Filters registryKey={registryKey} wasFirstOpen={this.state.wasFirstOpen} />
              </PanelBodyWrap>
            </Panel.Collapse>
          </PanelWrap>
        )
        : (
          <DivNone />
        )
    );
  }
}

const mapStateToProps = (state, { registryKey }) => ({
  isOpen: getFilterData(state.registry, registryKey).isOpen,
  fields: getFilterData(state.registry, registryKey).fields,
});

export default connect(
  mapStateToProps,
)(FiltersWrap);
