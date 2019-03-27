import * as React from 'react';
import { EtsPageWrap } from 'global-styled/global-styled';

import {
  InspectionListBlock,
} from 'components/new/pages/inspection/autobase/styled/InspectionAutobaseList';
import { InspectionAutobaseListProps } from './@types/InspectionAutobaseList';
import InspectionAutobaseTitle from './components/title/InspectionAutobaseTitle';
import InspectionAutobaseSelectCarpool from './components/select_carpool/InspectionAutobaseSelectCarpool';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import InspectionAutobaseDataWrap from './components/data/InspectionAutobaseDataWrap';
import InspectionAutobaseFormLazy from 'components/new/pages/inspection/autobase/form';
import AppleStyleBlock from 'components/new/ui/apple_style/AppleStyleBlock';

const loadingPage = 'InspectionAutobaseList';

const InspectionAutobaseList: React.FC<InspectionAutobaseListProps> = (props) => {
  return (
    <>
      <EtsPageWrap>
        <AppleStyleBlock>
          <InspectionAutobaseTitle />
        </AppleStyleBlock>
        <AppleStyleBlock delay={500}>
          <InspectionListBlock>
            <InspectionAutobaseSelectCarpool
              loadingPage={loadingPage}
            />
          </InspectionListBlock>
        </AppleStyleBlock>
        <InspectionAutobaseDataWrap
          loadingPage={loadingPage}
        />
      </EtsPageWrap>
      <InspectionAutobaseFormLazy loadingPage={loadingPage} {...props}/>
    </>
  );
};

export default withPreloader({
  page: loadingPage,
  typePreloader: 'mainpage',
})(InspectionAutobaseList);
