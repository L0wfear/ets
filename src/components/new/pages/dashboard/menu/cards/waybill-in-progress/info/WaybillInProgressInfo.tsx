import * as React from 'react';
import memoize from 'memoize-one';

import { connect } from 'react-redux';
import { compose } from 'recompose';
import { groupBy } from 'lodash';

import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';

import InfoCard from 'components/new/pages/dashboard/menu/cards/_default-card-component/info-card/InfoCard';

import {
  dashboardLoadDependentDataByWaybillInProgress,
  dashboardSetInfoDataInWaybillInProgress,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';
import { loadWaybillById } from 'redux-main/trash-actions/waybill/waybill';

import { makeDate } from 'utils/dates';

import WaybillFormWrapTSX from 'components/waybill/WaybillFormWrap';

import {
  PropsWaybillInProgressInfo,
  StateWaybillInProgressInfo,
} from 'components/new/pages/dashboard/menu/cards/waybill-in-progress/info/WaybillInProgressInfo.h';
import { WaybillInProgressItemsSubItemsType } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/waibill-in-progress.h';
import { TitleWaybillInfoContainer } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-default-waybill/styled/styled';
import { getDashboardState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';

const WaybillFormWrap: any = WaybillFormWrapTSX;

class WaybillInProgressInfo extends React.PureComponent<PropsWaybillInProgressInfo, StateWaybillInProgressInfo> {
  state = {
    showWaybillFormWrap: false,
    elementWaybillFormWrap: null,
  };

  filterInfoData = memoize((infoData) => {
    if (infoData) {
      return groupBy<WaybillInProgressItemsSubItemsType>(
        infoData.subItems,
        (waybill) => makeDate(waybill.data.create_date),
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

  mapArrData = ({ data: { waybill_id, ...data } }) => (
    <li
      key={waybill_id}
      className="pointer"
      data-path={waybill_id}
      onClick={this.openWaybillFormWrap}>
      {`№${data.waybill_number}, `}
      <b>{data.car_gov_number}</b>, {data.car_garage_number || '-'}
      <br />
      {`${data.driver_fio || ''}${
        data.driver_phone ? `, ${data.driver_phone}` : ''
      }`}
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
      <InfoCard title="Информация о ПЛ" handleClose={this.handleClose}>
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
    path: ['dashboard', 'waybill_in_progress', 'infoData'],
    type: 'none',
  }),
  connect<any, any, any, ReduxState>(
    (state) => ({
      infoData: getDashboardState(state).waybill_in_progress.infoData,
      infoDataRaw: getDashboardState(state).waybill_in_progress.data.items[0],
    }),
    (dispatch) => ({
      handleClose: () =>
        dispatch(dashboardSetInfoDataInWaybillInProgress(null)),
      loadAllWaybillCard: () =>
        dispatch(dashboardLoadDependentDataByWaybillInProgress()),
      setInfoData: (infoData) =>
        dispatch(dashboardSetInfoDataInWaybillInProgress(infoData)),
      getWaybillById: (id) =>
        dispatch(
          loadWaybillById('none', id, {
            promise: true,
            page: 'dashboard',
          }),
        ),
    }),
  ),
)(WaybillInProgressInfo);
