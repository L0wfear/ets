import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';

import {
  RouteDrawButtonsContaineWrapr,
  RouteDrawButtonsContainer,
} from 'components/new/pages/routes_list/form/inside_fields/creating-map/map/draw-buttons/styled/styled';

type PropsRouteDrawButtons = {
  [key: string]: any;
};

class RouteDrawButtons extends React.PureComponent<PropsRouteDrawButtons, {}> {
  handleClickOnStartDraw = () => {
    this.props.handleClickOnStartDraw();
  }
  handleClickOnRemove = () => {
    this.props.handleClickOnRemove();
  }

  render() {
    return (
      <RouteDrawButtonsContaineWrapr>
        <RouteDrawButtonsContainer>
          <EtsBootstrap.Button onClick={this.handleClickOnStartDraw} disabled={this.props.disabledDraw}><EtsBootstrap.Glyphicon glyph="pencil" /></EtsBootstrap.Button>
          <EtsBootstrap.Button onClick={this.handleClickOnRemove} disabled={this.props.disabledRemove}><EtsBootstrap.Glyphicon glyph="remove" /></EtsBootstrap.Button>
        </RouteDrawButtonsContainer>
      </RouteDrawButtonsContaineWrapr>
    );
  }
}

export default RouteDrawButtons;
