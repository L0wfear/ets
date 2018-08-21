import * as React from 'react';
import { connect } from 'react-redux';

import { paginatorUpdateData } from 'components/ui/new/paginator/redux/actions-paginator';

class Paginator extends React.Component<any, any> {
  componentDidMount() {
    const { uniqKey, ...props } = this.props;

    this.props.paginatorUpdateData(uniqKey, props);
  }
  componentWillReceiveProps({ uniqKey, ...props }) {
    this.props.paginatorUpdateData(uniqKey, props);
  }

  componentWillUnmount() {
    this.props.paginatorUpdateData(this.props.uniqKey, {});
  }

  render() {
    return (
      <div className="none"></div>
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
})

export default connect(
  null,
  mapDispatchToProps,
)(Paginator);
