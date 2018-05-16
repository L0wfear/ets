import * as React from 'react';
import { connect } from 'react-redux';
import * as cx from 'classnames';

import { toggleShowInHalfSTop } from 'redux/modules/toolbar.js';
import { getIsShowHalfStopValue, getInHalfStopCarsCount } from '/home/uoiasfy/all/chch/ets-frontend/src/redux/selectors/toolbar';

@connect(
  state => ({
    isActive: getIsShowHalfStopValue(state),
    count: getInHalfStopCarsCount(state),
  }),
  {
    toggleShowInHalfSTop,
  },
)
class InMoveOption extends React.Component<any, any> {
  render() {
    const { isActive, count } = this.props;
    const mainClassName = (cx('status-filter_options', { 'half-visible': !isActive }));

    return (
      <div className={mainClassName} onClick={this.props.toggleShowInHalfSTop}>
        <div className={'status-filter-icon half-stop'} ></div>
        <span>{`Остановка(${isActive ? count : 0})`}</span>
      </div>
    );
  }
}

export default InMoveOption;
