import styled from 'styled-components';
import * as Row from 'react-bootstrap/lib/Row';

export const EtsFiltersLines = styled(Row)`
`;

export const EtsFilter = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const EtsFilterTitle = styled.div`
  text-align: center;
  font-weight: 700;
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
