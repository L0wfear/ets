import styled from 'styled-components';
import * as Row from 'react-bootstrap/lib/Row';
import { Col } from 'react-bootstrap';

export const EtsFilterContainer = styled(Col).attrs({
  lg: 3,
  md: 4,
  sm: 6,
})``;

export const EtsFiltersLines = styled(Row)`
  @media screen and (min-width: 1200px) {
    ${EtsFilterContainer}:nth-child(4n + 1) {
      clear: left;
    }
  }
  @media screen and (max-width: 1200px) and (min-width: 992px) {
    ${EtsFilterContainer}:nth-child(3n + 1) {
      clear: left;
    }
  }
  @media screen and (max-width: 992px) {
    ${EtsFilterContainer}:nth-child(2n + 1) {
      clear: left;
    }
  }
`;

export const EtsFilter = styled.label<{ noneClick?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;

  pointer-events: ${({ noneClick }) => noneClick ? 'none' : 'all'};
`;

export const EtsFilterTitle = styled.span`
  text-align: center;
  font-weight: 700;
  margin: 5px 0;
`;

export const EtsFilterInputContainer = styled.div`
  font-weight: initial;
  position: relative;
`;

export const EtsPreloaderFieldContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  padding: 4px;
  background: rgba(1, 1, 1, 0.1);
  display: flex;
  justify-content: center;
`;

export const EtsFilterInputAdvacedContainer = styled(EtsFilterInputContainer)`
`;

export const AdvacedSelectContainer = styled.div`
`;

export const AdvacedFirstInputContainer = styled.div`
`;

export const AdvacedFirstLineContainer = styled.div`
  display: flex;
  margin-bottom: 5px;

  ${AdvacedSelectContainer} {
    width: 100px;
  }

  ${AdvacedFirstInputContainer} {
    width: 100%;
    margin-left: 5px;
  }
`;
export const AdvacedSecondLineContainer = styled.div`
`;
