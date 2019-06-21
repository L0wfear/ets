import styled from 'styled-components';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export const EtsFilterCntainer = styled.form`
  margin: 5px 12.5px;
  display: flex;
  background-color: #eee;
  border: 1px solid #ddd;
  padding: 10px;

  height: 100%;

  flex-direction: column;
`;

export const PanelWrap = styled(EtsBootstrap.Panel)`
  &.panel-default {
    border-color: rgba(0, 0, 0, 0);
    margin: 0;
    border: none;
    box-shadow: none;
    position: relative;
  }
`;

export const PanelBodyWrap = styled(EtsBootstrap.PanelBody)`
  &.panel-body {
    padding: 0px;
  }
`;
