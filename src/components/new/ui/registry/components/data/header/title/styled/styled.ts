import styled from 'styled-components';

export const EtsHeaderTitle = styled.div`
  font-size: 18px;
  margin: 2.5px;
  display: flex;
  align-items: baseline;
  /* justify-content: unset; */
  flex-shrink: 0;
  justify-content: space-between;

  >* {
    margin-right: 5px;
    &:last-child {
      margin-right: 0;
    }
  }
`;
