import * as React from 'react';
import { connect } from 'react-redux';
import * as cx from 'classnames';

import { toggleShowGeometry } from 'redux/modules/toolbar.js';
import { getIsShowGeometry } from '/home/uoiasfy/all/chch/ets-frontend/src/redux/selectors/toolbar';

@connect(
  state => ({
    isActive: getIsShowGeometry(state),
  }),
  {
    toggleShowGeometry,
  },
)
class InMoveOption extends React.Component<any, any> {
  render() {
    const { isActive } = this.props;
    const mainClassName = (cx('status-filter_options', { 'half-visible': !isActive }));

    return (
      <div className={mainClassName} onClick={this.props.toggleShowGeometry}>
        <div className={'status-filter-icon geometry'} ></div>
        <span>Геообъекты</span>
      </div>
    );
  }
}

export default InMoveOption;
