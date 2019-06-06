import styled from 'styled-components';

export const BlockCommentDataFirstLine = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  >* {
    margin: 0 10px;

    &:last-child {
      margin-right: 0;
    }
    &:first-child {
      margin-left: 0;
    }
  }
`;
