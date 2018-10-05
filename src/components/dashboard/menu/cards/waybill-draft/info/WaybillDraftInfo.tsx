import * as React from 'react';

import { connect } from 'react-redux';
import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { groupBy } from 'lodash';

import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';

import InfoCard from 'components/dashboard/menu/cards/_default-card-component/info-card/InfoCard';

import {
  dashboardLoadDependentDataByWaybillDraft,
  dashboardSetInfoDataInWaybillDraft,
} from 'components/dashboard/redux/modules/dashboard/actions-dashboard';
import { loadWaybillById } from 'redux/trash-actions/waybill/waybill';

import { makeDate } from 'utils/dates';

import WaybillFormWrap from 'components/waybill/WaybillFormWrap';

import {
  PropsWaybillDraftInfo,
  StateWaybillDraftInfo,
} from 'components/dashboard/menu/cards/waybill-draft/info/WaybillDraftInfo.h';

class WaybillDraftInfo extends React.Component<PropsWaybillDraftInfo, StateWaybillDraftInfo> {
  state = {
    showWaybillFormWrap: false,
    elementWaybillFormWrap: null,
    infoData: this.props.infoData,
    infoDataGroupByDate: groupBy(
      this.props.infoData.subItems,
      (waybill) => (
        makeDate(waybill.data.waybill_date_create)
      ),
    ),
  }

  componentWillReceiveProps({ infoData }: PropsWaybillDraftInfo) {
    if (infoData !== this.state.infoData) {
      if (infoData) {
        this.setState({
          infoData,
          infoDataGroupByDate: groupBy(
            infoData.subItems,
            (waybill) => (
              makeDate(waybill.data.waybill_date_create)
            ),
          ),
        });
      } else {
        this.setState({
          infoData,
          infoDataGroupByDate: {},
        })
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
  };


  render() {
    return (
      <InfoCard title="Рег. номер ТС" handleClose={this.handleClose}>
        {
          Object.entries(this.state.infoDataGroupByDate).sort().map(([key, arrData]) => (
            <div key={key}>
              <div className="title_waybill_info">{key}</div>
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

const mapStateToProps = (state) => ({
  infoData: state.dashboard.waybill_draft.infoData,
  infoDataRaw: state.dashboard.waybill_draft.data.items[0],
});

const mapDispatchToProps = (dispatch) => ({
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
    path: ['dashboard', 'waybill_draft', 'infoData'],
    type: 'none',
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(WaybillDraftInfo);