import * as React from 'react';
import { connect } from 'react-redux';
import * as ClickOutHandler from 'react-onclickout';
import * as cx from 'classnames';

import {
  PropsCarFilterByText,
  StateCarFilterByText,
} from 'components/old/monitor/tool-bar/car-data/car-filters/car-filter-by-geoobject/CarFilterBySelect.h';
import DefaultInput from 'components/old/monitor/tool-bar/car-data/car-filters/car-filter-by-geoobject/default-input/DefaultInput';

import {
  DivNone,
} from 'global-styled/global-styled';
import { ReduxState } from 'redux-main/@types/state';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { GEOOBJECTS_LIST_WITH_CARS } from 'constants/geoobjects-new';

class CarFilterByText extends React.Component<PropsCarFilterByText, StateCarFilterByText> {
  constructor(props: PropsCarFilterByText) {
    super(props);

    this.state = {
      hidden: true,
    };
  }

  toggleHidden: any = () => {
    const hidden = !this.state.hidden;

    this.setState({ hidden });
  };
  handleClickOut: any = () => {
    if (!this.state.hidden) {
      this.setState({ hidden: true });
    }
  };

  render() {
    const options = Object.values(GEOOBJECTS_LIST_WITH_CARS).map((el) => {
      return {value: el.serverName, label: el.label};
    });
    return (
      <span>
        <ClickOutHandler onClickOut={this.handleClickOut}>
          <div className={cx('tool_bar-block', { active: this.props.active })}>
            <div className="default_cube flex-row map-car-filter multi">
              <div className="button-toggle" onClick={this.toggleHidden} >
                <EtsBootstrap.Glyphicon glyph="menu-hamburger" />
              </div>
              {
                this.state.hidden
                  ? (
                    <DivNone />
                  )
                  :                  (
                    <div className="car_text_filter-container multi">
                      <div>
                        {
                          <DefaultInput
                            key={'geoobjects'}
                            OPTIONS={options}
                            placeholder={'Тип геообъекта'}
                          />
                        }
                      </div>
                    </div>
                  )
              }
            </div>
          </div>
        </ClickOutHandler>
      </span>
    );
  }
}

export default connect<any, any, any, ReduxState>(
  (state) => ({
    active: Boolean(state.monitorPage.geoobjectsFilter),
  }),
)(CarFilterByText);
