import * as React from 'react';
import { connect } from 'react-redux';
import * as cx from 'classnames';

import { toggleShowGovNumber } from 'redux/modules/toolbar.js';
import { getIsShowGovNumber } from 'redux/selectors/toolbar';

@connect(
  state => ({
    isActive: getIsShowGovNumber(state),
  }),
  {
    toggleShowGovNumber,
  },
)
class CarsGosNumber extends React.Component<any, any> {
  render() {
    const { isActive } = this.props;
    const mainClassName = (cx('status-filter_options', 'option-with-checkbox'));

    return (
      <div className="legend-wrapper app-toolbar-fill">
        <div className={mainClassName} onClick={this.props.toggleShowGovNumber}>
          <input type="checkbox" checked={isActive} />
          <span className="toolbar-with-checkbox">Рег. номер ТС</span>
        </div>
      </div>
    );
  }
}

export default CarsGosNumber;
