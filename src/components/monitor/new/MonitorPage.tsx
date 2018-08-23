import * as React from 'react';
import { connect } from 'react-redux';
import { GEOOBJECTS_OBJ } from 'constants/geoobjects-new';

import MapWrap from 'components/monitor/new/MapWrap';
import ToolBar from 'components/monitor/new/tool-bar/ToolBar';

import { loadCarActualIndex } from 'redux/trash-actions/car';
import { loadGeozones } from 'redux/trash-actions/geometry/geometry';

import { resetMonitorPageState } from 'components/monitor/new/redux/models/actions-monitor-page';
import {
  MONITOR_PAGE_SET_CAR_ACTUAL_INDEX,
  MONITOR_PAGE_SET_GEOMETRY,
} from 'components/monitor/new/redux/models/monitor-page';

type PropsMonitorPage = {
  token: string;
  loadCarActualIndex: Function;
  loadGeozonesOdhMkad: Function;
  resetMonitorPageState: Function;
};

type StateMonitorPage = {

};

class MonitorPage extends React.Component<PropsMonitorPage, StateMonitorPage> {
  componentDidMount() {
    this.props.loadCarActualIndex();
    this.props.loadGeozonesOdhMkad();
  }

  componentWillUnmount() {
    this.props.resetMonitorPageState();
  }

  render() {
    const { props } = this;

    return (
      props.token ?
        <div className="monitor-page">
          <MapWrap />
          <ToolBar />
        </div>
      :
        <div>загрузка...</div>
    );
  }
}

const mapStateToProps = state => ({
  token: state.session.token
});
const mapDispatchToProps = dispatch => ({
  loadCarActualIndex: () => (
    dispatch(
      loadCarActualIndex(MONITOR_PAGE_SET_CAR_ACTUAL_INDEX)
    )
  ),
  loadGeozonesOdhMkad: () => (
    dispatch(
      loadGeozones(MONITOR_PAGE_SET_GEOMETRY, GEOOBJECTS_OBJ.odh_mkad.serverName)
    )
  ),
  resetMonitorPageState: () => (
    dispatch(
      resetMonitorPageState(),
    )
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MonitorPage);
