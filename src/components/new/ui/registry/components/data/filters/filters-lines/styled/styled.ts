import styled from 'styled-components';

export const EtsFilterContainer = styled.div`
  padding: 0 15px;
  @media screen and (min-width: 1200px) {
    width: 25%;
  }
  @media screen and (max-width: 1200px) and (min-width: 992px) {
    width: 33%;
  }
  @media screen and (max-width: 992px) and (min-width: 768px) {
    width: 50%;
  }
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

export const EtsFiltersLines = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -15px;
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
