import * as React from 'react';

import withDefaultWaybill from 'components/dashboard/menu/cards/_default-card-component/hoc/with-default-waybill/withDefaultWaybill';
import ListNumber from 'components/dashboard/menu/cards/_default-card-component/hoc/with-default-waybill/list/ListNumber';

import {
  dashboardLoadWaybillInProgress,
  dashboardSetInfoDataInWaybillInProgress,
 } from 'components/dashboard/redux-main/modules/dashboard/actions-dashboard';

import WaybillInProgressInfo from 'components/dashboard/menu/cards/waybill-in-progress/info/WaybillInProgressInfo';

import {
  PropsWaybillInProgress,
  StateWaybillInProgress,
} from 'components/dashboard/menu/cards/waybill-in-progress/WaybillInProgress.h';
import { compose } from 'recompose';

class WaybillInProgress extends React.Component<PropsWaybillInProgress, StateWaybillInProgress> {
  render() {
    return (
      <div className="waybill_in_progress">
      </div>
    );
  }
}

export default compose<any, any>(
  withDefaultWaybill({
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
  }),
)(WaybillInProgress);
