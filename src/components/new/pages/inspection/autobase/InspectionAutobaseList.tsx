import * as React from 'react';
import { EtsGreyPageWrap } from 'global-styled/global-styled';

import { InspectionAutobaseListProps } from './@types/InspectionAutobaseList';
import InspectionTitle from 'components/new/pages/inspection/common_components/inspect_title/InspectionTitle';
import InspectionAutobaseSelectCarpool from './components/select_carpool/InspectionAutobaseSelectCarpool';
import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';
import InspectionAutobaseData from './components/data/InspectionAutobaseData';
import InspectionAutobaseFormLazy from 'components/new/pages/inspection/autobase/form';
import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';

const loadingPage = 'inspectAutobase';

const InspectionAutobaseList: React.FC<InspectionAutobaseListProps> = (props) => {
  return (
    <React.Fragment>
      <EtsGreyPageWrap>
        <InspectionTitle title="Мониторинг обустройства автобаз" />
        <BoxContainer>
          <InspectionAutobaseSelectCarpool loadingPage={loadingPage} />
        </BoxContainer>
        <InspectionAutobaseData loadingPage={loadingPage} />
      </EtsGreyPageWrap>
      <InspectionAutobaseFormLazy loadingPage={loadingPage} {...props}/>
    </React.Fragment>
  );
};

export default withPreloader({
  page: loadingPage,
  typePreloader: 'mainpage',
})(InspectionAutobaseList);
