import * as React from 'react';
import { connect } from 'react-redux';

import ButtonsLine from 'components/new/ui/registry/components/data/filters/buttons-line/ButtonsLine';
import FiltersLines from 'components/new/ui/registry/components/data/filters/filters-lines/FiltersLines';

import { EtsFilterCntainer } from 'components/new/ui/registry/components/data/filters/styled/styled';

type PropsFilters = {
  registryKey: string;
};

type StateFilters = {

};

class Filters extends React.Component<PropsFilters, StateFilters> {
  render() {
    const { registryKey } = this.props;

    return (
      <EtsFilterCntainer>
          <ButtonsLine registryKey={registryKey} />
          <FiltersLines registryKey={registryKey} />
      </EtsFilterCntainer>
    );
  }
}

const mapStateToProps = (state, { registryKey }) => ({
});

export default connect(
  mapStateToProps,
)(Filters);
