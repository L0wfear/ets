import * as React from 'react';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import * as Button from 'react-bootstrap/lib/Button';

import {
  RouteDrawButtonsContaineWrapr,
  RouteDrawButtonsContainer,
} from 'components/new/pages/routes_list/form/inside_fields/creating-map/map/draw-buttons/styled/styled';

type PropsRouteDrawButtons = {
  [key: string]: any;
};

class RouteDrawButtons extends React.PureComponent<PropsRouteDrawButtons, {}> {
  handleClickOnStartDraw: React.MouseEventHandler<Button> = () => {
    this.props.handleClickOnStartDraw();
  }
  handleClickOnRemove: React.MouseEventHandler<Button> = () => {
    this.props.handleClickOnRemove();
  }

  render() {
    return (
      <RouteDrawButtonsContaineWrapr>
        <RouteDrawButtonsContainer>
          <Button onClick={this.handleClickOnStartDraw} disabled={this.props.disabledDraw}><Glyphicon glyph="pencil" /></Button>
          <Button onClick={this.handleClickOnRemove} disabled={this.props.disabledRemove}><Glyphicon glyph="remove" /></Button>
        </RouteDrawButtonsContainer>
      </RouteDrawButtonsContaineWrapr>
    );
  }
}

export default RouteDrawButtons;
