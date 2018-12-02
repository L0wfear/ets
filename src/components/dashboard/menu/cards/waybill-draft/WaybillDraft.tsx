import * as React from 'react';

import withDefaultWaybill from 'components/dashboard/menu/cards/_default-card-component/hoc/with-default-waybill/withDefaultWaybill';
import ListNumber from 'components/dashboard/menu/cards/_default-card-component/hoc/with-default-waybill/list/ListNumber';

import {
  dashboardLoadWaybillDraft,
  dashboardSetInfoDataInWaybillDraft,
} from 'components/dashboard/redux-main/modules/dashboard/actions-dashboard';

import WaybillDraftInfo from 'components/dashboard/menu/cards/waybill-draft/info/WaybillDraftInfo';

import {
  PropsWaybillDraft,
  StateWaybillDraft,
} from 'components/dashboard/menu/cards/waybill-draft/WaybillDraft.h';
import { compose } from 'recompose';

class WaybillDraft extends React.Component<PropsWaybillDraft, StateWaybillDraft> {
  render() {
    return (
      <div className="waybill_draft"></div>
    );
  }
}

export default compose<any, any>(
  withDefaultWaybill({
    path: 'waybill_draft',
    loadData: dashboardLoadWaybillDraft,
    InfoComponent: WaybillDraftInfo,
    setInfoData: dashboardSetInfoDataInWaybillDraft,
    ListComponent: ListNumber,
    setInfoDataPropsMake: ({ items }, path: string) => (
      items[
        path.split('/').slice(-1)[0]
      ]
    ),
  }),
)(WaybillDraft);
