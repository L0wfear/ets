import styled from 'styled-components';
import { constantColor } from 'global-styled/global-constants';

export const EtsPaginatorContainer = styled.div`
  padding: 10px 20px 20px 20px;
  margin: 5px;

  >button.btn.btn-default {
    margin: 1px;
    background-color: initial;
    color: #337ab7;

    &.active {
      color: white;
      background-color: ${constantColor.colorGreen};
      &:hover {
        background-color: ${constantColor.colorLightGreen};
      }
    }

    &[disabled] {
      color: rgba(127, 127, 127, 0.9);
    }

    &:hover {
      color: white;
      background-color: rgba(0, 0, 0, .3);
    }
  }
`;
