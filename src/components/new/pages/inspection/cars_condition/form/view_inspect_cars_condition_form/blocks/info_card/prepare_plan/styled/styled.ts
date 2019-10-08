import styled from 'styled-components';
import { EtsHeaderTitle } from 'components/new/ui/registry/components/data/header/title/styled/styled';
import { EtsHeaderContainer } from 'components/new/ui/registry/components/data/header/styled/styled';

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
  ${EtsHeaderTitle} {
    font-size: 18px;
    font-weight: 600;
    max-width: 50%;
  }
  ${EtsHeaderContainer} {
    margin-bottom: 10px;
  }
`;
