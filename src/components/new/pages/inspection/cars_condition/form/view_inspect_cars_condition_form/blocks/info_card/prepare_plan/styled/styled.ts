import styled from 'styled-components';

export const CustomTableWrapper = styled.div`
  .pull-right {
    float: none!important;
  }
  .btn-toolbar {
    margin-left: 0px!important;
    margin-bottom: 10px;
    margin-top: 20px;
    button {
      &:first-child {
        margin-left: 0px;
      }
    }
  }
  .date-table-input .griddle-body{
    height: auto;
  }
  .data-table .griddle{
    min-height: 414px;
  }
`;
