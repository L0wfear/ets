import * as React from 'react';

import withDefaultWaybill from 'components/dashboard/new/menu/cards/_default-card-component/hoc/with-default-waybill/withDefaultWaybill';
import ListNumber from 'components/dashboard/new/menu/cards/_default-card-component/hoc/with-default-waybill/list/ListNumber';

import {
  dashboardLoadWaybillInProgress,
  dashboardSetInfoDataInWaybillInProgress,
 } from 'components/dashboard/new/redux/modules/dashboard/actions-dashboard';

import WaybillInProgressInfo from 'components/dashboard/new/menu/cards/waybill-in-progress/info/WaybillInProgressInfo';

import {
  PropsWaybillInProgress,
  StateWaybillInProgress,
} from 'components/dashboard/new/menu/cards/waybill-in-progress/WaybillInProgress.h';

class WaybillInProgress extends React.Component<PropsWaybillInProgress, StateWaybillInProgress> {
  render() {
    return (
      <div className="waybill_in_progress">
      </div>
    )
  }
}

export default withDefaultWaybill({
  path: 'waybill_in_progress',
  loadData: dashboardLoadWaybillInProgress,
  InfoComponent: WaybillInProgressInfo,
  setInfoData: dashboardSetInfoDataInWaybillInProgress,
  ListComponent: ListNumber,
  setInfoDataPropsMake: ({ items }, path: string) => (
    items[
      path.split('/').slice(-1)[0]
    ]
  ),
})(WaybillInProgress);