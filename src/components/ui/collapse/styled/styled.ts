import styled from 'styled-components';
import * as Panel from 'react-bootstrap/lib/Panel';

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
  background-color: #eee!important;
  &&& {
    padding: 0px;
  }
`;
