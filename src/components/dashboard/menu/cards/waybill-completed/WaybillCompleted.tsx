import * as React from 'react';

import withDefaultWaybill from 'components/dashboard/menu/cards/_default-card-component/hoc/with-default-waybill/withDefaultWaybill';

import ListNumber from 'components/dashboard/menu/cards/_default-card-component/hoc/with-default-waybill/list/ListNumber';
import WaybillCompletedInfo from 'components/dashboard/menu/cards/waybill-completed/info/WaybillCompletedInfo';

import {
  dashboardLoadWaybillCompleted,
  dashboardSetInfoDataInWaybillCompleted,
} from 'components/dashboard/redux/modules/dashboard/actions-dashboard';

import {
  PropsWaybillCompleted,
  StateWaybillCompleted,
} from 'components/dashboard/menu/cards/waybill-completed/WaybillCompleted.h';

class WaybillCompleted extends React.Component<PropsWaybillCompleted, StateWaybillCompleted> {
  render() {
    return (
      <div className="waybill_completed"></div>
    )
  }
}

export default withDefaultWaybill({
  path: 'waybill_completed',
  loadData: dashboardLoadWaybillCompleted,
  InfoComponent: WaybillCompletedInfo,
  setInfoData: dashboardSetInfoDataInWaybillCompleted,
  ListComponent: ListNumber,
  setInfoDataPropsMake: ({ items }, path: string) => (
    items[
      path.split('/').slice(-1)[0]
    ]
  ),
})(WaybillCompleted);