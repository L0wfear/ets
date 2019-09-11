import * as React from 'react';

import withDefaultWaybill from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-default-waybill/withDefaultWaybill';
import ListNumber from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-default-waybill/list/ListNumber';

import {
  dashboardLoadWaybillInProgress,
  dashboardSetInfoDataInWaybillInProgress,
 } from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';

import WaybillInProgressInfo from 'components/new/pages/dashboard/menu/cards/waybill-in-progress/info/WaybillInProgressInfo';

import { PropsToDefaultCard } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';

type Props = {};
const WaybillInProgress: React.FC<Props> = React.memo(
  () => {
    return (
      <div className="waybill_in_progress">
      </div>
    );
  },
);

export default withDefaultWaybill<PropsToDefaultCard>({
  path: 'waybill_in_progress',
  loadData: dashboardLoadWaybillInProgress,
  InfoComponent: WaybillInProgressInfo,
  setInfoData: dashboardSetInfoDataInWaybillInProgress,
  ListComponent: ListNumber,
  setInfoDataPropsMake: (items, path: string) => (
    items[
      path.split('/').slice(-1)[0]
    ]
  ),
})(WaybillInProgress);
