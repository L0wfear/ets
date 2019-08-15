import * as React from 'react';

import { EtsGreyPageWrap } from 'global-styled/global-styled';
import InspectionTitle from 'components/new/pages/inspection/common_components/inspect_title/InspectionTitle';
import InspectionPgmBaseSelectData from './components/select_pgm_store/InspectionPgmBaseSelectData';
import InspectionPgmBaseData from './components/data/InspectionPgmBaseData';
import InspectionPgmBaseFormLazy from 'components/new/pages/inspection/pgm_base/form';
import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';

import { InspectionPgmBaseListProps } from './@types/InspectionPgmBaseList';

const loadingPage = 'inspectionPgmBase';

const InspectionPgmBaseList: React.FC<InspectionPgmBaseListProps> = (props) => {
  return (
    <>
      <EtsGreyPageWrap>
        <InspectionTitle title="Мониторинг состояния баз хранения ПГМ" />
        <InspectionPgmBaseSelectData loadingPage={loadingPage} />
        <InspectionPgmBaseData loadingPage={loadingPage} />
      </EtsGreyPageWrap>
      <InspectionPgmBaseFormLazy loadingPage={loadingPage} {...props}/>
    </>
  );
};

export default withPreloader({
  page: loadingPage,
  typePreloader: 'mainpage',
})(InspectionPgmBaseList);
