import * as React from 'react';

import { compose } from 'recompose';
import triggerOnChangeCompany from 'components/compositions/vokinda-hoc/trigger-on-change-company/triggerOnChangeCompany';
import { connect } from 'react-redux';

import { GEOOBJECTS_OBJ } from 'constants/geoobjects-new';

import MapWrap from 'components/monitor/MapWrap';
import ToolBar from 'components/monitor/tool-bar/ToolBar';

import { loadCarActualIndex } from 'redux-main/trash-actions/car';
import { loadGeozones } from 'redux-main/trash-actions/geometry/geometry';
import { getCompany } from 'redux-main/trash-actions/uniq';
import { resetMonitorPageState } from 'components/monitor/redux-main/models/actions-monitor-page';
import {
  MONITOR_PAGE_SET_CAR_ACTUAL_INDEX,
  MONITOR_PAGE_SET_GEOMETRY,
  MONITOR_PAGE_SET_COMPANY,
} from 'components/monitor/redux-main/models/monitor-page';
import { MonitorPageContainer } from 'components/monitor/styled';

type PropsMonitorPage = {
  token: string;
  loadCarActualIndex: any;
  loadGeozonesOdhMkad: any;
  getCompany: any;
  resetMonitorPageState: any;
};

type StateMonitorPage = {

};

class MonitorPage extends React.Component<PropsMonitorPage, StateMonitorPage> {
  componentDidMount() {
    this.props.loadCarActualIndex();
    this.props.loadGeozonesOdhMkad();
    this.props.getCompany();
  }

  componentWillUnmount() {
    this.props.resetMonitorPageState();
  }

  render() {
    const { props } = this;

    return (
      props.token ?
        <MonitorPageContainer>
          <MapWrap />
          <ToolBar />
        </MonitorPageContainer>
      :
        <div>загрузка...</div>
    );
  }
}

const mapStateToProps = (state) => ({
  token: state.session.token,
});
const mapDispatchToProps = (dispatch) => ({
  loadCarActualIndex: () => (
    dispatch(
      loadCarActualIndex(MONITOR_PAGE_SET_CAR_ACTUAL_INDEX),
    )
  ),
  loadGeozonesOdhMkad: () => (
    dispatch(
      loadGeozones(MONITOR_PAGE_SET_GEOMETRY, GEOOBJECTS_OBJ.odh_mkad.serverName),
    )
  ),
  getCompany: () => (
    dispatch(
      getCompany(MONITOR_PAGE_SET_COMPANY),
    )
  ),
  resetMonitorPageState: () => (
    dispatch(
      resetMonitorPageState(),
    )
  ),
});

export default compose(
  triggerOnChangeCompany,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(MonitorPage);
