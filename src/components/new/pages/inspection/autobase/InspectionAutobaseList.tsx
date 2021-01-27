import * as React from 'react';
import { EtsGreyPageWrap } from 'global-styled/global-styled';

import InspectionTitle from 'components/new/pages/inspection/common_components/inspect_title/InspectionTitle';
import InspectionAutobaseSelectCarpool from './components/select_carpool/InspectionAutobaseSelectCarpool';
import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';
import InspectionAutobaseData from './components/data/InspectionAutobaseData';
import InspectionAutobaseFormLazy from 'components/new/pages/inspection/autobase/form';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type OwnProps = {};
type Props = OwnProps & {};

const loadingPage = 'inspectAutobase';

const InspectionAutobaseList: React.FC<Props> = (props) => {
  const [refresh, setRefresh] = React.useState(false);
  return (
    <React.Fragment>
      <EtsGreyPageWrap>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <InspectionTitle title="Мониторинг обустройства автобаз" />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={4}>
            <InspectionAutobaseSelectCarpool loadingPage={loadingPage} setRefresh={setRefresh} />
          </EtsBootstrap.Col>
          <InspectionAutobaseData loadingPage={loadingPage} refresh={refresh} setRefresh={setRefresh} />
        </EtsBootstrap.Row>
      </EtsGreyPageWrap>
      <InspectionAutobaseFormLazy loadingPage={loadingPage} {...props}/>
    </React.Fragment>
  );
};

export default withPreloader<OwnProps>({
  page: loadingPage,
  typePreloader: 'mainpage',
})(InspectionAutobaseList);
