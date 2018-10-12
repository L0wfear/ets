import styled from 'styled-components';
import { Panel } from 'react-bootstrap';

export const PanelWrap = styled(Panel)`
  &&& {
    margin: 0;
    border: none;
    background-color: initial;
    box-shadow: none;
  }
`;

export const PanelCollapseWrap = styled(Panel.Collapse)`
`;

export const PanelBodyWrap = styled(Panel.Body)`
  &&& {
    padding: 0px;
  }
`;
