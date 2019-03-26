import styled from 'styled-components';
import { EtsPageWrap } from 'global-styled/global-styled';

export const HiddenPageEtsContainer = styled(EtsPageWrap)`
  position: absolute;
  width: 100%;
  top: 0;
  padding: 0;
  pointer-events: none;
  z-index: 2;
`;

export const PopupBottomForm = styled.form<{ show: boolean }>`
  pointer-events: ${({ show }) => show ? 'all' : 'none'};
  height: 100%;
  overflow: scroll;

  padding: 15px 20px;
  background-color: white;

  transition: all 500ms;
  opacity: ${({ show }) => show ? 1 : 0};
`;
