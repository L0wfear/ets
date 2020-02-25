import * as React from 'react';
import { PropsToDefaultCard } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';

import {
  dashboardLoadWaybillCompleted,
  dashboardSetInfoDataInWaybillCompleted,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';
import WaybillCompletedInfo from 'components/new/pages/dashboard/menu/cards/waybill-completed/info/WaybillCompletedInfo';

import { WithRequirePermissionAddProps } from 'components/@next/@common/hoc/require_permission/withRequirePermission';
import withDefaultWaybill from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-default-waybill/withDefaultWaybill';
import ListNumber from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-default-waybill/list/ListNumber';

type Props = WithRequirePermissionAddProps;
const WaybillClosed: React.FC<Props> = React.memo(
  () => {
    return (
      <div className="waybill_completed">
      </div>
    );
  },
);

export default withDefaultWaybill<PropsToDefaultCard>({
  path: 'waybill_completed',
  loadData: dashboardLoadWaybillCompleted,
  InfoComponent: WaybillCompletedInfo,
  setInfoData: dashboardSetInfoDataInWaybillCompleted,
  ListComponent: ListNumber,
  setInfoDataPropsMake: (items, path: string) => (
    items[
      path.split('/').slice(-1)[0]
    ]
  ),
})(WaybillClosed);
