import styled from 'styled-components';
import { Panel } from 'react-bootstrap';

export const EtsFilterCntainer = styled.div`
  margin: 10px 25px;
  display: flex;
  background-color: #eee;
  border: 1px solid #ddd;
  padding: 10px; 

  flex-direction: column;
`;

export const PanelWrap = styled(Panel)`
  &.panel-default {
    border-color: rgba(0, 0, 0, 0);
    margin: 0;
    border: none;
    box-shadow: none;
  }
`;

export const PanelBodyWrap = styled(Panel.Body)`
  &.panel-body {
    padding: 0px;
  }
`;