import * as React from 'react';

import { EtsGreyPageWrap } from 'global-styled/global-styled';
import InspectionTitle from 'components/new/pages/inspection/common_components/inspect_title/InspectionTitle';
import InspectionCarsConditionSelectData from 'components/new/pages/inspection/cars_condition/components/select_data/InspectionCarsConditionSelectData';
import InspectionCarsConditionData from 'components/new/pages/inspection/cars_condition/components/data/InspectionCarsConditionData';
import InspectionCarsConditionFormLazy from 'components/new/pages/inspection/cars_condition/form';
import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';

import EtsBootstrap from 'components/new/ui/@bootstrap';

type OwnProps = {};
type Props = OwnProps & {};

const loadingPage = 'inspectionCarsCondition';

const InspectionCarsConditionList: React.FC<Props> = (props) => {
  return (
    <>
      <EtsGreyPageWrap>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <InspectionTitle title="Мониторинг транспортных средств" />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={4}>
            <InspectionCarsConditionSelectData loadingPage={loadingPage} />
          </EtsBootstrap.Col>
          <InspectionCarsConditionData loadingPage={loadingPage} />
        </EtsBootstrap.Row>
      </EtsGreyPageWrap>
      <InspectionCarsConditionFormLazy loadingPage={loadingPage} {...props}/>
    </>
  );
};

export default withPreloader<OwnProps>({
  page: loadingPage,
  typePreloader: 'mainpage',
})(InspectionCarsConditionList);
