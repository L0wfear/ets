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
      FILTRED_GEOOBJECTS_LIST: Object.keys(GEOOBJECTS_LIST_WITH_CARS).filter((key) => (
        this.props.permissions.includes(`${key}.list`)) || key === 'cars',
      ),
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
    const options = this.state.FILTRED_GEOOBJECTS_LIST.map((key) => {
      return {value: GEOOBJECTS_LIST_WITH_CARS[key].serverName, label: GEOOBJECTS_LIST_WITH_CARS[key].label};
    });
    const message = 'Выберите геообъект для фильтрации/поиска на карте';
    const popoverHoverFocus = (
      <EtsBootstrap.Popover id="popover-trigger-hover-focus">
        {message}
      </EtsBootstrap.Popover>
    );
    return (
      <span>
        <ClickOutHandler onClickOut={this.handleClickOut}>
          <div className={cx('tool_bar-block', { active: this.props.active })}>
            <div className="default_cube flex-row map-car-filter multi">
              <div className="button-toggle" onClick={this.toggleHidden}>
                <EtsBootstrap.Glyphicon glyph="menu-hamburger" />
              </div>
              {this.state.hidden ? (
                <DivNone />
              ) : (
                <EtsBootstrap.OverlayTrigger
                  trigger={['hover', 'focus']}
                  placement="right"
                  overlay={popoverHoverFocus}
                  rootClose={true}
                >
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
                </EtsBootstrap.OverlayTrigger>
              )}
            </div>
          </div>
        </ClickOutHandler>
      </span>
    );
  }
}

export default connect<any, any, any, ReduxState>(
  (state) => ({
    active: Boolean(state.monitorPage.geoobjectsFilter) && state.monitorPage.geoobjectsFilter !== 'cars',
    permissions: state.session.userData.permissions,
  }),
)(CarFilterByText);
