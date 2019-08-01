import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import {
  TemplateRouteContainer,
  TemplateRouteWrap,
  TemplateRouteListTree,
  TemplateRouteData,
  TemplateBlockData,
  TemplateBlockDataGrey,
} from './styled';

export default React.memo(
  () => (
    <>
      <LoadingComponent />
      <TemplateRouteContainer>
        <TemplateRouteWrap>
          <TemplateRouteListTree>
            <TemplateBlockData width={215}/>
            <TemplateBlockData width={170} height={20} />
            <TemplateBlockData width={160} height={20}/>
            <TemplateBlockData width={150} height={20}/>
          </TemplateRouteListTree>
          <TemplateRouteData>
            <TemplateBlockDataGrey />
          </TemplateRouteData>
        </TemplateRouteWrap>
      </TemplateRouteContainer>
    </>
  ),
);
