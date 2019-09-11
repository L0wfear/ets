import * as React from 'react';

import withDefaultWaybill from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-default-waybill/withDefaultWaybill';

import ListNumber from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-default-waybill/list/ListNumber';

import {
  dashboardLoadWaybillClosed,
  dashboardSetInfoDataInWaybillClosed,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';

import WaybillClosedInfo from 'components/new/pages/dashboard/menu/cards/waybill-closed/info/WaybillClosedInfo';

import { PropsToDefaultCard } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';

type Props = {};
const WaybillClosed: React.FC<Props> = React.memo(
  () => {
    return (
      <div className="waybill_closed">
      </div>
    );
  },
);

export default withDefaultWaybill<PropsToDefaultCard>({
  path: 'waybill_closed',
  loadData: dashboardLoadWaybillClosed,
  InfoComponent: WaybillClosedInfo,
  setInfoData: dashboardSetInfoDataInWaybillClosed,
  ListComponent: ListNumber,
  setInfoDataPropsMake: (items, path: string) => (
    items[
      path.split('/').slice(-1)[0]
    ]
  ),
})(WaybillClosed);
