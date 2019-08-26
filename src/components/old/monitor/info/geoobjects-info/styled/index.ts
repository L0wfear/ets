import styled, { css } from 'styled-components';
import { CarInfoTitleSpanContainer } from 'components/old/monitor/styled';

export const ContainerButtonToggleShowGeoobjectList = styled.div`
  pointer-events: all;
  cursor: pointer;
`;

const maxWidth350css = css`
  max-width: 350px;
`;

export const GeoobjectInfo = styled.div`
  ${maxWidth350css}
`;

export const GeoobjectListContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row-reverse;
  overflow: hidden;
`;

export const CarInfoTrackDateTitle = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #d7d7d7;
  align-items: baseline;
  padding: 5px;
  font-weight: 500;
`;

export const CarInfoTitleSpanContainerWrapFlexBasic100 = styled(CarInfoTitleSpanContainer)`
  flex-basis: 100%;
`;
