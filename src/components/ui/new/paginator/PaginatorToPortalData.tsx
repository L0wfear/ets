import * as React from 'react';
import { connect } from 'react-redux';

import { paginatorUpdateData, paginatorResetData } from 'components/ui/new/paginator/redux/actions-paginator';

import {
  DivNone,
} from 'global-styled/global-styled';

class Paginator extends React.Component<any, any> {
  componentDidMount() {
    const { uniqKey, ...props } = this.props;

    this.props.paginatorUpdateData(uniqKey, props);
  }
  componentWillReceiveProps({ uniqKey, currentPage, maxPage, ...props }) {
    const currentPageCheck = currentPage >= maxPage ? Math.max(maxPage - 1, 0) : currentPage;

    this.props.paginatorUpdateData(uniqKey, {
      ...props,
      currentPage: currentPageCheck,
      maxPage,
    });
  }

  componentWillUnmount() {
    this.props.paginatorResetData(this.props.uniqKey);
  }

  render() {
    return (
      <DivNone />
    );
  }
}

const mapDispatchToProps = dispatch => ({
  paginatorUpdateData: (uniqKey, changedPaginatorData) => (
    dispatch(
      paginatorUpdateData(
        uniqKey,
        changedPaginatorData,
      )
    )
  ),
  paginatorResetData: (uniqKey) => (
    dispatch(
      paginatorResetData(
        uniqKey,
      )
    )
  )
})

export default connect(
  null,
  mapDispatchToProps,
)(Paginator);
