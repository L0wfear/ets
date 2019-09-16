import * as React from 'react';

import withDefaultWaybill from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-default-waybill/withDefaultWaybill';
import ListNumber from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-default-waybill/list/ListNumber';

import {
  dashboardLoadWaybillDraft,
  dashboardSetInfoDataInWaybillDraft,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';

import WaybillDraftInfo from 'components/new/pages/dashboard/menu/cards/waybill-draft/info/WaybillDraftInfo';

import { PropsToDefaultCard } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';
import { WithRequirePermissionAddProps } from 'components/@next/@common/hoc/require_permission/withRequirePermission';

type Props = WithRequirePermissionAddProps;
const WaybillDraft: React.FC<Props> = React.memo(
  () => {
    return (
      <div className="waybill_draft"></div>
    );
  },
);

export default withDefaultWaybill<PropsToDefaultCard>({
  path: 'waybill_draft',
  loadData: dashboardLoadWaybillDraft,
  InfoComponent: WaybillDraftInfo,
  setInfoData: dashboardSetInfoDataInWaybillDraft,
  ListComponent: ListNumber,
  setInfoDataPropsMake: (items, path: string) => (
    items[
      path.split('/').slice(-1)[0]
    ]
  ),
})(WaybillDraft);
