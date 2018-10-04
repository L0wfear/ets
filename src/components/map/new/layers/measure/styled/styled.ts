import styled from 'styled-components';

import {
  PropsOverlay,
} from 'components/map/new/overlay/Overlay.h';

import {
  OverlayInsideContainer,
  EtsOverlayContainer,
  EtsOverlayTitleContainer,
  EtsTriangleContainer,
} from 'components/map/new/overlay/styled/styled';

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