import * as React from 'react';
import { connect } from 'react-redux';

import ButtonsLine from 'components/new/ui/registry/components/data/filters/buttons-line/ButtonsLine';
import FiltersLines from 'components/new/ui/registry/components/data/filters/filters-lines/FiltersLines';

import { EtsFilterCntainer } from 'components/new/ui/registry/components/data/filters/styled/styled';
import { registryApplyRawFilters } from 'components/new/ui/registry/module/actions-registy';
import { ReduxState } from 'redux-main/@types/state';
import { compose } from 'recompose';

type PropsFilters = {
  wasFirstOpen: boolean;
  registryKey: string;
  hanleClickApplyRawFilters: any;
};

type StateFilters = {};

class Filters extends React.PureComponent<PropsFilters, StateFilters> {
  render() {
    const { registryKey } = this.props;

    return (
      <EtsFilterCntainer onSubmit={this.props.hanleClickApplyRawFilters}>
        <ButtonsLine registryKey={registryKey} />
        <FiltersLines registryKey={registryKey} wasFirstOpen={this.props.wasFirstOpen} />
      </EtsFilterCntainer>
    );
  }
}

const mapDispatchToProps = (dispatch, { registryKey }) => ({
  hanleClickApplyRawFilters: (event) => {
    event.preventDefault();
    dispatch(registryApplyRawFilters(registryKey));
  },
});

export default compose<any, any>(
  connect<any, any, any, ReduxState>(
    null,
    mapDispatchToProps,
  ),
)(Filters);
