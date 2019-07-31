import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import {
  TemplateMonitorContainer,
  TemplateMonitorWrap,
  TemplateBlockMenu,
  TemplateBlockButtons,
  TemplateBlockData,
} from './styled';

export default React.memo(
  () => (
    <>
      <LoadingComponent />
      <TemplateMonitorContainer>
        <TemplateMonitorWrap>
          <TemplateBlockMenu>
            <TemplateBlockData width={275} height={100} />
            <TemplateBlockData width={200} height={70} />
            <TemplateBlockData width={200} />
            <TemplateBlockData width={200} />
            <TemplateBlockData width={200} />
          </TemplateBlockMenu>
          <TemplateBlockButtons>
            <TemplateBlockData width={30} height={60} />
            <TemplateBlockData width={30} height={60} />
            <TemplateBlockData width={30} height={60} />
          </TemplateBlockButtons>
        </TemplateMonitorWrap>
      </TemplateMonitorContainer>
    </>
  ),
);
