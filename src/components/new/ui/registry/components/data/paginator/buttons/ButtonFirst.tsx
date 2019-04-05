import * as React from 'react';
import { connect } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';

import {
  registryChangeDataPaginatorCurrentPage,
} from 'components/new/ui/registry/module/actions-registy';
import { ButtonPaginatorWrap } from './styled';

type PropsButtonFirst = {
  registryKey: string;
  active: boolean;

  handleButtonClick: any;
};

type StatePaginator = {
};

class ButtonFirst extends React.PureComponent<PropsButtonFirst, StatePaginator> {
  render() {
    return (
      <ButtonPaginatorWrap
        disabled={this.props.active}
        onClick={this.props.handleButtonClick}
      >
        Первая
      </ButtonPaginatorWrap>
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
