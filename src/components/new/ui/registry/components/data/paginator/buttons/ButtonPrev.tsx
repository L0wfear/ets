import * as React from 'react';
import { connect } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { Button, Glyphicon } from 'react-bootstrap';

import {
  registryChangeDataPaginatorCurrentPage,
} from 'components/new/ui/registry/module/actions-registy';

type PropsButtonPrev = {
  registryKey: string;
  show: boolean;
  currentPage: number;

  handleButtonClick: any;
};

type StatePaginator = {
};

class ButtonPrev extends React.Component<PropsButtonPrev, StatePaginator> {
  handleButtonClick = () => {
    if (this.props.currentPage > 0) {
      this.props.handleButtonClick(this.props.currentPage - 1);
    }
  }
  render() {
    return (
      <Button disabled={!this.props.show} onClick={this.handleButtonClick}>
        <Glyphicon glyph="chevron-left" />
      </Button>
    );
  }
}

const mapStateToProps = (state, { registryKey }) => ({
  currentPage: getListData(state.registry, registryKey).paginator.currentPage,
  show: getListData(state.registry, registryKey).paginator.currentPage !== 0,
});

const mapDispatchToProps = (dispatch, { registryKey }) => ({
  handleButtonClick: index => (
    dispatch(
      registryChangeDataPaginatorCurrentPage(
        registryKey,
        index,
      ),
    )
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ButtonPrev);
