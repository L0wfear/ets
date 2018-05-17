import * as React from 'react';
import { connect } from 'react-redux';
import * as cx from 'classnames';

import { toggleShowInNotConnected } from 'redux/modules/toolbar.js';
import { getIsShowNotActiveValue, getInNotConnectedCarsCount } from 'redux/selectors/toolbar';

@connect(
  state => ({
    isActive: getIsShowNotActiveValue(state),
    count: getInNotConnectedCarsCount(state),
  }),
  {
    toggleShowInNotConnected,
  },
)
class InNotConnectedOption extends React.Component<any, any> {
  render() {
    const { isActive, count } = this.props;
    const mainClassName = (cx('status-filter_options', { 'half-visible': !isActive }));

    return (
      <div className={mainClassName} onClick={this.props.toggleShowInNotConnected}>
        <div className={'status-filter-icon not-connected'} ></div>
        <span>{`Не на связи(${isActive ? count : 0})`}</span>
      </div>
    );
  }
}

export default InNotConnectedOption;
