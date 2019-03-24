import styled from 'styled-components';
import * as Button from 'react-bootstrap/lib/Button';

export const EtsFiltersButtonsLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 5px;
`;

export const EtsFiltersCloseContainer = styled.div`
  font-size: 20px;
  cursor: pointer;
  color: #444;
  transition: color 0.2s;

  :hover {
    color: red;
  }
`;

export const EtsFilterActionButtonConteiner = styled.div``;

export const EtsFilterActionButton = styled(Button)`
  margin: 0 5px;
`;
