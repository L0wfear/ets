import styled from 'styled-components';

import { EtsPageWrap } from 'global-styled/global-styled';

import { constantColor } from 'global-styled/global-constants';

export const EtsPageWrapCompanyStructure = styled(EtsPageWrap)`
  .griddle-body {
    tbody {
      & tr.standard-row>td:first-child {
        padding-left: 15px !important;
      }
      & tr:not(:first-child).child-row {
        &> td:first-child {
          padding-left: 20px !important;
        }
        &> td:not(:first-child) {
          padding: 5px !important;
        }
      }

      &:nth-child(even){
        background-color: #f7f7f7 !important;
      }
    
      tr {
        &.expanded > td {
          background-color: ${constantColor.colorGreen} !important;
          color: white !important;
        }
        
        &:nth-of-type(n+2){
          cursor: pointer;

          &:nth-child(even) > td {
            background-color: #f7f7f7 !important;
          }

          &:hover > td, &.selected-row > td {
            background-color: ${constantColor.colorGreen} !important;
            color: white !important;
          }

          &.child-row:hover > td, &.highlighted-row > td {
            background-color: ${constantColor.colorYellow} !important;
          }
        }
      }

      td {
        vertical-align: top;
        background-color: transparent !important;
        word-break: break-all;
      }
    }
  }
`;
