import styled from 'styled-components';

import {
  PropsOverlay,
} from 'components/new/ui/map/overlay/Overlay.h';

import {
  OverlayInsideContainer,
  EtsOverlayContainer,
  EtsOverlayTitleContainer,
  EtsTriangleContainer,
} from 'components/new/ui/map/overlay/styled/styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';

const ruler = require('components/monitor/layers/measure/styled/image/ruler.png');

export const OverlayInsideMeasureContainer = styled(OverlayInsideContainer)`
  font-size: 12px;
  font-weight: 400;
`;

export const EtsOverlayMeasureContainer = styled(EtsOverlayContainer)`
  width: auto;
  background: ${({ active }: PropsOverlay) => !active ? 'rgba(255, 204, 51, 0.8)' : 'rgba(0, 0, 0, 0.8)'};
  color: ${({ active }: PropsOverlay) => !active ? 'black' : 'white'};
`;

export const EtsOverlayMeasureTitleContainer = styled(EtsOverlayTitleContainer)`
  border-bottom-color: ${({ active }: PropsOverlay) => active ? 'black' : 'initial'};
`;

export const EtsTriangleMeasure = styled(EtsTriangleContainer)`
  border-top-color: ${({ active }: PropsOverlay) => !active ? 'rgba(255, 204, 51, 0.5)' : 'rgba(0, 0, 0, 0.55)'};
`;

export const ButtonContainer = styled.div`
  pointer-events: all;
  background-color: rgba(0, 0, 0, 0.75);;
  box-shadow: 0px 1px 30px rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  padding: 2px;

  &&& {
    button {
      height: 25px;
      width: 25px;
      margin:0;
    }
  }

  /* from ol-control */
  button {
    display: block;
    margin: 1px;
    padding: 0;
    color: #fff;
    font-size: 1.14em;
    font-weight: 700;
    text-decoration: none;
    text-align: center;

    line-height: .4em;
    background-color: rgba(0,60,136,.5);
    border: none;
    border-radius: 2px;
  }
  /* end ol-control */

  button.btn.btn-default {
    background-color: inherit;
    color: white;

    :hover {
      background-color: initial;
      color: white;
    }
  }
`;

export const ButtonDraw = styled(EtsBootstrap.Button).attrs({ className: 'ruler' })`
  &.ruler {
    background-image: url(${ruler});
    background-blend-mode: difference;
    background-size: cover;
  }
`;
