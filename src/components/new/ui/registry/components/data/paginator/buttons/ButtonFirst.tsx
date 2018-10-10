import * as React from 'react';
import { connect } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { Button } from 'react-bootstrap';

import {
  registryChangeDataPaginatorCurrentPage,
} from 'components/new/ui/registry/module/actions-registy';


type PropsButtonFirst = {
  registryKey: string;
  active: boolean;

  handleButtonClick: any;
};

type StatePaginator = {
};

class ButtonFirst extends React.Component<PropsButtonFirst, StatePaginator> {
  render() {
    return (
      <Button
        disabled={this.props.active}
        onClick={this.props.handleButtonClick}
      >
        Первая
      </Button>
    );
  }
}

const mapStateToProps = (state, { registryKey }) => ({
  active: getListData(state.registry, registryKey).paginator.currentPage === 0,
});

const mapDispatchToProps = (dispatch, { registryKey }) => ({
  handleButtonClick: () => (
    dispatch(
      registryChangeDataPaginatorCurrentPage(
        registryKey,
        0,
      ),
    )
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ButtonFirst);
