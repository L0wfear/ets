import styled from 'styled-components';

export const EtsFiltersLines = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const EtsFilter = styled.div`
  flex: 1 1 225px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  min-width: 225px;
  max-width: 20%;

  @media screen and (max-width: 1211px) {
    max-width: 25%;
  }
  @media screen and (max-width: 986px) {
    max-width: 33%;
  }
  @media screen and (max-width: 761px) {
    max-width: 50%;
  }
  @media screen and (max-width: 536px) {
    max-width: 100%;
  }
`;

export const EtsFilterTitle = styled.div`
  text-align: center;
  font-weight: 800;
  margin: 5px 0;
`;

export const EtsFilterInputContainer = styled.div`
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
