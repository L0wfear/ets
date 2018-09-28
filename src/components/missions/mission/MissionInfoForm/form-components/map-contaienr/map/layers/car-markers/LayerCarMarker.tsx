import * as React from 'react';
import * as ol from 'openlayers';

import withLayerProps from 'components/map/new/layers/base-hoc/layer/LayerProps';
import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { getStyleForStatusDirectionType} from 'components/missions/mission/MissionInfoForm/form-components/map-contaienr/map/layers/car-markers/feature-style';
import { connect } from 'react-redux';
import * as Raven from 'raven-js';
import config from 'config';
import * as ReconnectingWebSocket from 'vendor/ReconnectingWebsocket';

import {
  PropsLayerCarMarker,
  StateLayerCarMarker,
  WsData,
} from 'components/missions/mission/MissionInfoForm/form-components/map-contaienr/map/layers/car-markers/LayerCarMarker.h';

let updatePoints = true;

global.toggleUpdateCarPoints = () => updatePoints = !updatePoints;

class LayerCarMarker extends React.Component<PropsLayerCarMarker, StateLayerCarMarker> {
  state = {
    ws: null,
    carPointsDataWs: {},
  }
  componentDidMount() {
    this.props.addLayer({ id: 'CarMarker', zIndex: 10 }).then(() => {
      this.props.setDataInLayer('singleclick', undefined);
    });
    this.openWs();
  }

  componentWillUnmount() {
    this.props.removeLayer();
    this.closeWs();
  }

  openWs() {
    const token = this.props.token;
    const wsUrl = `${config.ws}?token=${token}`;
    const ws = new ReconnectingWebSocket(wsUrl, null);

    ws.onmessage = ({ data }) => {
      this.handleReveiveData(JSON.parse(data));
    };

    ws.onclose = (event) => {
      if (event.code === 1006) {
        Raven.captureException(new Error('1006: A connection was closed abnormally (that is, with no close frame being sent). A low level WebSocket error.'));
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

  handleReveiveData(data: WsData) {
    const { gov_number } = this.props;
    const { carPointsDataWs } = this.state;

    Object.entries(data).forEach(([gps_code, { coords, coords_msk, ...data }]) => {
      let point = {
        coords_msk: [...coords_msk].reverse() as ol.Coordinate,
        coords: [...coords].reverse() as ol.Coordinate,
        ...data,
      };

      if (!carPointsDataWs[gps_code]) {
        if (point.car && point.car.gov_number === gov_number) {
          carPointsDataWs[gps_code] = point;

          const feature = new ol.Feature({
            geometry: new ol.geom.Point(point.coords_msk),
          });
    
          const style = getStyleForStatusDirectionType({
            status: point.status,
            direction: point.direction,
            selected: true,
            zoomMore8: true,
            show_gov_number: false,
            gov_number: '',
            visible: true,
          });

          feature.setId(point.id);
          feature.setStyle(style);

          this.props.addFeaturesToSource(feature);
        }
      } else if (carPointsDataWs[gps_code].timestamp < point.timestamp) {
        if (carPointsDataWs[gps_code].car.gov_number === gov_number) {
          carPointsDataWs[gps_code] = {
            ...carPointsDataWs[gps_code],
            ...point,
          };

          const feature = this.props.getFeatureById(gps_code);

          feature.setGeometry(new ol.geom.Point(carPointsDataWs[gps_code].coords_msk));

          const style = getStyleForStatusDirectionType({
            status: carPointsDataWs[gps_code].status,
            direction: carPointsDataWs[gps_code].direction,
            selected: true,
            zoomMore8: true,
            show_gov_number: false,
            gov_number: '',
            visible: true,
          });

          feature.setStyle(style);
        }
      }
    });


    this.setState({ carPointsDataWs });
  }

  render() {
    return <div></div>
  }
}

const mapStateToProps = state => ({
  token: state.session.token,
});

export default hocAll(
  connect(
    mapStateToProps,
  ),
  withLayerProps(),
)(LayerCarMarker);
