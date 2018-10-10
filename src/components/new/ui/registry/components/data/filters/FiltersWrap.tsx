import * as React from 'react';
import { Panel } from 'react-bootstrap';

import { connect } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';

import { getFilterData } from 'components/new/ui/registry/module/selectors-registry';

import Filters from 'components/new/ui/registry/components/data/filters/Filters';
import { PanelWrap, PanelBodyWrap } from 'components/new/ui/registry/components/data/filters/styled/styled';

type PropsFiltersWrap = {
  registryKey: string;
  isOpen: boolean;
  rowFields: any[];
};

type StateFiltersWrap = {

};

class FiltersWrap extends React.Component<PropsFiltersWrap, StateFiltersWrap> {
  handleToggle = () => {
    console.log('handleToggle')
  }

  render() {
    const { registryKey } = this.props;

    return (
      <PanelWrap expanded={this.props.isOpen} onToggle={this.handleToggle}>
        <Panel.Collapse>
          <PanelBodyWrap>
            <Filters registryKey={registryKey} />
          </PanelBodyWrap>
        </Panel.Collapse>
      </PanelWrap>
    );
  }
}

const mapStateToProps = (state, { registryKey }) => ({
  isOpen: getFilterData(state.registry, registryKey).isOpen,
  rowFields: getListData(state.registry, registryKey).meta.rowFields,
});

export default connect(
  mapStateToProps,
)(FiltersWrap);
