import * as React from 'react';

import { connect } from 'react-redux';
import OutsideClickHandler from 'react-outside-click-handler';
import * as cx from 'classnames';
import CarFieldBytextInput from 'components/old/monitor/tool-bar/car-data/car-filters/car-filter-by-text/car-field-by-text-input/CarFieldBytextInput';
import {
  PropsCarFilterByText,
  StateCarFilterByText,
} from 'components/old/monitor/tool-bar/car-data/car-filters/car-filter-by-text/CarFilterByText.h';

import EtsBootstrap from 'components/new/ui/@bootstrap';

class CarFilterByText extends React.Component<PropsCarFilterByText, StateCarFilterByText> {
  state = {
    hidden: true,
  };

  toggleHidden: React.MouseEventHandler<HTMLDivElement> = () => {
    const hidden = !this.state.hidden;

    this.setState({ hidden });
  };

  handleClickOut: React.MouseEventHandler<HTMLDivElement> = () => {
    if (!this.state.hidden) {
      this.setState({ hidden: true });
    }
  };

  render() {
    return (
      <span>
        <div className={cx('tool_bar-block', { active: this.props.active })}>
          <OutsideClickHandler onOutsideClick={this.handleClickOut}>
            <div className="default_cube flex-row map-car-filter">
              <div className="button-toggle" onClick={this.toggleHidden}>
                <EtsBootstrap.Glyphicon glyph="search" />
              </div>
              {
                !this.state.hidden && (
                  <CarFieldBytextInput />
                )
              }
            </div>
          </OutsideClickHandler>
        </div>
      </span>
    );
  }
}
const mapStateToProps = (state) => ({
  active: state.monitorPage.filters.data.carFilterText.length > 0,
});

export default connect(
  mapStateToProps,
)(CarFilterByText);
