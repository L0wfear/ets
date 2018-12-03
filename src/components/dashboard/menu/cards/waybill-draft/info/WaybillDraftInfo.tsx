import * as React from 'react';

import { connect } from 'react-redux';
import { compose } from 'recompose';
import { groupBy } from 'lodash';

import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';

import InfoCard from 'components/dashboard/menu/cards/_default-card-component/info-card/InfoCard';

import {
  dashboardLoadDependentDataByWaybillDraft,
  dashboardSetInfoDataInWaybillDraft,
} from 'components/dashboard/redux-main/modules/dashboard/actions-dashboard';
import { loadWaybillById } from 'redux-main/trash-actions/waybill/waybill';

import { makeDate } from 'utils/dates';

import WaybillFormWrap from 'components/waybill/WaybillFormWrap';

import {
  PropsWaybillDraftInfo,
  StateWaybillDraftInfo,
} from 'components/dashboard/menu/cards/waybill-draft/info/WaybillDraftInfo.h';
import {
  WaybillDraftItemsSubItemsType,
} from 'components/dashboard/redux-main/modules/dashboard/@types/waibill-draft.h';
import {
  TitleWaybillInfoContainer,
} from 'components/dashboard/menu/cards/_default-card-component/hoc/with-default-waybill/styled/styled';
import { getDashboardState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';

class WaybillDraftInfo extends React.Component<PropsWaybillDraftInfo, StateWaybillDraftInfo> {
  state = {
    showWaybillFormWrap: false,
    elementWaybillFormWrap: null,
    infoData: this.props.infoData,
    infoDataGroupByDate: groupBy<WaybillDraftItemsSubItemsType>(
      this.props.infoData.subItems,
      (waybill) => (
        makeDate(waybill.data.waybill_date_create)
      ),
    ),
  };

  static getDerivedStateFromProps({ infoData }: PropsWaybillDraftInfo, state: StateWaybillDraftInfo) {
    if (infoData !== state.infoData) {
      if (infoData) {
        return {
          infoData,
          infoDataGroupByDate: groupBy<WaybillDraftItemsSubItemsType>(
            infoData.subItems,
            (waybill) => (
              makeDate(waybill.data.waybill_date_create)
            ),
          ),
        };
      } else {
        return {
          infoData,
          infoDataGroupByDate: {},
        };
      }
    }

    return null;
  }

  handleClose: React.MouseEventHandler<HTMLDivElement> = () => {
    this.props.handleClose();
  }

  openWaybillFormWrap: React.MouseEventHandler<HTMLLIElement> = ({ currentTarget: { dataset: { path } } }) => {
    this.props.getWaybillById(Number.parseInt(path, 0))
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
  }

  handleWaybillFormWrapHide = () => {
    this.setState({
      showWaybillFormWrap: false,
      elementWaybillFormWrap: null,
    });
  }

  handleWaybillFormWrapHideAfterSubmit = () => {
    this.props.loadAllWaybillCard();
    this.setState({
      showWaybillFormWrap: false,
      elementWaybillFormWrap: null,
    });
  }

  render() {
    return (
      <InfoCard title="Рег. номер ТС" handleClose={this.handleClose}>
        {
          Object.entries(this.state.infoDataGroupByDate).sort().map(([key, arrData]) => (
            <div key={key}>
              <TitleWaybillInfoContainer>{key}</TitleWaybillInfoContainer>
              <div>
                <ul>
                  {
                    arrData.map(({ data: { waybill_id }, title }, index) => (
                      <li key={waybill_id} className="pointer" data-path={waybill_id} onClick={this.openWaybillFormWrap}>{title}</li>
                    ))
                  }
                </ul>
              </div>
            </div>
          ))
        }
        <WaybillFormWrap
          onFormHide={this.handleWaybillFormWrapHideAfterSubmit}
          onCallback={this.handleWaybillFormWrapHideAfterSubmit}
          showForm={this.state.showWaybillFormWrap}
          element={this.state.elementWaybillFormWrap}
          fromDashboard
        />
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
      handleClose: () => (
        dispatch(
          dashboardSetInfoDataInWaybillDraft(null),
        )
      ),
      loadAllWaybillCard: () => (
        dispatch(
          dashboardLoadDependentDataByWaybillDraft(),
        )
      ),
      getWaybillById: (id) => (
        dispatch(
          loadWaybillById(
            'none',
            id,
            {
              promise: true,
              page: 'dashboard',
            },
          ),
        )
      ),
    }),
  ),
)(WaybillDraftInfo);
