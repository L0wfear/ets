import * as React from 'react';
import { connect } from 'react-redux';
import * as cx from 'classnames';

import { toggleShowInStop } from 'redux/modules/toolbar.js';
import { getIsShowStopValue, getInStopCarsCount } from 'redux/selectors/toolbar';

@connect(
  state => ({
    isActive: getIsShowStopValue(state),
    count: getInStopCarsCount(state),
  }),
  {
    toggleShowInStop,
  },
)
class InMoveOption extends React.Component<any, any> {
  render() {
    const { isActive, count } = this.props;
    const mainClassName = (cx('status-filter_options', { 'half-visible': !isActive }));

    return (
      <div className={mainClassName} onClick={this.props.toggleShowInStop}>
        <div className={'status-filter-icon stop'} ></div>
        <span>{`Остановка(${isActive ? count : 0})`}</span>
      </div>
    );
  }
}

export default InMoveOption;
