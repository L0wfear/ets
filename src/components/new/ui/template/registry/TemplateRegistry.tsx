import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import {
  TemplateRegistryContainer,
  TemplateHeaderLineContainer,
  TemplateTitle,
  TemplateButtonsContainer,
  TemplateButton,
  TemplateButtonCreate,
  TemplateButtonRead,
  TableContainer,
  PaginatorContainer,
} from './styled';

export default React.memo(
  () => (
    <>
      <LoadingComponent />
      <TemplateRegistryContainer>
        <TemplateHeaderLineContainer>
          <TemplateTitle />
          <TemplateButtonsContainer>
            <TemplateButton />
            <TemplateButtonCreate />
            <TemplateButtonRead />
            <TemplateButton />
          </TemplateButtonsContainer>
        </TemplateHeaderLineContainer>
        <TableContainer />
        <PaginatorContainer />
      </TemplateRegistryContainer>
    </>
  ),
);
