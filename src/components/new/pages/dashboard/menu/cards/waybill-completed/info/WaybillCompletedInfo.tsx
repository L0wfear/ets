import * as React from 'react';
import memoize from 'memoize-one';

import { connect } from 'react-redux';
import { compose } from 'recompose';
import { groupBy } from 'lodash';

import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';

import InfoCard from 'components/new/pages/dashboard/menu/cards/_default-card-component/info-card/InfoCard';

import {
  dashboardLoadDependentDataByWaybillCompleted,
  dashboardSetInfoDataInWaybillCompleted,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';

import { makeDate } from 'components/@next/@utils/dates/dates';

import WaybillFormWrapTSX from 'components/old/waybill/WaybillFormWrap';

import {
  PropsWaybillCompletedInfo,
  StateWaybillCompletedInfo,
} from 'components/new/pages/dashboard/menu/cards/waybill-completed/info/WaybillCompletedInfo.h';
import { WaybillCompletedItemsSubItemsType } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/waibill-completed.h';
import { TitleWaybillInfoContainer } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-default-waybill/styled/styled';
import { getDashboardState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { actionGetWaybillById } from 'redux-main/reducers/modules/waybill/waybill_actions';

const WaybillFormWrap: any = WaybillFormWrapTSX;

class WaybillCompletedInfo extends React.PureComponent<PropsWaybillCompletedInfo, StateWaybillCompletedInfo> {
  state = {
    showWaybillFormWrap: false,
    elementWaybillFormWrap: null,
  };

  filterInfoData = memoize((infoData) => {
    if (infoData) {
      return groupBy<WaybillCompletedItemsSubItemsType>(
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
    this.props.dispatch(
      actionGetWaybillById(
        Number.parseInt(path, 0),
        { page: 'dashboard' },
      ),
    ).then((waybill_data) => {
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
    this.props.handleClose();
    this.setState({
      showWaybillFormWrap: false,
      elementWaybillFormWrap: null,
      ...newState,
    });
  };

  mapInfoDataGroupByDate = ({ data: { waybill_id, ...data } }) => (
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

  render() {
    const { infoData } = this.props;

    const infoDataGroupByDate = this.filterInfoData(infoData);

    return (
      <InfoCard
        title={infoData.subItemsTitle || 'Информация о ПЛ'}
        handleClose={this.handleClose}>
        {Object.entries(infoDataGroupByDate)
          .sort()
          .map(([key, arrData]: any) => (
            <div key={key}>
              <TitleWaybillInfoContainer>{key}</TitleWaybillInfoContainer>
              <div>
                <ul>{arrData.map(this.mapInfoDataGroupByDate)}</ul>
              </div>
            </div>
          ))
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
    path: ['dashboard', 'waybill_completed', 'infoData'],
    type: 'none',
  }),
  connect<any, any, any, ReduxState>(
    (state) => ({
      infoData: getDashboardState(state).waybill_completed.infoData,
    }),
    (dispatch) => ({
      dispatch,
      handleClose: () => dispatch(dashboardSetInfoDataInWaybillCompleted(null)),
      loadAllWaybillCard: () =>
        dispatch(dashboardLoadDependentDataByWaybillCompleted()),
    }),
  ),
)(WaybillCompletedInfo);
