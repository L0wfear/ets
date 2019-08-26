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

const polygon = require('components/old/monitor/layers/polygon_buffer/styled/image/polygon.png');

export const OverlayInsideMeasureContainer = styled(OverlayInsideContainer)`
  font-size: 12px;
  font-weight: 500;
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
  background-color: rgba(0,0,0,0.75);
  box-shadow: 0px 1px 30px rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  padding: 2px;

  &&& {
    button {
      height: 25px;
      width: 25px;
      min-width: 33px;
      margin: 0;
      display: flex;
      align-items: center;
      background-size: 19px;
      background-position: center;
      background-repeat: no-repeat;
      padding: 0;
      font-size: 1.14em;
      text-align: center;
    }
  }

`;

export const ButtonDraw = styled(EtsBootstrap.Button).attrs({ className: 'ruler' })`
  &.ruler {
    background-image: url(${polygon});
    background-blend-mode: hard-light;;
    background-size: cover;
  }
`;
