import * as React from 'react';
import {
  Glyphicon,
  Button,
} from 'react-bootstrap';

import {
  RouteDrawButtonsContaineWrapr,
  RouteDrawButtonsContainer,
} from 'components/route/form/map/draw-buttons/styled/styled';

type PropsRouteDrawButtons = {
  [key: string]: any;
};

class RouteDrawButtons extends React.PureComponent<PropsRouteDrawButtons, {}> {
  handleClickOnStartDraw: React.MouseEventHandler<Button> = () => {
    console.log('handleClickOnStartDraw', this.props.handleClickOnStartDraw)
    this.props.handleClickOnStartDraw();
  }
  handleClickOnRemove: React.MouseEventHandler<Button> = () => {
    console.log('handleClickOnRemove', this.props.handleClickOnRemove())
  }

  render() {
    return (
      <RouteDrawButtonsContaineWrapr>
        <RouteDrawButtonsContainer>
          <Button onClick={this.handleClickOnStartDraw} disabled={this.props.disabledDraw}><Glyphicon glyph="pencil" /></Button>
          <Button onClick={this.handleClickOnRemove} disabled={this.props.disabledRemove}><Glyphicon glyph="remove" /></Button>
        </RouteDrawButtonsContainer>
      </RouteDrawButtonsContaineWrapr>
    )
  }
}

export default RouteDrawButtons;
