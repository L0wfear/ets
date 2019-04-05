import * as React from 'react';
import { connect } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';

import {
  registryChangeDataPaginatorCurrentPage,
} from 'components/new/ui/registry/module/actions-registy';
import { ButtonPaginatorWrap } from './styled';

type PropsButtonLast = {
  registryKey: string;
  active: boolean;
  index: number;

  handleButtonClick: any;
};

type StatePaginator = {
};

class ButtonLast extends React.PureComponent<PropsButtonLast, StatePaginator> {
  render() {
    const { index } = this.props;

    return (
      <ButtonPaginatorWrap
        disabled={this.props.active}
        data-index={index}
        onClick={this.props.handleButtonClick}
      >
        Последняя
      </ButtonPaginatorWrap>
    );
  }
}

const mapStateToProps = (state, { registryKey }) => {
  const {
    processed: { total_count },
    paginator,
  } = getListData(state.registry, registryKey);

  const index = Math.ceil(total_count / paginator.perPage) - 1;

  return {
    active: index === paginator.currentPage,
    index,
  };
};

const mapDispatchToProps = (dispatch, { registryKey }) => ({
  handleButtonClick: ({ currentTarget: { dataset: { index } } }) => (
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
)(ButtonLast);
