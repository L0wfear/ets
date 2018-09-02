import * as React from 'react';

import withDefaultWaybill from 'components/dashboard/new/menu/cards/_default-card-component/hoc/with-default-waybill/withDefaultWaybill';

import ListNumber from 'components/dashboard/new/menu/cards/_default-card-component/hoc/with-default-waybill/list/ListNumber';

import {
  dashboardLoadWaybillClosed,
  dashboardSetInfoDataInWaybillClosed,
} from 'components/dashboard/new/redux/modules/dashboard/actions-dashboard';

import WaybillClosedInfo from 'components/dashboard/new/menu/cards/waybill-closed/info/WaybillClosedInfo';

import {
  PropsWaybillClosed,
  StateWaybillClosed,
} from 'components/dashboard/new/menu/cards/waybill-closed/WaybillClosed.h';

class WaybillClosed extends React.Component<PropsWaybillClosed, StateWaybillClosed> {
  render() {
    return (
      <div className="waybill_closed">
      </div>
    )
  }
}

export default withDefaultWaybill({
  path: 'waybill_closed',
  loadData: dashboardLoadWaybillClosed,
  InfoComponent: WaybillClosedInfo,
  setInfoData: dashboardSetInfoDataInWaybillClosed,
  ListComponent: ListNumber,
  setInfoDataPropsMake: ({ items }, path: string) => (
    items[
      path.split('/').slice(-1)[0]
    ]
  ),
})(WaybillClosed);