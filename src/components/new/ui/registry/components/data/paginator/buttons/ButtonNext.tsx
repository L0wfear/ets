import * as React from 'react';
import { connect } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';

import {
  registryChangeDataPaginatorCurrentPage,
} from 'components/new/ui/registry/module/actions-registy';
import { ButtonPaginatorWrap } from './styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type PropsButtonNext = {
  registryKey: string;
  show: boolean;
  currentPage: number;

  handleButtonClick: any;
};

type StatePaginator = {
};

class ButtonNext extends React.PureComponent<PropsButtonNext, StatePaginator> {
  handleButtonClick = () => {
    this.props.handleButtonClick(this.props.currentPage + 1);
  }
  render() {
    return (
      <ButtonPaginatorWrap themeName="paginator" disabled={!this.props.show} onClick={this.handleButtonClick} className="pagination-control">
        <EtsBootstrap.Glyphicon glyph="chevron-right" />
      </ButtonPaginatorWrap>
    );
  }
}

const mapStateToProps = (state, { registryKey }) => {
  const {
    data: { total_count },
    paginator,
  } = getListData(state.registry, registryKey);

  const { currentPage } = paginator;
  const maxIndex = (Math.ceil(total_count / paginator.perPage) - 1);

  return {
    show: maxIndex !== currentPage,
    currentPage,
  };
};

const mapDispatchToProps = (dispatch, { registryKey }) => ({
  handleButtonClick: (index) => (
    dispatch(
      registryChangeDataPaginatorCurrentPage(
        registryKey,
        Number(index),
      ),
    )
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ButtonNext);
