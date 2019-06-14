import * as React from 'react';
import { connect } from 'react-redux';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { keyBy, get } from 'lodash';

import { maskStatusPoint } from 'components/new/ui/mission_info_form/utils/constants';
import { GEOOBJECTS_OBJ } from 'constants/geoobjects-new';
import { routeTypesBySlug, routeTypesByKey } from 'constants/route';

import { diffDates } from 'utils/dates';
import { makeTitle } from 'components/new/ui/mission_info_form/utils/format';
import { loadGeozones } from 'redux-main/trash-actions/geometry/geometry';
import { loadTrackCaching } from 'redux-main/trash-actions/uniq/promise';
import { loadCarGpsCode } from 'redux-main/trash-actions/car/car';
import routesActions from 'redux-main/reducers/modules/routes/actions';

import {
  FormContainer,
  SideContainerDiv,
} from 'components/new/ui/mission_info_form/styled';
import { DivNone } from 'global-styled/global-styled';

import MapContainer from 'components/new/ui/mission_info_form/form-components/map-contaienr/MapContainer';
import InfoTableData from 'components/new/ui/mission_info_form/form-components/info-table-data/InfoTableData';
import MissionInfoTableContainer from 'components/new/ui/mission_info_form/form-components/table-continer/MissionInfoTableContainer';

import {
  DispatchPropsMissionInfoForm,
  PropsMissionInfoForm,
  StateMissionInfoForm,
} from 'components/new/ui/mission_info_form/MissionInfoForm.h';
import { Route } from 'redux-main/reducers/modules/routes/@types';
import { ReduxState } from 'redux-main/@types/state';
import EtsModal from '../modal/Modal';

/**
 * Карточка информации о задании
 */
class MissionInfoForm extends React.Component<
  PropsMissionInfoForm,
  StateMissionInfoForm
> {
  constructor(props) {
    super(props);

    const {
      element: {
        report_data: { entries, check_unit },
        mission_data,
      },
    } = props;

    this.state = {
      track: [],
      front_parkings: [],
      cars_sensors: {},
      polys: {},
      inputLines: [],
      parkingCount: null,
      gps_code: null,
      tooLongDates:
        diffDates(mission_data.date_end, mission_data.date_start, 'days') > 10,
      missionReport: entries
        ? entries.map((report, index) => {
            if (check_unit) {
              report.route_check_unit = check_unit;
            }
            report.frontIndex = index + 1;

            if (props.element.route_data.type === 'points') {
              report.state = maskStatusPoint[report.status];
            }

            return report;
          })
        : null,
    };
  }

  /**
   * Исли разница дат в задании меньше 11 дней и есть данные по заданию
   * то загружаются маршрут и геометрии к нему по типу (ДТ/ ОДХ/ ПН)
   * и трек
   */
  componentDidMount() {
    if (!this.state.tooLongDates && this.state.missionReport) {
      const { element } = this.props;

      this.props
        .actionLoadRouteById(element.route_data.id, {
          page: 'any',
          path: 'missionInfoForm',
        })
        .then((route_data) => {
          switch (element.route_data.type) {
            case routeTypesBySlug.dt.key:
              return this.loadPolys(route_data, 'dt');
            case routeTypesBySlug.odh.key:
              return this.loadPolys(route_data, 'odh');
            case routeTypesBySlug.points.key:
              return this.makePolysFromPoints(route_data);
            default:
              return;
          }
        });

      this.loadGpsCode();
      this.loadTrack();
    }
  }

  async loadGpsCode() {
    const { element } = this.props;

    const {
      payload: { gps_code },
    } = await this.props.loadCarGpsCode({
      asuods_id: element.car_data.asuods_id,
      date_start: element.mission_data.date_start,
    });

    this.setState({ gps_code });
  }

  /**
   * загрузка трека
   * если в маршруте был геообъект мкада, то загружаются геоометрии мкада (для правильного раскрашивания точек), а после сам трек
   * catch нет, тк счиатем, что экшены всегда вернут значение
   */
  async loadTrack() {
    const { element } = this.props;

    const payload: any = {
      asuods_id: element.car_data.asuods_id,
      gps_code: element.car_data.gps_code,
      date_start: element.mission_data.date_start,
      date_end: element.mission_data.date_end,
      odh_mkad: {},
      cars_sensors: {},
    };

    if (this.props.element.route_data.has_mkad) {
      const type = 'odh_mkad';
      const { serverName } = GEOOBJECTS_OBJ[type];

      const { odh_mkad } = await this.props
        .loadGeozones(serverName)
        .then(({ payload: geozones }) => geozones);

      payload.odh_mkad = odh_mkad;
    }

    const calcTrackData = await this.props
      .loadTrackCaching(payload)
      .then(({ payload: track }) => track);

    this.setState({
      track: calcTrackData.track,
      front_parkings: calcTrackData.front_parkings,
      parkingCount: Number(calcTrackData.time_of_parking),
      cars_sensors: calcTrackData.cars_sensors,
    });
  }

  /**
   * Создание геометрий точек
   * @param route_data данные по контрекному маршруту от route?id=
   */
  async makePolysFromPoints(route_data: Route | null) {
    if (route_data) {
      const { missionReport } = this.state;
      this.setState({
        polys: {
          points: missionReport.reduce((newObj, data, index) => {
            newObj[`points/${index + 1}`] = {
              ...data,
              ...route_data.object_list[index],
              frontIsSelected: false,
            };
            return newObj;
          }, {}),
        },
      });
    }
  }

  /**
   * Создание геометрий полигонов одх или дт
   * @param route_data данные по контрекному маршруту от route?id=
   * @param type тип маршрута (dt/ odh)
   */
  loadPolys(route_data: Route, type: string) {
    const objectListIndex: any = route_data
      ? keyBy(route_data.object_list, 'object_id')
      : {};
    const inputLines = get(route_data, 'input_lines', []) || [];
    const { serverName } = GEOOBJECTS_OBJ[type];

    this.props
      .loadGeozones(serverName, this.props.company_id)
      .then(({ payload: { [serverName]: polysObj } }: any) => {
        const { missionReport } = this.state;
        const missionReportObjectIdIndex = new Set();
        missionReport.forEach(({ object_id }) => {
          missionReportObjectIdIndex.add(object_id);
        });

        this.setState({
          inputLines,
          polys: {
            [serverName]: Object.entries(polysObj).reduce(
              (newObj, [geoId, geoData]: any) => {
                const { front_id } = geoData;

                if (missionReportObjectIdIndex.has(front_id)) {
                  newObj[geoId] = {
                    ...geoData,
                    ...objectListIndex[front_id],
                    frontIsSelected: false,
                  };
                }

                return newObj;
              },
              {},
            ),
          },
        });
      });
  }

  handleSelectedElementChange = (id) => {
    const { polys } = this.state;
    const { slug } = routeTypesByKey[this.props.element.route_data.type];
    if (Object.values(polys).length) {
      this.setState({
        polys: {
          [slug]: Object.entries(polys[slug]).reduce(
            (newObj, [geoId, geoData]) => {
              newObj[geoId] = { ...geoData };
              newObj[geoId].frontIsSelected = geoId === `${slug}/${id}`;

              return newObj;
            },
            {},
          ),
        },
      });
    }
  };

  render() {
    const {
      onFormHide,
      element,
      element: {
        car_data,
        mission_data,
        route_data,
        report_data,
        speed_limits,
      },
    } = this.props;

    const { missionReport } = this.state;

    const title = makeTitle(element);

    return (
      <EtsModal
        id="modal-mission-info"
        show
        onHide={onFormHide}
        bsSize="large"
        className="mission-info-modal"
        backdrop="static">
        <form onSubmit={onFormHide}>
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <ModalBodyPreloader
            page="any"
            path="missionInfoForm"
            typePreloader="lazy">
            <FormContainer>
              <SideContainerDiv>
                <MapContainer
                  gov_number={car_data.gov_number}
                  gps_code={this.state.gps_code}
                  track={this.state.track}
                  geoobjects={this.state.polys}
                  inputLines={this.state.inputLines}
                  front_parkings={this.state.front_parkings}
                  speed_limits={speed_limits}
                  cars_sensors={this.state.cars_sensors}
                  missionNumber={mission_data.number}
                  has_mkad={route_data.has_mkad}
                  object_type_name={route_data.object_type_name}
                />
                {!this.state.tooLongDates ? (
                  <InfoTableData
                    mission_data={mission_data}
                    report_data={report_data}
                    parkingCount={this.state.parkingCount}
                  />
                ) : (
                  <DivNone />
                )}
              </SideContainerDiv>
              <SideContainerDiv>
                {this.state.tooLongDates ? (
                  <span>Слишком большой период действия задания</span>
                ) : !missionReport ? (
                  <h5>Нет данных о прохождении задания</h5>
                ) : (
                  <MissionInfoTableContainer
                    type={route_data.type}
                    missionReport={missionReport}
                    handleSelectedElementChange={
                      this.handleSelectedElementChange
                    }
                  />
                )}
                {!route_data.has_object_list ? (
                  <h5>Объекты отсутствуют в маршруте</h5>
                ) : (
                  <DivNone />
                )}
              </SideContainerDiv>
            </FormContainer>
          </ModalBodyPreloader>
          <Modal.Footer>
            <Button type="submit">Закрыть</Button>
          </Modal.Footer>
        </form>
      </EtsModal>
    );
  }
}

export default connect<any, DispatchPropsMissionInfoForm, any, ReduxState>(
  (state) => ({
    company_id: state.session.userData.company_id,
  }),
  (dispatch: any) => ({
    loadGeozones: (serverName, company_id) =>
      dispatch(
        loadGeozones(
          'none',
          serverName,
          {
            promise: true,
            page: 'any',
            path: 'missionInfoForm',
          },
          company_id,
        ),
      ),
    actionLoadRouteById: (...arg) =>
      dispatch(routesActions.actionLoadRouteById(...arg)),
    loadTrackCaching: (props) =>
      dispatch({
        type: '',
        payload: loadTrackCaching(props),
        meta: {
          page: 'any',
          path: 'missionInfoForm',
        },
      }),
    loadCarGpsCode: ({ asuods_id, date_start }) =>
      dispatch(
        loadCarGpsCode(
          'none',
          {
            asuods_id,
            date_start,
          },
          {
            page: 'any',
            path: 'missionInfoForm',
          },
        ),
      ),
  }),
)(MissionInfoForm);
