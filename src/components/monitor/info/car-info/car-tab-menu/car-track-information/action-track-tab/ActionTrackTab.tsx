import * as React from 'react';
import * as Button from 'react-bootstrap/lib/Button';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { makeDateFromUnix } from 'utils/dates';
import { carInfoTogglePlay, carInfoStopPlay, carInfoIncTrackPointIndex } from 'components/monitor/info/car-info/redux-main/modules/actions-car-info';

import { connect } from 'react-redux';

type PropsActionTrackTab = {
  gps_code: number;
  track: any;
  status: string;
  trackPointIndex: number;
  STATUS_TC_FOLLOW_ON_CAR: boolean;

  togglePlay: any;
  stopPlay: any;
  carInfoIncTrackPointIndex: Function;
};

type StateActionTrackTab = {
  intervalId: any
}

class ActionTrackTab extends React.Component<PropsActionTrackTab, StateActionTrackTab> {
  state = {
    intervalId: null,
  }

  componentDidUpdate(prevProps, prevState) {
    const { gps_code } = this.props;

    if (gps_code !== prevProps.gps_code) {
      clearInterval(prevState.intervalId)
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  togglePlayTrack = () => {
    const { status } = this.props;
    this.props.togglePlay();

    if (status !== 'play') {
      const intervalId = setInterval(this.movePlayPoint, 500);
      this.setState({ intervalId });
    } else {
      clearInterval(this.state.intervalId);
    }
  }

  stopPlayTrack = () => {
    clearInterval(this.state.intervalId);
    this.props.stopPlay();
  }

  movePlayPoint = () => {

    const { trackPointIndex } = this.props;

    if (this.props.track.length - 1 !== trackPointIndex) {
      this.props.carInfoIncTrackPointIndex();
    } else {
      this.props.stopPlay();
      clearInterval(this.state.intervalId);
    }
  }
  render() {
    const { status, track, trackPointIndex, STATUS_TC_FOLLOW_ON_CAR } = this.props;

    return (
      <div className="car_info_block column tab-data">
        <div className="car_info-track_date_title">
          <div>Проигрывание трека</div>
        </div>
        <div className="car_info-track_player">
          <Button disabled={STATUS_TC_FOLLOW_ON_CAR || track === -1 || Array.isArray(track) && track.length <= 1} onClick={this.togglePlayTrack} ><Glyphicon glyph={status !== 'play' ? 'play' : 'pause'} /></Button>
          <Button disabled={STATUS_TC_FOLLOW_ON_CAR || status === 'stop'} onClick={this.stopPlayTrack} ><Glyphicon glyph="stop" /></Button>
        </div>
        {
          status !== 'stop' ?
          (
            <div>
              <dl className="car-info-play-info">
              <dt>Координаты:</dt>
              <dd>{Number.parseFloat(track[trackPointIndex].coords_msk[1]).toFixed(5)}, {Number.parseFloat(track[trackPointIndex].coords_msk[0]).toFixed(5)}</dd>
              <dt>Время:</dt>
              <dd>{makeDateFromUnix(track[trackPointIndex].timestamp)}</dd>
              <dt>Скорость:</dt>
              <dd>{track[trackPointIndex].speed_avg}</dd>
          </dl>
            </div>
          )
          :
          ( <div className="none" />)
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  gps_code: state.monitorPage.carInfo.gps_code,
  track: state.monitorPage.carInfo.trackCaching.track,
  status: state.monitorPage.carInfo.playTrack.status,
  trackPointIndex: state.monitorPage.carInfo.playTrack.trackPointIndex,
  STATUS_TC_FOLLOW_ON_CAR: state.monitorPage.carInfo.statusTC.FOLLOW_ON_CAR,
});

const mapDispatchToProps = dispatch => ({
  togglePlay: () => dispatch(carInfoTogglePlay()),
  stopPlay: () => dispatch(carInfoStopPlay()),
  carInfoIncTrackPointIndex: () => dispatch(
    carInfoIncTrackPointIndex(),
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActionTrackTab);
