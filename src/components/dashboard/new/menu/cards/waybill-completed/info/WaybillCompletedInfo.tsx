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
import {
  getWaybillById,
} from 'redux/waybill/promise';

import WaybillFormWrap from 'components/waybill/WaybillFormWrap';

type PropsWaybillCompletedInfo = {
  infoData: any;
  infoDataRaw: any;

  handleClose: Function;
  loadAllWaybillCard: Function;
  setInfoData: (infoData: any) => any;
};

type StateWaybillCompletedInfo = {
  showWaybillFormWrap: boolean;
  elementWaybillFormWrap: any;
  infoDataGroupByDate: any;
  infoData: any;
  infoDataRaw: any;
}

class WaybillCompletedInfo extends React.Component<PropsWaybillCompletedInfo, StateWaybillCompletedInfo> {
  state = {
    showWaybillFormWrap: false,
    elementWaybillFormWrap: null,
    infoData: this.props.infoData,
    infoDataGroupByDate: groupBy(this.props.infoData, waybill => makeDate((waybill as any).data.create_date)),
    infoDataRaw: this.props.infoDataRaw,
  }

  componentWillReceiveProps({ infoData, infoDataRaw }) {
    if (infoData !== this.state.infoData) {
      this.setState({
        infoData,
        infoDataGroupByDate: groupBy(infoData, waybill => makeDate((waybill as any).data.create_date)),
      });
    }

    if (infoDataRaw !== this.state.infoDataRaw) {
      if (infoDataRaw.subItems) {
        this.props.setInfoData(infoDataRaw.subItems);
      } else {
        this.props.handleClose();
      }
      this.setState({
        infoDataRaw,
      });
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
                    arrData.map(({ data: { waybill_id }, data, title }, index) => (
                      <li key={waybill_id} className="pointer" data-path={waybill_id} onClick={this.openWaybillFormWrap}>
                        {
                          title
                          || `№${data.waybill_number}, `}<b>{data.car_gov_number}</b>, {data.car_garage_number || '-'}<br />{`${data.driver_fio || ''}${data.driver_phone ? `, ${data.driver_phone}` : ''}`
                        }
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
  infoData: state.dashboard.waybill_completed.infoData,
  infoDataRaw: state.dashboard.waybill_completed.data.items[0],
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
  setInfoData: (infoData) => (
    dispatch(
      dashboardSetInfoDataInWaybillCompleted(infoData)
    )
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