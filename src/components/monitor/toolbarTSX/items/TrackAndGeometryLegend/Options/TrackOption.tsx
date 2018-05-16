import * as React from 'react';
import { connect } from 'react-redux';
import * as cx from 'classnames';

import { toggleShowTrack } from 'redux/modules/toolbar.js';
import { getIsShowTrack } from 'redux/selectors/toolbar';

@connect(
  state => ({
    isActive: getIsShowTrack(state),
  }),
  {
    toggleShowTrack,
  },
)
class ActiveOption extends React.Component<any, any> {
  render() {
    const { isActive } = this.props;
    const mainClassName = (cx('status-filter_options', { 'half-visible': !isActive }));

    return (
      <div className={mainClassName} onClick={this.props.toggleShowTrack}>
        <div className={'status-filter-icon track'} ></div>
        <span>Трек</span>
      </div>
    );
  }
}

export default ActiveOption;
