import * as React from 'react';
import { connect } from 'react-redux';
import * as cx from 'classnames';

import { toggleShowInMove } from 'redux/modules/toolbar.js';
import { getIsShowInMoveValue, getInMoveCarsCount } from 'redux/selectors/toolbar';

@connect(
  state => ({
    isActive: getIsShowInMoveValue(state),
    count: getInMoveCarsCount(state),
  }),
  {
    toggleShowInMove,
  },
)
class InMoveOption extends React.Component<any, any> {
  render() {
    const { isActive, count } = this.props;
    const mainClassName = (cx('status-filter_options', { 'half-visible': !isActive }));

    return (
      <div className={mainClassName} onClick={this.props.toggleShowInMove}>
        <div className={'status-filter-icon in-move'} ></div>
        <span>{`В движении(${isActive ? count : 0})`}</span>
      </div>
    );
  }
}

export default InMoveOption;
