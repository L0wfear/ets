import * as React from 'react';
import { EtsPageWrap } from 'global-styled/global-styled';

import {
  InspectionListBlock,
} from 'components/new/pages/inspection/pgm_base/styled/InspectionPgmBaseList';
import { InspectionPgmBaseListProps } from './@types/InspectionPgmBaseList';
import InspectionPgmBaseTitle from './components/title/InspectionPgmBaseTitle';
import InspectionPgmBaseSelectCarpool from './components/select_carpool/InspectionPgmBaseSelectCarpool';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import InspectionPgmBaseDataWrap from './components/data/InspectionPgmBaseDataWrap';
import InspectionPgmBaseFormLazy from 'components/new/pages/inspection/pgm_base/form';
import AppleStyleBlock from 'components/new/ui/apple_style/AppleStyleBlock';

const loadingPage = 'InspectionPgmBaseList';

const InspectionPgmBaseList: React.FC<InspectionPgmBaseListProps> = (props) => {
  return (
    <>
      <EtsPageWrap>
        <AppleStyleBlock>
          <InspectionPgmBaseTitle />
        </AppleStyleBlock>
        <AppleStyleBlock delay={500}>
          <InspectionListBlock>
            <InspectionPgmBaseSelectCarpool
              loadingPage={loadingPage}
            />
          </InspectionListBlock>
        </AppleStyleBlock>
        <InspectionPgmBaseDataWrap
          loadingPage={loadingPage}
        />
      </EtsPageWrap>
      <InspectionPgmBaseFormLazy loadingPage={loadingPage} {...props}/>
    </>
  );
};

export default withPreloader({
  page: loadingPage,
  typePreloader: 'mainpage',
})(InspectionPgmBaseList);
