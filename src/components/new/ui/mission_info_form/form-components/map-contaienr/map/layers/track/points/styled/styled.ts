import styled from 'styled-components';

import {
  OverlayInsideContainer,
  EtsOverlayContainer,
} from 'components/new/ui/map/overlay/styled/styled';

export const OverlayInsideTrackContainer = styled(OverlayInsideContainer)``;

export const EtsOverlayTrackContainer = styled(EtsOverlayContainer)`
  width: 500px;
`;

export const OverlayTrackTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-right: 5px;
`;

export const SensorsListContainer = styled.div`
  margin: 5px;
`;

export const OverlayBoxInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;

  >div {
    border-bottom: 1px solid #d7d7d7;
    flex: 1 1 auto;
    border-left: 1px solid #d7d7d7;
    border-right: 1px solid #d7d7d7;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;

    &:first-child {
      border-left: none;
    }
    &:last-child {
      border-right: none;
    }
  }
`;
