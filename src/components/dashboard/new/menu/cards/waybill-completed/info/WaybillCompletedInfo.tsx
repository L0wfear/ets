import * as React from 'react';

import { connect } from 'react-redux';
import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { groupBy } from 'lodash';

import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';

import InfoCard from 'components/dashboard/new/menu/cards/_default-card-component/info-card/InfoCard';

import {
  dashboardLoadDependentDataByWaybillCompleted,
  dashboardSetInfoDataInWaybillCompleted,
} from 'components/dashboard/new/redux/modules/dashboard/actions-dashboard';

import { makeDate } from 'utils/dates';
import { loadWaybillById } from 'redux/trash-actions/waybill/waybill';

import WaybillFormWrap from 'components/waybill/WaybillFormWrap';

import {
  PropsWaybillCompletedInfo,
  StateWaybillCompletedInfo,
} from 'components/dashboard/new/menu/cards/waybill-completed/info/WaybillCompletedInfo.h';
import {
  WaybillCompletedItemsSubItemsType,
} from 'components/dashboard/new/redux/modules/dashboard/@types/waibill-completed.h';
import {
  TitleWaybillInfoContainer,
} from 'components/dashboard/new/menu/cards/_default-card-component/hoc/with-default-waybill/styled/styled';

class WaybillCompletedInfo extends React.Component<PropsWaybillCompletedInfo, StateWaybillCompletedInfo> {
  state = {
    showWaybillFormWrap: false,
    elementWaybillFormWrap: null,
    infoData: this.props.infoData,
    infoDataGroupByDate: groupBy<WaybillCompletedItemsSubItemsType>(
      this.props.infoData.subItems,
      (waybill) => (
        makeDate(waybill.data.create_date)
      ),
    ),
  }

  componentWillReceiveProps({ infoData }: PropsWaybillCompletedInfo) {
    if (infoData !== this.state.infoData) {
      if (infoData) {
        this.setState({
          infoData,
          infoDataGroupByDate: groupBy<WaybillCompletedItemsSubItemsType>(
            infoData.subItems,
            (waybill) => (
              makeDate(waybill.data.create_date)
            ),
          ),
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
    this.props.getWaybillById(Number.parseInt(path))
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
  }

  render() {
    return (
      <InfoCard title={this.state.infoData.subItemsTitle || 'Информация о ПЛ'} handleClose={this.handleClose}>
        {
          Object.entries(this.state.infoDataGroupByDate).sort().map(([key, arrData]) => (
            <div key={key}>
              <TitleWaybillInfoContainer>{key}</TitleWaybillInfoContainer>
              <div>
                <ul>
                  {
                    arrData.map(({ data: { waybill_id, ...data } }, index) => (
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
  activeIndex: state.dashboard.waybill_completed.activeIndex,
  infoData: state.dashboard.waybill_completed.infoData,
});

const mapDispatchToProps = (dispatch) => ({
  handleClose: () => (
    dispatch(
      dashboardSetInfoDataInWaybillCompleted(null),
    )
  ),
  loadAllWaybillCard: () => (
    dispatch(
      dashboardLoadDependentDataByWaybillCompleted(),
    )
  ),
  getWaybillById: (id) => (
    dispatch(
      loadWaybillById(
        '',
        id,
        {
          promise: true,
          page: 'dashboard',
        },
      ),
    ).payload
  ),
});

export default hocAll(
  withShowByProps({
    path: ['dashboard', 'waybill_completed', 'infoData'],
    type: 'none',
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(WaybillCompletedInfo);