import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';

import {
  RouteDrawButtonsContaineWrapr,
  RouteDrawButtonsContainer,
} from 'components/new/pages/routes_list/form/inside_fields/creating-map/map/draw-buttons/styled/styled';

type PropsRouteDrawButtons = {
  disabledDraw: boolean;
  disabledRemove: boolean;
  hidden: boolean;
  handleClickOnStartDraw: () => any;
  handleClickOnRemove: () => any;
  activeButtons: {
    draw: boolean;
    remove: boolean;
  };
};

class RouteDrawButtons extends React.PureComponent<PropsRouteDrawButtons, {}> {
  handleClickOnStartDraw = () => {
    this.props.handleClickOnStartDraw();
  };
  handleClickOnRemove = () => {
    this.props.handleClickOnRemove();
  };

  render() {
    return (
      <RouteDrawButtonsContaineWrapr>
        <RouteDrawButtonsContainer>
          <EtsBootstrap.Button
            title="Cоздать на карте отрезки маршрута в ручном режиме"
            onClick={this.handleClickOnStartDraw}
            disabled={this.props.disabledDraw}
            active={this.props.activeButtons.draw}
          >
            <EtsBootstrap.Glyphicon glyph="pencil" />
          </EtsBootstrap.Button>
          <EtsBootstrap.Button
            title="Для удаления отрезка необходимо нажать на кнопку, после чего нажать на требуемый участок маршрута"
            onClick={this.handleClickOnRemove}
            disabled={this.props.disabledRemove}
            active={this.props.activeButtons.remove}
          >
            <EtsBootstrap.Glyphicon glyph="remove" />
          </EtsBootstrap.Button>
        </RouteDrawButtonsContainer>
      </RouteDrawButtonsContaineWrapr>
    );
  }
}

export default RouteDrawButtons;
