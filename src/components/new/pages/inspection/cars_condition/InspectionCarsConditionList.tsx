import * as React from 'react';

import { EtsGreyPageWrap } from 'global-styled/global-styled';
import InspectionTitle from 'components/new/pages/inspection/common_components/inspect_title/InspectionTitle';
import InspectionCarsConditionSelectData from 'components/new/pages/inspection/cars_condition/components/select_data/InspectionCarsConditionSelectData';
import InspectionCarsConditionData from 'components/new/pages/inspection/cars_condition/components/data/InspectionCarsConditionData';
import InspectionCarsConditionFormLazy from 'components/new/pages/inspection/cars_condition/form';
import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';

import { RouteComponentProps } from 'react-router';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export type InspectionCarsConditionListProps = (
  RouteComponentProps<{}>
);

const loadingPage = 'inspectionCarsCondition';

const InspectionCarsConditionList: React.FC<InspectionCarsConditionListProps> = (props) => {
  return (
    <>
      <EtsGreyPageWrap>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <InspectionTitle title="Мониторинг транспортных средств" />
            <InspectionCarsConditionSelectData loadingPage={loadingPage} />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <InspectionCarsConditionData loadingPage={loadingPage} />
      </EtsGreyPageWrap>
      <InspectionCarsConditionFormLazy loadingPage={loadingPage} {...props}/>
    </>
  );
};

export default withPreloader({
  page: loadingPage,
  typePreloader: 'mainpage',
})(InspectionCarsConditionList);
