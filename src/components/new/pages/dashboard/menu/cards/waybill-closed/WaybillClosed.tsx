import * as React from 'react';

import withDefaultWaybill from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-default-waybill/withDefaultWaybill';

import ListNumber from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-default-waybill/list/ListNumber';

import {
  dashboardLoadWaybillClosed,
  dashboardSetInfoDataInWaybillClosed,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';

import WaybillClosedInfo from 'components/new/pages/dashboard/menu/cards/waybill-closed/info/WaybillClosedInfo';

import {
  PropsWaybillClosed,
  StateWaybillClosed,
} from 'components/new/pages/dashboard/menu/cards/waybill-closed/WaybillClosed.h';
import { compose } from 'recompose';
import { PropsToDefaultCard } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard.h';

class WaybillClosed extends React.Component<PropsWaybillClosed, StateWaybillClosed> {
  render() {
    return (
      <div className="waybill_closed">
      </div>
    );
  }
}

export default compose<PropsWaybillClosed, PropsToDefaultCard>(
  withDefaultWaybill({
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
  }),
)(WaybillClosed);
