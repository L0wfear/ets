import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { get } from 'lodash';
import { makeDateFromUnix } from 'components/@next/@utils/dates/dates';
import {
  carInfoTogglePlay,
  carInfoStopPlay,
  carInfoIncTrackPointIndex,
} from 'components/old/monitor/info/car-info/redux-main/modules/actions-car-info';

import { connect } from 'react-redux';
import { CarInfoBlockTabDataColumn } from 'components/old/monitor/styled';
import { CarInfoTrackDateTitle } from 'components/old/monitor/info/geoobjects-info/styled';
import styled from 'styled-components';

type PropsActionTrackTab = {
  gps_code: number;
  track: any;
  status: string;
  trackPointIndex: number;
  STATUS_TC_FOLLOW_ON_CAR: boolean;

  togglePlay: any;
  stopPlay: any;
  carInfoIncTrackPointIndex: any;
};

type StateActionTrackTab = {
  intervalId: any;
  interval: number;
  defaultInterval: number;
  coeffIndex: number;
  coeffsArr: Array<number>;
};

const PlayIncreaseCoeff = styled.div`
  display: inline-flex;
  justify-content: center;
  border: 1px solid #d7d7d7;
  border-radius: 4px;
  width: 50px;
  align-items: baseline;
  padding: 5px;
  font-weight: 500;
`;

class ActionTrackTab extends React.Component<
  PropsActionTrackTab,
  StateActionTrackTab
> {
  state = {
    intervalId: null,
    interval: null,
    defaultInterval: 1500,
    coeffIndex: 0,
    coeffsArr: [1, 2, 4, 6, 8, 10],
  };

  componentDidUpdate(prevProps, prevState) {
    const { gps_code } = this.props;

    if (gps_code !== prevProps.gps_code) {
      clearInterval(prevState.intervalId);
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  togglePlayTrack = () => {
    const { status } = this.props;

    this.props.togglePlay();

    if (status !== 'play') {
      const intervalId = setInterval(this.movePlayPoint, this.state.interval || this.state.defaultInterval);
      this.setState({ intervalId });
    } else {
      this.setState((state) => {
        clearInterval(state.intervalId);
      });
    }
  };

  stopPlayTrack = () => {
    clearInterval(this.state.intervalId);
    this.props.stopPlay();
    this.setState({
      coeffIndex: 0,
      interval: this.state.defaultInterval,
    });
  };

  increasePlaySpeed = () => {
    const defaultInterval = this.state.defaultInterval;
    const coeffsArr = this.state.coeffsArr;
    const { status } = this.props;

    if(this.state.coeffIndex < coeffsArr.length - 1) {
      this.setState((state) => {
        clearInterval(state.intervalId);
        const interval = defaultInterval / coeffsArr[state.coeffIndex + 1];
        let intervalId = null;

        if (status === 'play') {
          clearInterval(state.intervalId);
          intervalId = setInterval(this.movePlayPoint, interval);
        }

        return {
          coeffIndex: state.coeffIndex + 1, 
          interval,
          intervalId
        };
      });
    }
  };

  decreasePlaySpeed = () => {
    const defaultInterval = this.state.defaultInterval;
    const coeffsArr = this.state.coeffsArr;
    const { status } = this.props;
    
    if(this.state.coeffIndex > 0) {
      this.setState((state) => {
        const interval = defaultInterval / coeffsArr[state.coeffIndex - 1];
        let intervalId = null;

        if (status === 'play') {
          clearInterval(state.intervalId);
          intervalId = setInterval(this.movePlayPoint, interval);
        }

        return {
          coeffIndex: state.coeffIndex - 1, 
          interval,
          intervalId
        };
      });
    }
  };

  movePlayPoint = () => {
    const { trackPointIndex } = this.props;

    if (this.props.track.length - 1 !== trackPointIndex) {
      this.props.carInfoIncTrackPointIndex();
    } else {
      this.props.stopPlay();
      clearInterval(this.state.intervalId);
    }
  };
  render() {
    const {
      status,
      track,
      trackPointIndex,
      STATUS_TC_FOLLOW_ON_CAR,
    } = this.props;

    return (
      <CarInfoBlockTabDataColumn>
        <CarInfoTrackDateTitle>
          <div>Проигрывание трека</div>
        </CarInfoTrackDateTitle>
        <div className="car_info-track_player">
          <EtsBootstrap.Button
            disabled={
              STATUS_TC_FOLLOW_ON_CAR
              || track === -1
              || (Array.isArray(track) && track.length <= 1)
            }
            onClick={this.togglePlayTrack}>
            <EtsBootstrap.Glyphicon glyph={status !== 'play' ? 'play' : 'pause'} />
          </EtsBootstrap.Button>
          <EtsBootstrap.Button
            disabled={ status === 'stop' || this.state.coeffIndex <= 0}
            onClick={this.decreasePlaySpeed}>
            <EtsBootstrap.Glyphicon glyph="backward" />
          </EtsBootstrap.Button>
          <EtsBootstrap.Button
            disabled={status === 'stop' || this.state.coeffIndex >= this.state.coeffsArr.length - 1 }
            onClick={this.increasePlaySpeed}>
            <EtsBootstrap.Glyphicon glyph="forward" />
          </EtsBootstrap.Button >
          <EtsBootstrap.Button
            disabled={STATUS_TC_FOLLOW_ON_CAR || status === 'stop'}
            onClick={this.stopPlayTrack}>
            <EtsBootstrap.Glyphicon glyph="stop" />
          </EtsBootstrap.Button>
          <PlayIncreaseCoeff>
            {`x${this.state.coeffsArr[this.state.coeffIndex].toFixed(1)}`}
          </PlayIncreaseCoeff>
        </div>
        {status !== 'stop' && (
          <div>
            <dl className="car-info-play-info">
              <dt>Координаты:</dt>
              <dd>
                {Number.parseFloat(
                  get(track, [trackPointIndex, 'coords_msk'], [0, 0])[1],
                ).toFixed(5)}
                ,{' '}
                {Number.parseFloat(
                  get(track, [trackPointIndex, 'coords_msk'], [0, 0])[0],
                ).toFixed(5)}
              </dd>
              <dt>Время:</dt>
              <dd>
                {makeDateFromUnix(
                  get(track, [trackPointIndex], { timestamp: 0 }).timestamp,
                )}
              </dd>
              <dt>Скорость:</dt>
              <dd>{track[trackPointIndex].speed_avg}</dd>
            </dl>
          </div>
        )}
      </CarInfoBlockTabDataColumn>
    );
  }
}

const mapStateToProps = (state) => ({
  gps_code: state.monitorPage.carInfo.gps_code,
  track: state.monitorPage.carInfo.trackCaching.track,
  status: state.monitorPage.carInfo.playTrack.status,
  trackPointIndex: state.monitorPage.carInfo.playTrack.trackPointIndex,
  STATUS_TC_FOLLOW_ON_CAR: state.monitorPage.carInfo.statusTC.FOLLOW_ON_CAR,
});

const mapDispatchToProps = (dispatch) => ({
  togglePlay: () => dispatch(carInfoTogglePlay()),
  stopPlay: () => dispatch(carInfoStopPlay()),
  carInfoIncTrackPointIndex: () => dispatch(carInfoIncTrackPointIndex()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActionTrackTab);
