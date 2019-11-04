import * as React from 'react';

import { connect } from 'react-redux';
import { compose } from 'recompose';

import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';

import InfoCard from 'components/new/pages/dashboard/menu/cards/_default-card-component/info-card/InfoCard';

import { dashboardSetInfoDataInWaybillClosed } from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';

import WaybillFormWrapTSX from 'components/old/waybill/WaybillFormWrap';

import {
  PropsWaybillClosedInfo,
  StateWaybillClosedInfo,
} from 'components/new/pages/dashboard/menu/cards/waybill-closed/info/WaybillClosedInfo.h';
import { getDashboardState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { actionGetWaybillById } from 'redux-main/reducers/modules/waybill/waybill_actions';

const WaybillFormWrap: any = WaybillFormWrapTSX;

class WaybillClosedInfo extends React.Component<PropsWaybillClosedInfo, StateWaybillClosedInfo> {
  state = {
    showWaybillFormWrap: false,
    elementWaybillFormWrap: null,
  };

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
    this.setState({
      showWaybillFormWrap: false,
      elementWaybillFormWrap: null,
      ...newState,
    });
  };

  render() {
    return (
      <InfoCard title="Информация о ПЛ" handleClose={this.handleClose}>
        <ul>
          {this.props.infoData.subItems.map(
            ({ data: { waybill_id, ...data } }) => (
              <li
                key={waybill_id}
                className="pointer"
                data-path={waybill_id}
                onClick={this.openWaybillFormWrap}>
                {`№${data.waybill_number}, `}
                <b>{data.car_gov_number}</b>
                <br />
                {`${data.car_garage_number || '-'}, ${data.driver_fio || '-'}`}
              </li>
            ),
          )}
        </ul>
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
    path: ['dashboard', 'waybill_closed', 'infoData'],
    type: 'none',
  }),
  connect<any, any, any, ReduxState>(
    (state) => ({
      infoData: getDashboardState(state).waybill_closed.infoData,
      infoDataRaw: getDashboardState(state).waybill_closed.data.items[0],
    }),
    (dispatch) => ({
      dispatch,
      handleClose: () => dispatch(dashboardSetInfoDataInWaybillClosed(null)),
      setInfoData: (infoData) => (
        dispatch(dashboardSetInfoDataInWaybillClosed(infoData))
      ),
    }),
  ),
)(WaybillClosedInfo);
