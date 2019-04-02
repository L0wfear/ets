import * as React from 'react';
import { EtsPageWrap } from 'global-styled/global-styled';

import { InspectionAutobaseListProps } from './@types/InspectionAutobaseList';
import InspectionTitle from 'components/new/pages/inspection/common_components/inspect_title/InspectionTitle';
import InspectionAutobaseSelectCarpool from './components/select_carpool/InspectionAutobaseSelectCarpool';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import InspectionAutobaseData from './components/data/InspectionAutobaseData';
import InspectionAutobaseFormLazy from 'components/new/pages/inspection/autobase/form';

const loadingPage = 'inspectAutobase';

const InspectionAutobaseList: React.FC<InspectionAutobaseListProps> = (props) => {
  return (
    <>
      <EtsPageWrap>
        <InspectionTitle  title="Мониторинг обустройства автобаз" />
        <InspectionAutobaseSelectCarpool loadingPage={loadingPage} />
        <InspectionAutobaseData loadingPage={loadingPage} />
      </EtsPageWrap>
      <InspectionAutobaseFormLazy loadingPage={loadingPage} {...props}/>
    </>
  );
};

export default withPreloader({
  page: loadingPage,
  typePreloader: 'mainpage',
})(InspectionAutobaseList);
