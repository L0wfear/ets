import * as React from 'react';

import { connect } from 'react-redux';
import { Glyphicon } from 'react-bootstrap';
import * as ClickOutHandler from 'react-onclickout';
import * as cx from 'classnames';
import CarFieldBytextInput from 'components/monitor/new/tool-bar/car-data/car-filters/car-filter-by-text/car-field-by-text-input/CarFieldBytextInput';
import {
  PropsCarFilterByText,
  StateCarFilterByText,
} from 'components/monitor/new/tool-bar/car-data/car-filters/car-filter-by-text/CarFilterByText.h';

class CarFilterByText extends React.Component<PropsCarFilterByText, StateCarFilterByText> {
  state = {
    hidden: true,
  }
  toggleHidden: React.MouseEventHandler<HTMLDivElement> = () => {
    const hidden = !this.state.hidden;

    this.setState({ hidden });
  }

  handleClickOut: React.MouseEventHandler<HTMLDivElement> = () => {
    if (!this.state.hidden) {
      this.setState({ hidden: true });
    }
  }

  render() {
    return (
      <span>
        <ClickOutHandler onClickOut={this.handleClickOut}>
          <div className={cx('tool_bar-block', { active: this.props.active })}>
            <div className="default_cube flex-row map-car-filter">
              <div className="button-toggle" onClick={this.toggleHidden} >
                <Glyphicon glyph="search" />
              </div>
                {
                  this.state.hidden ?
                  (
                    <div className="none"></div>
                  )
                  :
                  (
                    <CarFieldBytextInput />
                  )
                }
            </div>
          </div>
        </ClickOutHandler>
      </span>
    )
  }
}
const mapStateToProps = state => ({
  active: state.monitorPage.filters.data.carFilterText.length > 0,
});

 export default connect(
  mapStateToProps,
 )(CarFilterByText);
