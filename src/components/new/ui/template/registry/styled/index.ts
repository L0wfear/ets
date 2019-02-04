import styled from 'styled-components';
import { EtsPageWrap } from 'global-styled/global-styled';

export const TemplateRegistryContainer = styled(EtsPageWrap)`
  opacity: 0.5;
`;

export const MaintTemplateComponent = styled.div`
  border-radius: 10px;
  background-color: grey;
  margin: 5px;
  height: 30px;
`;

export const TemplateHeaderLineContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TemplateTitle = styled(MaintTemplateComponent)`
  min-width: 200px;
  width: 300px;
`;

export const TemplateButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const TemplateButton = styled(MaintTemplateComponent)`
  min-width: 40px;
`;

export const TemplateButtonRead = styled(MaintTemplateComponent)`
  min-width: 140px;
`;

export const TemplateButtonCreate = styled(MaintTemplateComponent)`
  min-width: 140px;
`;

export const TableContainer = styled(MaintTemplateComponent)`
  margin-top: 15px;
  height: calc(100vh - 270px);
`;

export const PaginatorContainer = styled(MaintTemplateComponent)`
  margin: 20px 0;

  min-width: 200px;
  width: 350px;
`;
