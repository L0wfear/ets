import * as React from 'react';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { createValidDateTime } from 'components/@next/@utils/dates/dates';
import withLayerProps from 'components/new/ui/map/layers/base-hoc/layer/LayerProps';
import { compose } from 'recompose';
import { getStyleForStatusDirectionType } from 'components/new/ui/mission_info_form/form-components/map-contaienr/map/layers/car-markers/feature-style';
import { connect } from 'react-redux';
import * as Raven from 'raven-js';
import * as ReconnectingWebSocket from 'reconnectingwebsocket';

import {
  PropsLayerCarMarker,
  StateLayerCarMarker,
  WsData,
} from 'components/new/ui/mission_info_form/form-components/map-contaienr/map/layers/car-markers/LayerCarMarker.h';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors';
import { actionSetTracksCaching } from 'redux-main/reducers/modules/some_uniq/tracks_caching/actions';
import { checkOnMkad } from 'components/old/monitor/info/car-info/redux-main/modules/utils';
/**
 * Не использовать данные из сокета для фильтрации!!!
 */

let updatePoints = true;

global.toggleUpdateCarPoints = () => (updatePoints = !updatePoints);

class LayerCarMarker extends React.Component<
  PropsLayerCarMarker,
  StateLayerCarMarker
> {
  state = {
    ws: null,
    carPointsDataWs: {},
  };

  componentDidMount() {
    this.props.addLayer({ id: 'CarMarker', zIndex: 10 }).then(() => {
      this.props.setDataInLayer('singleclick', undefined);
    });
    this.openWs();
  }

  componentDidUpdate(prevProps: PropsLayerCarMarker) {
    const { 
      gps_code, 
      actionSetTracksCaching, 
      tracksCaching,
      odh_mkad, 
    } = this.props;
    const track = this.props.tracksCaching?.track;
    const lastPoint = this.state.carPointsDataWs[gps_code];
  
    if(
      track 
      && lastPoint 
      && lastPoint?.timestamp > track[track.length - 1]?.timestamp
      && createValidDateTime(lastPoint?.timestamp * 1000) <= createValidDateTime(this.props.mission_date_end)
    ) {
      const trackArrCopy = [...track];
      trackArrCopy.push({...lastPoint, speed_avg: lastPoint.speed_max, checkCoordsMsk: { onMkad: checkOnMkad(lastPoint, odh_mkad)},});
      actionSetTracksCaching({...tracksCaching, track: trackArrCopy});
      this.updateStyleForAllPoints();
    }
    if (gps_code !== prevProps.gps_code) {
      this.updateStyleForAllPoints();
    }
  }

  componentWillUnmount() {
    this.props.removeLayer();
    this.closeWs();
  }

  openWs() {
    const { points_ws } = this.props;

    let token = null;

    if (process.env.STAND === 'gost_stage' || process.env.STAND === 'ets_hotfix') {
      token = JSON.parse(
        localStorage.getItem(global.SESSION_KEY_ETS_TEST_BY_DEV),
      );
    } else {
      token = this.props.token;
    }

    const wsUrl = `${points_ws}?token=${token}`;

    const ws = new ReconnectingWebSocket(wsUrl, null);

    ws.onmessage = ({ data }) => {
      this.handleReveiveData(JSON.parse(data));
    };

    ws.onclose = (event) => {
      if (event.code === 1006) {
        Raven.captureException(
          new Error(
            '1006: A connection was closed abnormally (that is, with no close frame being sent). A low level WebSocket error.',
          ),
        );
      }
    };
    ws.onerror = () => {
      // console.error('WEBSOCKET - Ошибка WebSocket');
    };

    this.setState({ ws });
  }

  closeWs() {
    if (this.state.ws) {
      this.state.ws.close();
      this.setState({ ws: null });
    }
  }

  updateStyleForAllPoints() {
    const { gps_code: outerGpsCode } = this.props;
    const { carPointsDataWs } = this.state;

    Object.entries(carPointsDataWs).forEach(
      ([gps_code, { coords, coords_msk, ...data }]: any) => {
        const feature = this.props.getFeatureById(gps_code);

        const style = getStyleForStatusDirectionType({
          status: carPointsDataWs[gps_code].status,
          direction: carPointsDataWs[gps_code].direction,
          selected: gps_code === outerGpsCode,
          zoomMore8: true,
          minZoom: false,
          show_gov_number: false,
          gov_number: '',
          visible: gps_code === outerGpsCode,
        });

        feature.setStyle(style);
      },
    );
  }

  handleReveiveData(data: WsData) {
    const { gps_code: outerGpsCode } = this.props;
    const { carPointsDataWs } = this.state;

    Object.entries(data).forEach(
      ([gps_code, { coords, coords_msk, ...dataPoint }]) => {
        const point = {
          coords_msk: [...coords_msk].reverse(),
          coords: [...coords].reverse(),
          ...dataPoint,
        };

        if (!carPointsDataWs[gps_code]) {
          carPointsDataWs[gps_code] = point;

          const feature = new Feature({
            geometry: new Point(point.coords_msk),
          });

          const style = getStyleForStatusDirectionType({
            status: point.status,
            direction: point.direction,
            selected: gps_code === outerGpsCode,
            zoomMore8: true,
            minZoom: false,
            show_gov_number: false,
            gov_number: '',
            visible: gps_code === outerGpsCode,
          });

          feature.setId(point.id);
          feature.setStyle(style);

          this.props.addFeaturesToSource(feature);
        } else if (carPointsDataWs[gps_code].timestamp < point.timestamp) {
          carPointsDataWs[gps_code] = {
            ...carPointsDataWs[gps_code],
            ...point,
          };

          const feature = this.props.getFeatureById(gps_code);

          feature.setGeometry(new Point(carPointsDataWs[gps_code].coords_msk));

          const style = getStyleForStatusDirectionType({
            status: carPointsDataWs[gps_code].status,
            direction: carPointsDataWs[gps_code].direction,
            selected: gps_code === outerGpsCode,
            zoomMore8: true,
            minZoom: false,
            show_gov_number: false,
            gov_number: '',
            visible: gps_code === outerGpsCode,
          });

          feature.setStyle(style);
        }
      },
    );

    this.setState({ carPointsDataWs });
  }

  render() {
    return <div />;
  }
}

const mapStateToProps = (state: ReduxState) => ({
  points_ws: getSessionState(state).appConfig.points_ws,
  token: state.session.token,
  tracksCaching: state.some_uniq.tracksCaching,
  odh_mkad: state.monitorPage.geoobjects.odh_mkad.data,
});

export default compose<any, any>(
  connect(
    mapStateToProps,
    (dispatch: any) => ({
      actionSetTracksCaching: (tracksCaching) => (
        dispatch(actionSetTracksCaching(tracksCaching))
      ),
    })),
  withLayerProps(),
)(LayerCarMarker);
