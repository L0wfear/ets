import styled from 'styled-components';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export const PanelWrap = styled(EtsBootstrap.Panel)`
  &&& {
    margin: 0;
    border: none;
    background-color: initial;
    box-shadow: none;
  }
`;

export const PanelCollapseWrap = styled(EtsBootstrap.PanelCollapse)`
`;

export const PanelBodyWrap = styled(EtsBootstrap.PanelBody)`
  background-color: #eee!important;
  &&& {
    padding: 0px;
  }
`;
