import styled from 'styled-components';

export const ColumnPopupContainer = styled.div`
  position: absolute;
  padding: 15px 5px;
  line-height: normal;
  font-size: 14px;
  white-space: normal;
  background-color: #EEE;
  color: #000;
  border: 1px solid #c1c1c1;
  z-index: 1;

  min-width: 250px;
  max-height: 600px;
  overflow: auto;

  > div {
    margin: 0 20px;
    cursor: pointer;

    label {
      font-size: 14px;
      font-weight: 400;
    }
  }
`;
