import * as React from 'react';
import { connect } from 'react-redux';

import {
  getListData,
  getFilterData,
} from 'components/new/ui/registry/module/selectors-registry';
import * as Button from 'react-bootstrap/lib/Button';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';

import { registryToggleIsOpenFilter } from 'components/new/ui/registry/module/actions-registy';

type PropsButtonToggleFilter = {
  registryKey: string;
  handleClick: React.MouseEventHandler<React.ClassicComponent<any, {}>>;
  hasFilters: boolean;
};

class ButtonToggleFilter extends React.Component<PropsButtonToggleFilter, {}> {
  render() {
    return (
      <Button
        id="show-options-filter"
        bsSize="small"
        active={this.props.hasFilters}
        onClick={this.props.handleClick}
      >
        <Glyphicon glyph="filter" />
      </Button>
    );
  }
}

const mapStateToProps = (state, { registryKey }) => ({
  isOpen: getFilterData(state.registry, registryKey).isOpen,
  hasFilters: (
    Boolean(
      Object.values(
        getListData(state.registry, registryKey).processed.filterValues,
      ).length,
    )
  ),
});

const mapDispatchToProps = (dispatch, { registryKey }) => ({
  handleClick: () => (
    dispatch(
      registryToggleIsOpenFilter(registryKey),
    )
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)
(ButtonToggleFilter);
