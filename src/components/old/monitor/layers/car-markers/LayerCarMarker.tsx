/**
 * Не использовать данные из сокета для фильтрации!!!
 */

import * as React from 'react';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';

import withLayerProps from 'components/new/ui/map/layers/base-hoc/layer/LayerProps';
import { compose } from 'recompose';
import { getStyleForStatusDirectionType } from 'components/old/monitor/layers/car-markers/feature-style';
import { connect } from 'react-redux';
import * as Raven from 'raven-js';
import * as ReconnectingWebSocket from 'reconnectingwebsocket';
import {
  carInfoPushPointIntoTrack,
  carInfoSetStatus,
} from 'components/old/monitor/info/car-info/redux-main/modules/actions-car-info';
import { CAR_INFO_SET_TRACK_CACHING } from 'components/old/monitor/info/car-info/redux-main/modules/car-info';
import {
  monitorPageChangeCarsByStatus,
  monitorPageMergeFiltredCarGpsCode,
  monitorPageResetCarStatus,
} from 'components/old/monitor/redux-main/models/actions-monitor-page';
import {
  calcCountTsByStatus,
  checkOnVisible,
  getFrontStatus,
} from 'components/old/monitor/layers/car-markers/utils';

import {
  PropsLayerCarMarker,
  StateLayerCarMarker,
  WsData,
} from 'components/old/monitor/layers/car-markers/LayerCarMarker.h';
import { isEmpty } from 'lodash';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';

let updatePoints = true;
const MIN_ZOOM_VAL = 3;

global.toggleUpdateCarPoints = () => (updatePoints = !updatePoints);

const defaultFilters = {
  carFilterMultyOwner: [],
  carFilterMultyStructure: [],
  carFilterMultyType: [],
  carFilterText: '',
  featureBufferPolygon: null,
};

const defaultStatusShow = {
  in_move: true,
  not_in_touch: true,
  parking: true,
  stop: true,
};

class LayerCarMarker extends React.PureComponent<PropsLayerCarMarker, StateLayerCarMarker> {
  public readonly state = {
    ws: null,
    carPointsDataWs: {},
  };

  public componentDidMount(): void {
    this.props
      .addLayer({ id: 'CarMarker', zIndex: 10, renderMode: 'image' })
      .then(() => {
        this.props.setDataInLayer('singleclick', this.singleclick);
      });
    this.openWs();
  }

  public componentDidUpdate(prevProps): void { // handleClick cars
    const { gps_code: prev_gps_code } = prevProps;

    if (updatePoints) {
      const {
        statusShow,
        gps_code,
        zoom,
        STATUS_SHOW_GOV_NUMBER,
        lastPoint,
        filters,
        carActualGpsNumberIndex,
        STATUS_TC_FOLLOW_ON_CAR,
        odh_mkad,
      } = this.props;

      const zoomMore8 = zoom > 8;
      const prevZoomMore8 = prevProps.zoom > 8;
      const minZoom = zoom <= MIN_ZOOM_VAL;
      const prevMinZoom = prevProps.zoom <= MIN_ZOOM_VAL;

      const propsObjToChangeStyle: any = {
        carPointsDataWs: {},
        old_carPointsDataWs: this.state.carPointsDataWs,
        zoomMore8,
        minZoom,
        gps_code,
        statusShow,
        STATUS_SHOW_GOV_NUMBER,
        filters,
        carActualGpsNumberIndex,
      };
      let hasWhatChage = false;

      if (gps_code !== prev_gps_code) {
        // Если произошёл перевыбор или сброс ТС
        if (gps_code) {
          // Если ТС выборана
          const {
            carPointsDataWs: { [gps_code]: carPointData },
          } = this.state as any;

          if (carPointData) {
            hasWhatChage = true;

            propsObjToChangeStyle.carPointsDataWs[gps_code] = carPointData;
            if (prev_gps_code) {
              // Нужно ли обновить состояние предыдущего выбранного ТС
              const {
                carPointsDataWs: { [prev_gps_code]: prevGpsCodeCarPointData },
              } = this.state as any;
              if (prevGpsCodeCarPointData) {
                propsObjToChangeStyle.carPointsDataWs[
                  prev_gps_code
                ] = prevGpsCodeCarPointData;
              }
            }

            this.props.carInfoSetStatus(carPointData.status); // Обновление статуса на карточке ТС
            const { coords_msk } = carPointData;

            const extent: [number, number, number, number] = [
              coords_msk[0],
              coords_msk[1],
              coords_msk[0],
              coords_msk[1],
            ];

            const opt_options = {
              padding: [50, 550, 50, 150],
              duration: 500,
              maxZoom: this.props.zoom,
            };
            const noCheckDisabledCenterOn = true; //  игнор дисейбла центрирование (только при enableInteractions)

            this.props.centerOn(
              {
                extent,
                opt_options,
              },
              noCheckDisabledCenterOn,
            );
          }
        } else {
          const {
            carPointsDataWs: { [prev_gps_code]: carPointData },
          } = this.state as any;

          if (carPointData) {
            hasWhatChage = true;

            propsObjToChangeStyle.carPointsDataWs[prev_gps_code] = carPointData;
          }
        }
      }

      const tgiggerOnChangeStyleForAllCars
        = carActualGpsNumberIndex !== prevProps.carActualGpsNumberIndex // для фильтрации (тс должна быть с списке и для гаражного номер)
        || zoomMore8 !== prevZoomMore8 // размер иконок на 8 зуме
        || minZoom !== prevMinZoom // максимальное отдоление карты
        || STATUS_SHOW_GOV_NUMBER !== prevProps.STATUS_SHOW_GOV_NUMBER // (не)отображение гаражного номера
        || statusShow !== prevProps.statusShow // Отображение иконок по статусу ТС (Активен, стоянка ...)
        || filters !== prevProps.filters; // отображение ТС по фильтрам

      if (tgiggerOnChangeStyleForAllCars) {
        // для фильтрации (тс должна быть с списке и для гаражного номер)
        hasWhatChage = true;
        propsObjToChangeStyle.carPointsDataWs = this.state.carPointsDataWs;
      }

      if (
        gps_code
        && lastPoint !== prevProps.lastPoint
        && this.props.forToday
        && !isEmpty(odh_mkad)
        && this.state.carPointsDataWs[gps_code]
      ) {
        const {
          carPointsDataWs: { [gps_code]: carPointData },
        } = this.state as any;

        if (lastPoint) {
          if (
            lastPoint.timestamp > this.state.carPointsDataWs[gps_code].timestamp
          ) {
            hasWhatChage = true;
            propsObjToChangeStyle.carPointsDataWs[gps_code] = {
              ...this.state.carPointsDataWs[gps_code],
              ...lastPoint,
            };
          } else if (
            lastPoint.timestamp < this.state.carPointsDataWs[gps_code].timestamp
          ) {
            this.props.carInfoPushPointIntoTrack(carPointData, odh_mkad);
          }
        } else {
          this.props.carInfoPushPointIntoTrack(carPointData, odh_mkad);
        }
      }

      if (hasWhatChage) {
        this.changeStyle(propsObjToChangeStyle);
      }

      if (STATUS_TC_FOLLOW_ON_CAR && gps_code) {
        // Следование за ТС
        const {
          carPointsDataWs: {
            [gps_code]: carPointData, //  текущеее состояние ТС
          },
        } = this.state as any;

        if (carPointData) {
          const { coords_msk } = carPointData;

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
    }
  }

  public componentWillUnmount(): void {
    this.props.removeLayer();
    this.props.monitorPageResetCarStatus();
    this.closeWs();
  }

  private changeStyle({
    carPointsDataWs,
    zoomMore8,
    gps_code: state_gps_code,
    statusShow,
    STATUS_SHOW_GOV_NUMBER,
    filters,
    carActualGpsNumberIndex,
    old_carPointsDataWs,
    minZoom,
  }): void {
    const filtredCarGpsCode = {};
    let hasDiffInFiltredCarGpsCode = false;
    const newCarPointsDataWs = {};

    for (const gps_code in carPointsDataWs) {
      if (gps_code in carPointsDataWs) {
        const data = { ...carPointsDataWs[gps_code] };
        const old_data = old_carPointsDataWs[gps_code];
        const feature = this.props.getFeatureById(gps_code);

        if (feature) {
          if (data.coords_msk !== old_data.coords_msk) {
            feature.setGeometry(new Point(data.coords_msk));
          }
          const selected = gps_code === state_gps_code;

          const visibleWithoutFilters = selected
          || checkOnVisible(
            {
              car_actualData: carActualGpsNumberIndex[gps_code],
              filters: defaultFilters,
              statusShow: defaultStatusShow,
              wsData: carPointsDataWs[gps_code],
            },
            gps_code,
          );
          carPointsDataWs[gps_code].visibleWithoutFilters = visibleWithoutFilters;

          data.visibleWithoutFilters = visibleWithoutFilters;

          const visible
            = selected
            || checkOnVisible(
              {
                car_actualData: carActualGpsNumberIndex[gps_code],
                filters,
                statusShow,
                wsData: carPointsDataWs[gps_code],
              },
              gps_code,
            );
          data.visible = visible;

          const old_visible = feature.get('visible');

          feature.set('visible', visible);
          feature.set('status', carPointsDataWs[gps_code].front_status);

          if (visible) {
            if (!old_visible) {
              filtredCarGpsCode[gps_code] = true;
              hasDiffInFiltredCarGpsCode = true;
            }
          } else {
            if (old_visible) {
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
            gov_number: carActualGpsNumberIndex[gps_code]
              ? carActualGpsNumberIndex[gps_code].gov_number
              : '',
            visible,
            minZoom,
          });

          feature.setStyle(style);
        }

        newCarPointsDataWs[gps_code] = data;
      }
    }

    this.setState(({ carPointsDataWs: stateCarPointsDataWs }) => {
      const newObj = {
        ...stateCarPointsDataWs,
        ...newCarPointsDataWs,
      };

      this.props.monitorPageChangeCarsByStatus(calcCountTsByStatus(newObj, this.props.carActualGpsCount));

      return {
        carPointsDataWs: newObj,
      };
    });

    if (hasDiffInFiltredCarGpsCode) {
      this.props.monitorPageMergeFiltredCarGpsCode(filtredCarGpsCode);
    }
  }

  private openWs(): void {
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
      this.handleReviewData(JSON.parse(data) as WsData, this.props.statusShow);
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

  private closeWs(): void {
    if (this.state.ws) {
      this.state.ws.close();
      this.setState({ ws: null });
    }
  }

  private handleReviewData(data: WsData, statusShow: PropsLayerCarMarker['statusShow']): void {
    if (updatePoints) {
      const {
        gps_code: state_gps_code,
        lastPoint,
        carActualGpsNumberIndex,
        STATUS_SHOW_GOV_NUMBER,
        zoom,
        odh_mkad,
        filters,
        carActualGpsCount,
      } = this.props;
      
      const zoomMore8 = zoom > 8;
      const { carPointsDataWs } = this.state;

      const filtredCarGpsCode = {};
      let hasDiffInFiltredCarGpsCode = false;
      const minZoom = zoom <= MIN_ZOOM_VAL;

      Object.entries(data).forEach(
        ([gps_code, { coords, coords_msk, ...dataOther }]) => {
          let point = {
            coords_msk: [...coords_msk].reverse(),
            coords: [...coords].reverse(),
            ...dataOther,
            front_status: getFrontStatus(dataOther.status).slug,
          };

          if (
            this.props.forToday
            && gps_code === state_gps_code
            && lastPoint !== -1
            && lastPoint
          ) {
            if (lastPoint.timestamp > point.timestamp) {
              point = {
                ...point,
                ...lastPoint,
              };
            } else if (
              lastPoint.timestamp < point.timestamp
              && !isEmpty(odh_mkad)
            ) {
              this.props.carInfoPushPointIntoTrack(point, odh_mkad);
            }
          }

          if (!carPointsDataWs[gps_code]) {
            carPointsDataWs[gps_code] = point;

            const feature = new Feature({
              geometry: new Point(point.coords_msk),
            });
            const selected = gps_code === state_gps_code;

            const visibleWithoutFilters = selected
              || checkOnVisible(
                {
                  car_actualData: carActualGpsNumberIndex[gps_code],
                  filters: defaultFilters,
                  statusShow: defaultStatusShow,
                  wsData: carPointsDataWs[gps_code]
                },
                gps_code,
              );
            carPointsDataWs[gps_code].visibleWithoutFilters = visibleWithoutFilters;

            const visible
              = selected
              || checkOnVisible(
                {
                  car_actualData: carActualGpsNumberIndex[gps_code],
                  filters,
                  statusShow,
                  wsData: carPointsDataWs[gps_code]
                },
                gps_code,
              );

            carPointsDataWs[gps_code].visible = visible;

            if (visible) {
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
              zoomMore8,
              show_gov_number: STATUS_SHOW_GOV_NUMBER,
              gov_number: carActualGpsNumberIndex[gps_code]
                ? carActualGpsNumberIndex[gps_code].gov_number
                : '',
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
            carPointsDataWs[gps_code] = {
              ...carPointsDataWs[gps_code],
              ...point,
            };

            if (state_gps_code && state_gps_code === gps_code) {
              if (this.props.STATUS_TC_FOLLOW_ON_CAR) {
                const { coords_msk: coordsMsk } = carPointsDataWs[gps_code];

                const extent: [number, number, number, number] = [
                  coordsMsk[0],
                  coordsMsk[1],
                  coordsMsk[0],
                  coordsMsk[1],
                ];

                const noCheckDisabledCenterOn = true;
                this.props.centerOn({ extent }, noCheckDisabledCenterOn);
              }
            }

            const feature = this.props.getFeatureById(gps_code);
            const old_visible = feature.get('visible');
            const selected = gps_code === state_gps_code;

            const visible
              = selected
              || checkOnVisible(
                {
                  car_actualData: carActualGpsNumberIndex[gps_code],
                  filters,
                  statusShow,
                  wsData: carPointsDataWs[gps_code],
                },
                gps_code,
              );

            const visibleWithoutFilters = selected
              || checkOnVisible(
                {
                  car_actualData: carActualGpsNumberIndex[gps_code],
                  filters: defaultFilters,
                  statusShow: defaultStatusShow,
                  wsData: carPointsDataWs[gps_code],
                },
                gps_code,
              );
            carPointsDataWs[gps_code].visibleWithoutFilters = visibleWithoutFilters;

            carPointsDataWs[gps_code].visible = visible;

            if (visible) {
              if (!old_visible) {
                hasDiffInFiltredCarGpsCode = true;
                filtredCarGpsCode[gps_code] = true;
              }
            } else {
              if (old_visible) {
                hasDiffInFiltredCarGpsCode = true;
                filtredCarGpsCode[gps_code] = false;
              }
            }

            feature.set('visible', visible);
            feature.set('status', point.front_status);

            feature.setGeometry(
              new Point(carPointsDataWs[gps_code].coords_msk),
            );

            const style = getStyleForStatusDirectionType({
              status: carPointsDataWs[gps_code].status,
              direction: carPointsDataWs[gps_code].direction,
              selected,
              zoomMore8,
              show_gov_number: STATUS_SHOW_GOV_NUMBER,
              gov_number: carActualGpsNumberIndex[gps_code]
                ? carActualGpsNumberIndex[gps_code].gov_number
                : '',
              visible,
              minZoom,
            });

            if (state_gps_code && state_gps_code === gps_code) {
              this.props.carInfoSetStatus(point.status);
            }

            feature.setStyle(style);
          }
        },
      );

      this.props.monitorPageChangeCarsByStatus(
        calcCountTsByStatus(carPointsDataWs, carActualGpsCount),
      );

      if (hasDiffInFiltredCarGpsCode) {
        this.props.monitorPageMergeFiltredCarGpsCode(filtredCarGpsCode);
      }

      this.setState({ carPointsDataWs });
    }
  }

  private readonly singleclick = (feature): void => {
    const gps_code = (feature as any).getId();
    if (gps_code !== this.props.gps_code) {
      this.props.setParams({
        gov_number: this.props.carActualGpsNumberIndex[gps_code].gov_number,
      });
    }
  };

  public render(): JSX.Element {
    return <div />;
  }
}

const mapStateToProps = (state: ReduxState) => ({
  token: state.session.token,
  points_ws: getSessionState(state).appConfig.points_ws,
  gps_code: state.monitorPage.carInfo.gps_code,
  carActualGpsNumberIndex: state.monitorPage.carActualGpsNumberIndex,
  carActualGpsCount: state.monitorPage.carActualGpsCount,
  STATUS_SHOW_GOV_NUMBER: state.monitorPage.SHOW_GOV_NUMBER,
  lastPoint:
    state.loading.loadingTypes.includes(CAR_INFO_SET_TRACK_CACHING)
    || state.monitorPage.carInfo.trackCaching.track === -1
      ? false
      : state.monitorPage.carInfo.trackCaching.track.slice(-1)[0] || null,
  forToday: state.monitorPage.carInfo.forToday,
  odh_mkad: state.monitorPage.geoobjects.odh_mkad.data,
  STATUS_TC_FOLLOW_ON_CAR: state.monitorPage.carInfo.statusTC.FOLLOW_ON_CAR,
  statusShow: state.monitorPage.status,

  filters: state.monitorPage.filters.data,
});

const mapDispatchToProps = (dispatch) => ({
  carInfoSetStatus(status) {
    dispatch(carInfoSetStatus(status));
  },
  carInfoPushPointIntoTrack(point, odh_mkad) {
    dispatch(carInfoPushPointIntoTrack(point, odh_mkad));
  },
  monitorPageChangeCarsByStatus: (carsByStatus) =>
    dispatch(monitorPageChangeCarsByStatus(carsByStatus)),
  monitorPageResetCarStatus: () => dispatch(monitorPageResetCarStatus()),
  monitorPageMergeFiltredCarGpsCode: (filtredCarGpsCode) => {
    dispatch(monitorPageMergeFiltredCarGpsCode(filtredCarGpsCode));
  },
});

export default compose<any, any>(
  withSearch,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withLayerProps({
    centerOn: true,
    zoom: true,
  }),
)(LayerCarMarker);
