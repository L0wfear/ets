import * as React from 'react';

import { connect } from 'react-redux';
import hocAll from 'components/compositions/vokinda-hoc/recompose';

import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';

import InfoCard from 'components/dashboard/menu/cards/_default-card-component/info-card/InfoCard';

import { dashboardSetInfoDataInWaybillClosed } from 'components/dashboard/redux-main/modules/dashboard/actions-dashboard';
import { loadWaybillById } from 'redux-main/trash-actions/waybill/waybill';

import WaybillFormWrap from 'components/waybill/WaybillFormWrap';

import {
  PropsWaybillClosedInfo,
  StateWaybillClosedInfo,
} from 'components/dashboard/menu/cards/waybill-closed/info/WaybillClosedInfo.h';

class WaybillClosedInfo extends React.Component<PropsWaybillClosedInfo, StateWaybillClosedInfo> {
  state = {
    showWaybillFormWrap: false,
    elementWaybillFormWrap: null,
  }

  handleClose: React.MouseEventHandler<HTMLDivElement> = () => {
    this.props.handleClose();
  }

  openWaybillFormWrap: React.MouseEventHandler<HTMLLIElement> = ({ currentTarget: { dataset: { path } } }) => {
    this.props.getWaybillById(Number.parseInt(path))
      .then(({ payload: { waybill_data } }) => {
        if (waybill_data) {
          this.setState({
            showWaybillFormWrap: true,
            elementWaybillFormWrap: waybill_data,
          });
        } else {
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
    this.setState({
      showWaybillFormWrap: false,
      elementWaybillFormWrap: null,
    });
  };


  render() {
    return (
      <InfoCard title="Информация о ПЛ" handleClose={this.handleClose}>
        <ul>
        {
          this.props.infoData.subItems.map(({ data: { waybill_id, ...data } }) => (
            <li key={waybill_id} className="pointer" data-path={waybill_id} onClick={this.openWaybillFormWrap}>
              {`№${data.waybill_number}, `}<b>{data.car_gov_number}</b>
              <br />
              {`${data.car_garage_number || '-'}, ${data.driver_fio || '-'}`}
            </li>
            ))
          }
        </ul>
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

const mapStateToProps = (state) => ({
  infoData: state.dashboard.waybill_closed.infoData,
  infoDataRaw: state.dashboard.waybill_closed.data.items[0],
});

const mapDispatchToProps = (dispatch) => ({
  handleClose: () => (
    dispatch(
      dashboardSetInfoDataInWaybillClosed(null),
    )
  ),
  setInfoData: (infoData) => (
    dispatch(
      dashboardSetInfoDataInWaybillClosed(infoData)
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
});

export default hocAll(
  withShowByProps({
    path: ['dashboard', 'waybill_closed', 'infoData'],
    type: 'none',
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(WaybillClosedInfo);