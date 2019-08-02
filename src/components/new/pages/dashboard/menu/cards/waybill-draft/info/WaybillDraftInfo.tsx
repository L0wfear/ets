import * as React from 'react';
import memoize from 'memoize-one';

import { connect } from 'react-redux';
import { compose } from 'recompose';
import { groupBy } from 'lodash';

import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';

import InfoCard from 'components/new/pages/dashboard/menu/cards/_default-card-component/info-card/InfoCard';

import {
  dashboardLoadDependentDataByWaybillDraft,
  dashboardSetInfoDataInWaybillDraft,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';
import { loadWaybillById } from 'redux-main/trash-actions/waybill/waybill';

import { makeDate } from 'components/@next/@utils/dates/dates';

import WaybillFormWrapTSX from 'components/old/waybill/WaybillFormWrap';

import {
  PropsWaybillDraftInfo,
  StateWaybillDraftInfo,
} from 'components/new/pages/dashboard/menu/cards/waybill-draft/info/WaybillDraftInfo.h';
import { WaybillDraftItemsSubItemsType } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/waibill-draft.h';
import { TitleWaybillInfoContainer } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-default-waybill/styled/styled';
import { getDashboardState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';

const WaybillFormWrap: any = WaybillFormWrapTSX;

class WaybillDraftInfo extends React.PureComponent<PropsWaybillDraftInfo, StateWaybillDraftInfo> {
  state = {
    showWaybillFormWrap: false,
    elementWaybillFormWrap: null,
  };

  filterInfoData = memoize((infoData) => {
    if (infoData) {
      return groupBy<WaybillDraftItemsSubItemsType>(
        infoData.subItems,
        (waybill) => makeDate(waybill.data.waybill_date_create),
      );
    }

    return {};
  });

  handleClose: React.MouseEventHandler<HTMLDivElement> = () => {
    this.props.handleClose();
  };

  openWaybillFormWrap: React.MouseEventHandler<HTMLLIElement> = ({
    currentTarget: {
      dataset: { path },
    },
  }) => {
    this.props
      .getWaybillById(Number.parseInt(path, 0))
      .then(({ payload: { waybill_data } }) => {
        if (waybill_data) {
          this.setState({
            showWaybillFormWrap: true,
            elementWaybillFormWrap: waybill_data,
          });
        } else {
          // tslint:disable-next-line
          console.warn('not find waybill');
        }
      });
  };

  handleWaybillFormWrapHide = () => {
    this.setState({
      showWaybillFormWrap: false,
      elementWaybillFormWrap: null,
    });
  };

  handleWaybillFormWrapHideAfterSubmit = (newState) => {
    this.props.loadAllWaybillCard();
    this.setState({
      showWaybillFormWrap: false,
      elementWaybillFormWrap: null,
      ...newState,
    });
  };

  mapArrData = ({ data: { waybill_id }, title }) => (
    <li
      key={waybill_id}
      className="pointer"
      data-path={waybill_id}
      onClick={this.openWaybillFormWrap}>
      {title}
    </li>
  );

  mapInfoDataGroupByDate = ([key, arrData]) => (
    <div key={key}>
      <TitleWaybillInfoContainer>{key}</TitleWaybillInfoContainer>
      <div>
        <ul>{arrData.map(this.mapArrData)}</ul>
      </div>
    </div>
  );

  render() {
    const { infoData } = this.props;

    const infoDataGroupByDate = this.filterInfoData(infoData);

    return (
      <InfoCard title="Рег. номер ТС" handleClose={this.handleClose}>
        {Object.entries(infoDataGroupByDate)
          .sort()
          .map(this.mapInfoDataGroupByDate)
        }
        {
          this.state.showWaybillFormWrap
            && (
              <WaybillFormWrap
                onFormHide={this.handleWaybillFormWrapHideAfterSubmit}
                onCallback={this.handleWaybillFormWrapHideAfterSubmit}
                element={this.state.elementWaybillFormWrap}
              />
            )
        }
      </InfoCard>
    );
  }
}

export default compose<any, any>(
  withShowByProps({
    path: ['dashboard', 'waybill_draft', 'infoData'],
    type: 'none',
  }),
  connect<any, any, any, ReduxState>(
    (state) => ({
      infoData: getDashboardState(state).waybill_draft.infoData,
      infoDataRaw: getDashboardState(state).waybill_draft.data.items[0],
    }),
    (dispatch) => ({
      handleClose: () => dispatch(dashboardSetInfoDataInWaybillDraft(null)),
      loadAllWaybillCard: () =>
        dispatch(dashboardLoadDependentDataByWaybillDraft()),
      getWaybillById: (id) =>
        dispatch(
          loadWaybillById('none', id, {
            promise: true,
            page: 'dashboard',
          }),
        ),
    }),
  ),
)(WaybillDraftInfo);
