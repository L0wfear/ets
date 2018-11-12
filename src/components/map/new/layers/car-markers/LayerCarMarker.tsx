/**
 * Не использовать данные из сокета для фильтрации!!!
 */

import * as React from 'react';
import withLayerProps from 'components/map/new/layers/base-hoc/layer/LayerProps';
import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { getStyleForStatusDirectionType} from 'components/map/new/layers/car-markers/feature-style';
import { connect } from 'react-redux';
import * as Raven from 'raven-js';
import config from 'config';
import * as ReconnectingWebSocket from 'vendor/ReconnectingWebsocket';
import { carInfoSetGpsNumber, carInfoSetStatus, carInfoPushPointIntoTrack } from 'components/monitor/new/info/car-info/redux/modules/actions-car-info';
import {
  CAR_INFO_SET_TRACK_CACHING,
} from 'components/monitor/new/info/car-info/redux/modules/car-info';
import { monitoPageChangeCarsByStatus, monitorPageResetCarStatus, monitorPageMergeFiltredCarGpsCode } from 'components/monitor/new/redux/models/actions-monitor-page';
import {
  getFrontStatus,
  checkOnVisible,
} from 'components/map/new/layers/car-markers/utils';

import {
  PropsLayerCarMarker,
  StateLayerCarMarker,
  WsData,
} from 'components/map/new/layers/car-markers/LayerCarMarker.h';

let updatePoints = true;
const MIN_ZOOM_VAL = 3;

global.toggleUpdateCarPoints = () => updatePoints = !updatePoints;

class LayerCarMarker extends React.Component<PropsLayerCarMarker, StateLayerCarMarker> {
  state = {
    ws: null,
    carPointsDataWs: {},
    gps_code: this.props.gps_code,
    zoomMore8: this.props.zoom >= 8,
    STATUS_SHOW_GOV_NUMBER: this.props.STATUS_SHOW_GOV_NUMBER,
    lastPoint: this.props.lastPoint,
    statusShow: this.props.statusShow,
    filters: this.props.filters,
    carActualGpsNumberIndex: this.props.carActualGpsNumberIndex,
  }
  componentDidMount() {
    this.props.addLayer({ id: 'CarMarker', zIndex: 10, renderMode: 'image' }).then(() => {
      this.props.setDataInLayer('singleclick', this.singleclick);
    });
    this.openWs();
  }

  componentWillReceiveProps(nextProps) {
    if (updatePoints) {
      const changeState: any = {};
      let whatPointChange = {};
      let hasWhatChage = false;
      const { gps_code: state_gps_code } = this.state;

      const { statusShow, gps_code, zoom, STATUS_SHOW_GOV_NUMBER, lastPoint, filters, carActualGpsNumberIndex } = nextProps;

      const zoomMore8 = zoom > 8;
      
      const minZoom = zoom <= MIN_ZOOM_VAL;
      const oldMinZoom = this.props.zoom <= MIN_ZOOM_VAL;

      if (carActualGpsNumberIndex !== this.state.carActualGpsNumberIndex) {
        hasWhatChage = true;
        whatPointChange = this.state.carPointsDataWs;
        changeState.carActualGpsNumberIndex = carActualGpsNumberIndex;
      }

      if (gps_code !== state_gps_code) {
        const { carPointsDataWs: { [gps_code]: carPointData } = {} } = this.state;
        if (carPointData) {
          this.props.carInfoSetStatus(carPointData.status);
        }
        hasWhatChage = true;
        whatPointChange = {
          [gps_code]: this.state.carPointsDataWs[gps_code],
        };
        if (state_gps_code) {
          whatPointChange[state_gps_code] = this.state.carPointsDataWs[state_gps_code];
        }
        changeState.gps_code = gps_code;

        if (gps_code) {
          const { coords_msk } = this.state.carPointsDataWs[gps_code];

          const extent: [number, number, number, number] = [
            coords_msk[0],
            coords_msk[1],
            coords_msk[0],
            coords_msk[1],
          ];

          const opt_options = { padding: [50, 550, 50, 150], duration: 500, maxZoom: zoom };
          const noCheckDisabledCenterOn = true;
          this.props.centerOn({ extent, opt_options }, noCheckDisabledCenterOn);
        }
        
      }
      if (zoomMore8 !== this.state.zoomMore8 || minZoom !== oldMinZoom) {
        hasWhatChage = true;
        whatPointChange = this.state.carPointsDataWs;
        changeState.zoomMore8 = zoomMore8;
      }

      if (STATUS_SHOW_GOV_NUMBER !== this.state.STATUS_SHOW_GOV_NUMBER) {
        hasWhatChage = true;
        whatPointChange = this.state.carPointsDataWs;
        changeState.STATUS_SHOW_GOV_NUMBER = STATUS_SHOW_GOV_NUMBER;
      }

      if (gps_code && lastPoint !== this.state.lastPoint && nextProps.forToday && Object.values(nextProps.odh_mkad).length) {
        if (lastPoint) {
          if (lastPoint.timestamp > this.state.carPointsDataWs[gps_code].timestamp) {
            changeState.carPointsDataWs = {
              ...this.state.carPointsDataWs,
              [gps_code]: {
                ...this.state.carPointsDataWs[gps_code],
                ...lastPoint,
              },
            };
          } else if (lastPoint.timestamp < this.state.carPointsDataWs[gps_code].timestamp) {
            this.props.carInfoPushPointIntoTrack(this.state.carPointsDataWs[gps_code], nextProps.odh_mkad);
          }
        } else {
          this.props.carInfoPushPointIntoTrack(this.state.carPointsDataWs[gps_code], nextProps.odh_mkad);
        }
        hasWhatChage = true;
        changeState.lastPoint = lastPoint;
      }

      if (nextProps.STATUS_TC_FOLLOW_ON_CAR) {
        const { coords_msk } = (changeState.carPointsDataWs || this.state.carPointsDataWs)[gps_code];

        const extent: [number, number, number, number] = [
          coords_msk[0],
          coords_msk[1],
          coords_msk[0],
          coords_msk[1],
        ];
        const noCheckDisabledCenterOn = true;
        this.props.centerOn({ extent }, noCheckDisabledCenterOn);
      }

      if (statusShow !== this.state.statusShow) {
        hasWhatChage = true;
        whatPointChange = this.state.carPointsDataWs;
        changeState.statusShow = statusShow;
      }

      if (filters !== this.state.filters) {
        hasWhatChage = true;
        whatPointChange = this.state.carPointsDataWs;
        changeState.filters = filters;
      }

      if (hasWhatChage) {
        this.changeStyle({ ...this.state, carPointsDataWs: whatPointChange, ...changeState, old_carPointsDataWs: this.state.carPointsDataWs, minZoom });

        this.setState(changeState);
      }
    }
  }

  componentWillUnmount() {
    this.props.removeLayer();
    this.props.monitorPageResetCarStatus();
    this.closeWs();
  }

  changeStyle({ carPointsDataWs, zoomMore8, gps_code: state_gps_code, statusShow, STATUS_SHOW_GOV_NUMBER, filters, carActualGpsNumberIndex, old_carPointsDataWs, minZoom }) {
    const carsByStatus = {
      in_move: 0,
      stop: 0,
      parking: 0,
      not_in_touch: 0,
    };
    const filtredCarGpsCode = {};
    let hasDiffInFiltredCarGpsCode = false;

    for (let gps_code in carPointsDataWs) {
      const data = carPointsDataWs[gps_code];
      const old_data = old_carPointsDataWs[gps_code];
      const feature = this.props.getFeatureById(gps_code);

      if (feature) {
        if (data.coords_msk !== old_data.coords_msk) {
          feature.setGeometry(new ol.geom.Point(data.coords_msk));
        }
        const selected = gps_code === state_gps_code;

        const visible = selected
        || checkOnVisible(
          {
            filters,
            wsData: carPointsDataWs[gps_code],
            statusShow,
            car_actualData: carActualGpsNumberIndex[gps_code],
          },
          gps_code,
        );
        const old_visible = feature.get('visible');
        const old_status = feature.get('status');

        feature.set('visible', visible);
        feature.set('status', carPointsDataWs[gps_code].front_status);

        if (visible) {
          if (old_visible) {
            carsByStatus[old_status] -= 1;
          } else {
            filtredCarGpsCode[gps_code] = true;
            hasDiffInFiltredCarGpsCode = true;
          }
          carsByStatus[carPointsDataWs[gps_code].front_status] += 1;
        } else {
          if (old_visible) {
            carsByStatus[old_status] -= 1;
            filtredCarGpsCode[gps_code] = false;
            hasDiffInFiltredCarGpsCode = true;
          }
        }

        const style = getStyleForStatusDirectionType({
          status: carPointsDataWs[gps_code].status,
          direction: carPointsDataWs[gps_code].direction,
          selected,
          zoomMore8,
          show_gov_number: STATUS_SHOW_GOV_NUMBER,
          gov_number: carActualGpsNumberIndex[gps_code] ? carActualGpsNumberIndex[gps_code].gov_number : '',
          visible,
          minZoom,
        });

        feature.setStyle(style);
      }
    }

    if (Object.values(carsByStatus).some(val => !!val)) {
      this.props.monitoPageChangeCarsByStatus(carsByStatus);
    }
    if (hasDiffInFiltredCarGpsCode) {
      this.props.monitorPageMergeFiltredCarGpsCode(filtredCarGpsCode);
    }
  }

  openWs() {
    const token = this.props.token;
    const wsUrl = `${config.ws}?token=${token}`;
    const ws = new ReconnectingWebSocket(wsUrl, null);

    ws.onmessage = ({ data }) => {
      this.handleReveiveData(JSON.parse(data), this.state.statusShow);
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

  handleReveiveData(data: WsData, statusShow) {
    if (updatePoints) {
      const minZoom = this.props.zoom <= MIN_ZOOM_VAL;

      const { carPointsDataWs, gps_code: state_gps_code, lastPoint, carActualGpsNumberIndex, STATUS_SHOW_GOV_NUMBER } = this.state;
      const { odh_mkad  } = this.props;
      const carsByStatus = {
        in_move: 0,
        stop: 0,
        parking: 0,
        not_in_touch: 0,
      };
      const filtredCarGpsCode = {};
      let hasDiffInFiltredCarGpsCode = false;

      Object.entries(data).forEach(([gps_code, { coords, coords_msk, ...data }]) => {
        let point = {
          coords_msk: [...coords_msk].reverse() as ol.Coordinate,
          coords: [...coords].reverse() as ol.Coordinate,
          ...data,
          front_status: getFrontStatus(data.status).slug,
        };

        if (this.props.forToday && gps_code === state_gps_code && lastPoint !== -1 && lastPoint) {
          if (lastPoint.timestamp > point.timestamp) {
            point = {
              ...point,
              ...lastPoint,
            };
          } else if (lastPoint.timestamp < point.timestamp && Object.entries(odh_mkad).length) {
            this.props.carInfoPushPointIntoTrack(point, odh_mkad);
          }
        }

        if (!carPointsDataWs[gps_code]) {
          carPointsDataWs[gps_code] = point;

          const feature = new ol.Feature({
            geometry: new ol.geom.Point(point.coords_msk),
          });
          const selected = gps_code === state_gps_code;

          const visible = selected || checkOnVisible(
            {
              filters: this.state.filters,
              wsData: carPointsDataWs[gps_code],
              statusShow,
              car_actualData: carActualGpsNumberIndex[gps_code],
            },
            gps_code,
          );

          if (visible) {
            carsByStatus[point.front_status] += 1;
            filtredCarGpsCode[gps_code] = true;
            hasDiffInFiltredCarGpsCode = true;
          } else {
            filtredCarGpsCode[gps_code] = false;
            hasDiffInFiltredCarGpsCode = true;
          }
    
          const style = getStyleForStatusDirectionType({
            status: point.status,
            direction: point.direction,
            selected,
            zoomMore8: this.state.zoomMore8,
            show_gov_number: STATUS_SHOW_GOV_NUMBER,
            gov_number: carActualGpsNumberIndex[gps_code] ? carActualGpsNumberIndex[gps_code].gov_number : '',
            visible,
            minZoom,
          });

          if (state_gps_code && state_gps_code === gps_code) {
            this.props.carInfoSetStatus(point.status);
          }

          feature.setId(point.id);
          feature.setStyle(style);
          feature.set('visible', visible);
          feature.set('status', point.front_status);

          this.props.addFeaturesToSource(feature);

        } else if (carPointsDataWs[gps_code].timestamp < point.timestamp) {
          const { [gps_code]: { front_status: old_status } } = carPointsDataWs;

          carPointsDataWs[gps_code] = {
            ...carPointsDataWs[gps_code],
            ...point,
          };

          if (state_gps_code && state_gps_code === gps_code) {
            if (this.props.STATUS_TC_FOLLOW_ON_CAR) {
              const { coords_msk } = carPointsDataWs[gps_code];
        
              const extent: [number, number, number, number] = [
                coords_msk[0],
                coords_msk[1],
                coords_msk[0],
                coords_msk[1],
              ];
        
              const noCheckDisabledCenterOn = true;
              this.props.centerOn({ extent }, noCheckDisabledCenterOn);
            }
          }

          const feature = this.props.getFeatureById(gps_code);
          const old_visible = feature.get('visible');
          const selected = gps_code === state_gps_code

          const visible = selected || checkOnVisible(
            {
              filters: this.state.filters,
              wsData: carPointsDataWs[gps_code],
              statusShow,
              car_actualData: carActualGpsNumberIndex[gps_code],
            }, gps_code
          );

          if (visible) {
            if (old_visible) {
              carsByStatus[old_status] -= 1;
            } else {
              hasDiffInFiltredCarGpsCode = true;
              filtredCarGpsCode[gps_code] = true;
            }
            carsByStatus[carPointsDataWs[gps_code].front_status] += 1;
          } else {
            if (old_visible) {
              carsByStatus[old_status] -= 1;
              hasDiffInFiltredCarGpsCode = true;
              filtredCarGpsCode[gps_code] = false;
            }
          }

          feature.set('visible', visible);
          feature.set('status', point.front_status);

          feature.setGeometry(new ol.geom.Point(carPointsDataWs[gps_code].coords_msk));

          const style = getStyleForStatusDirectionType({
            status: carPointsDataWs[gps_code].status,
            direction: carPointsDataWs[gps_code].direction,
            selected,
            zoomMore8: this.state.zoomMore8,
            show_gov_number: STATUS_SHOW_GOV_NUMBER,
            gov_number: carActualGpsNumberIndex[gps_code] ? carActualGpsNumberIndex[gps_code].gov_number : '',
            visible,
            minZoom,
          });

          if (state_gps_code && state_gps_code === gps_code) {
            this.props.carInfoSetStatus(point.status);
          }

          feature.setStyle(style);
        }
      });


      if (Object.values(carsByStatus).some(val => !!val)) {
        this.props.monitoPageChangeCarsByStatus(carsByStatus);
      }

      if (hasDiffInFiltredCarGpsCode) {
        this.props.monitorPageMergeFiltredCarGpsCode(filtredCarGpsCode);
      }

      this.setState({ carPointsDataWs });
    }
  }

  singleclick = (feature) => {
    const gps_code = (feature as any).getId();
    if (gps_code !== this.state.gps_code) {
      const gps_code = (feature as any).getId();
      this.props.carInfoSetGpsNumber(
        gps_code,
        this.props.carActualGpsNumberIndex[gps_code]
          ? this.props.carActualGpsNumberIndex[gps_code].gov_number
          : null,
      );
    }
  }

  render() {
    return <div></div>
  }
}

const mapStateToProps = state => ({
  token: state.session.token,
  gps_code: state.monitorPage.carInfo.gps_code,
  carActualGpsNumberIndex: state.monitorPage.carActualGpsNumberIndex,
  STATUS_SHOW_GOV_NUMBER: state.monitorPage.SHOW_GOV_NUMBER,
  lastPoint: state.loading.loadingTypes.includes(CAR_INFO_SET_TRACK_CACHING) || state.monitorPage.carInfo.trackCaching.track === -1 ? false : (state.monitorPage.carInfo.trackCaching.track.slice(-1)[0] || null),
  forToday: state.monitorPage.carInfo.forToday,
  odh_mkad: state.monitorPage.geoobjects.odh_mkad.data,
  STATUS_TC_FOLLOW_ON_CAR: state.monitorPage.carInfo.statusTC.FOLLOW_ON_CAR,
  statusShow: state.monitorPage.status,

  filters: state.monitorPage.filters.data,
});

const mapDispatchToProps = dispatch => ({
  carInfoSetGpsNumber(gps_code, gov_number) { dispatch(carInfoSetGpsNumber(gps_code, gov_number)); },
  carInfoSetStatus(status){ dispatch(carInfoSetStatus(status)); },
  carInfoPushPointIntoTrack(point, odh_mkad){ dispatch(carInfoPushPointIntoTrack(point, odh_mkad)); },
  monitoPageChangeCarsByStatus: (carsByStatus) => (
    dispatch(
      monitoPageChangeCarsByStatus(
        carsByStatus,
      )
    )
  ),
  monitorPageResetCarStatus: () => (
    dispatch(
      monitorPageResetCarStatus(),
    )
  ),
  monitorPageMergeFiltredCarGpsCode: (filtredCarGpsCode) => {
    dispatch(
      monitorPageMergeFiltredCarGpsCode(
        filtredCarGpsCode
      ),
    )
  },
})

export default hocAll(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withLayerProps({
    centerOn: true,
    zoom: true,
  }),
)(LayerCarMarker);
