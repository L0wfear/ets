import * as React from 'react';

import { connect } from 'react-redux';
import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { groupBy } from 'lodash';

import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';

import InfoCard from 'components/dashboard/new/menu/cards/_default-card-component/info-card/InfoCard';

import {
  dashboardLoadDependentDataByWaybillInProgress,
  dashboardSetInfoDataInWaybillInProgress,
} from 'components/dashboard/new/redux/modules/dashboard/actions-dashboard';

import { makeDate } from 'utils/dates';
import {
  getWaybillById,
} from 'redux/waybill/promise';

import WaybillFormWrap from 'components/waybill/WaybillFormWrap';

import {
  PropsWaybillInProgressInfo,
  StateWaybillInProgressInfo,
} from 'components/dashboard/new/menu/cards/waybill-in-progress/info/WaybillInProgressInfo.h';

class WaybillInProgressInfo extends React.Component<PropsWaybillInProgressInfo, StateWaybillInProgressInfo> {
  state = {
    showWaybillFormWrap: false,
    elementWaybillFormWrap: null,
    infoData: this.props.infoData,
    infoDataGroupByDate: groupBy(
      this.props.infoData.subItems,
      (waybill) => (
        makeDate(waybill.data.create_date)
      ),
    ),
  }

  componentWillReceiveProps({ infoData }: PropsWaybillInProgressInfo) {
    if (infoData !== this.state.infoData) {
      if (infoData) {
        this.setState({
          infoData,
          infoDataGroupByDate: groupBy(infoData.subItems, waybill => makeDate(waybill.data.create_date)),
        });
      } else {
        this.setState({
          infoData,
          infoDataGroupByDate: {},
        });
      }
    }
  }

  handleClose: React.MouseEventHandler<HTMLDivElement> = () => {
    this.props.handleClose();
  }

  openWaybillFormWrap: React.MouseEventHandler<HTMLLIElement> = ({ currentTarget: { dataset: { path } } }) => {
    const waybill_id = Number.parseInt(path);
    getWaybillById(waybill_id)
      .then(({ waybill_data }) => {
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
    this.props.loadAllWaybillCard();
    this.setState({
      showWaybillFormWrap: false,
      elementWaybillFormWrap: null,
    });
  };


  render() {
    return (
      <InfoCard title="Информация о ПЛ" handleClose={this.handleClose}>
        {
          Object.entries(this.state.infoDataGroupByDate).sort().map(([key, arrData]) => (
            <div key={key}>
              <div className="title_waybill_info">{key}</div>
              <div>
                <ul>
                  {
                    arrData.map(({ data: { waybill_id }, data }, index) => (
                      <li key={waybill_id} className="pointer" data-path={waybill_id} onClick={this.openWaybillFormWrap}>
                        {`№${data.waybill_number}, `}<b>{data.car_gov_number}</b>, {data.car_garage_number || '-'}
                        <br />
                        {`${data.driver_fio || ''}${data.driver_phone ? `, ${data.driver_phone}` : ''}`}
                      </li>
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

const mapStateToProps = (state) => ({
  infoData: state.dashboard.waybill_in_progress.infoData,
  infoDataRaw: state.dashboard.waybill_in_progress.data.items[0],
});

const mapDispatchToProps = (dispatch) => ({
  handleClose: () => (
    dispatch(
      dashboardSetInfoDataInWaybillInProgress(null),
    )
  ),
  loadAllWaybillCard: () => (
    dispatch(
      dashboardLoadDependentDataByWaybillInProgress(),
    )
  ),
  setInfoData: (infoData) => (
    dispatch(
      dashboardSetInfoDataInWaybillInProgress(infoData)
    )
  ),
});

export default hocAll(
  withShowByProps({
    path: ['dashboard', 'waybill_in_progress', 'infoData'],
    type: 'none',
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(WaybillInProgressInfo);