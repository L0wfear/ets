import * as React from 'react';

import { EtsGreyPageWrap } from 'global-styled/global-styled';
import InspectionTitle from 'components/new/pages/inspection/common_components/inspect_title/InspectionTitle';
import InspectionPgmBaseSelectData from './components/select_pgm_store/InspectionPgmBaseSelectData';
import InspectionPgmBaseData from './components/data/InspectionPgmBaseData';
import InspectionPgmBaseFormLazy from 'components/new/pages/inspection/pgm_base/form';
import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';

import EtsBootstrap from 'components/new/ui/@bootstrap';

const loadingPage = 'inspectionPgmBase';

type OwnProps = {};
type Props = OwnProps & {};

const InspectionPgmBaseList: React.FC<Props> = (props) => {
  return (
    <>
      <EtsGreyPageWrap>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <InspectionTitle title="Мониторинг состояния баз хранения ПГМ" />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={4}>
            <InspectionPgmBaseSelectData loadingPage={loadingPage} />
          </EtsBootstrap.Col>
          <InspectionPgmBaseData loadingPage={loadingPage} />
        </EtsBootstrap.Row>
      </EtsGreyPageWrap>
      <InspectionPgmBaseFormLazy loadingPage={loadingPage} {...props}/>
    </>
  );
};

export default withPreloader<OwnProps>({
  page: loadingPage,
  typePreloader: 'mainpage',
})(InspectionPgmBaseList);
