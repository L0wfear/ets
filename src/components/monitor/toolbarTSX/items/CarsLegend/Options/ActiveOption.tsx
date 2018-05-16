import * as React from 'react';
import { connect } from 'react-redux';
import * as cx from 'classnames';

import { toggleShowActive } from 'redux/modules/toolbar.js';
import { getIsShowActiveValue, getActiveCarsCount } from '/home/uoiasfy/all/chch/ets-frontend/src/redux/selectors/toolbar';

@connect(
  state => ({
    isActive: getIsShowActiveValue(state),
    count: getActiveCarsCount(state),
  }),
  {
    toggleShowActive,
  },
)
class ActiveOption extends React.Component<any, any> {
  render() {
    const { isActive, count } = this.props;
    const mainClassName = (cx('status-filter_options', 'main', { 'half-visible': !isActive }));

    return (
      <div className={mainClassName} onClick={this.props.toggleShowActive}>
        <div className={'status-filter-icon active'} ></div>
        <span>{`Активно: ${count}`}</span>
      </div>
    );
  }
}

export default ActiveOption;
