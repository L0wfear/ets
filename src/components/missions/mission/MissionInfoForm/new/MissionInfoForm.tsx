import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import { keyBy } from 'lodash';
import {
  compose,
  withStateHandlers,
} from 'recompose';
import { diffDates, secondsToTime } from 'utils/dates';
import { routeTypesBySlug, routeTypesByKey } from 'constants/route';

import {
  FormContainer,
  SideContainerDiv,
  MapContainerDiv,
} from 'components/missions/mission/MissionInfoForm/new/styled/styled';

import {
  DivNone,
  DivGreen,
  DivRed,
} from 'global-styled/global-styled';

import MapWrap from 'components/missions/mission/MissionInfoForm/new/map/MapWrap';
import MissionReportByODH from 'components/reports/operational/mission/MissionReportByODH.jsx';
import MissionReportByDT from 'components/reports/operational/mission/MissionReportByDT.jsx';
import MissionReportByPoints from 'components/reports/operational/mission/MissionReportByPoints.jsx';
import { GEOOBJECTS_OBJ } from 'constants/geoobjects-new';

import { loadGeozones } from 'redux-main/trash-actions/geometry/geometry';
import { loadRouteDataById } from 'redux-main/trash-actions/route/route';

import {
  AnsLoadGeozonesFunc,
} from 'redux-main/trash-actions/geometry/geometry.h';
import {
  AnsLoadRouteDataByIdFunc,
} from 'redux-main/trash-actions/route/@types/route.h';
import {
  RouteType,
} from 'redux-main/trash-actions/route/@types/promise.h';
import {
  IMissionInfoFormState,
} from 'components/missions/mission/MissionInfoForm/new/MissionInfoForm.h';

const maskStatusPoint = {
  fail: 1,
}

const VALUE_FOR_FIXED = {
  TWO_F: {
    val: 2,
    list: [
      'кв. м.',
      'м.',
    ],
  },
  THREE_F: {
    val: 3,
    list: [
      'км',
    ],
  },
  floatFixed: (data, val) => parseFloat(data).toFixed(val),
};

const checkFixed = (data, key) => {
  const clone = [...data];

  if (VALUE_FOR_FIXED[key].list.includes(data[1])) {
    clone[0] = VALUE_FOR_FIXED.floatFixed(clone[0], VALUE_FOR_FIXED[key].val);
  }

  return clone;
};

const getDataTraveledYet = (data) => {
  if (data === null) {
    return 0;
  }
  if (Array.isArray(data)) {
    return data.join(' ');
  }

  return !isNaN(parseInt(data, 10)) ? parseInt(data, 10) : '-';
};

type PropsMissionInfoForm = {
  element: IMissionInfoFormState;
  onFormHide: any;
  loadGeozones: (serverName: string) => Promise<AnsLoadGeozonesFunc>,
  loadRouteDataById: (id: number) => Promise<AnsLoadRouteDataByIdFunc>,
};

type StateMissionInfoForm = {
  tooLongDates: boolean;
  polys: object;
  missionReport: any[];
  parkingCount: number | void;
}

class MissionInfoForm extends React.Component <PropsMissionInfoForm, StateMissionInfoForm> {
  constructor(props) {
    super(props);

    const {
      element: {
        report_data: {
          entries,
          check_unit,
        },
        mission_data,
      },
    } = props;

    this.state = {
      polys: {},
      parkingCount: null,
      tooLongDates: (
        diffDates(
          mission_data.date_end,
          mission_data.date_start,
          'days',
        ) > 10
      ),
      missionReport: (
        entries ?
          entries.map((report, index) => {
            if (check_unit) {
              report.route_check_unit = check_unit;
            }
            report.frontIndex = index;

            if (props.element.route_data.type === 'points') {
              report.state = maskStatusPoint[report.status];
            }

            return report;
          })
        :
          null
      ),
    };
  }

  componentDidMount() {
    if (!this.state.tooLongDates && this.state.missionReport) {
      const {
        element,
      } = this.props;

      this.props.loadRouteDataById(element.route_data.id).then(({ payload: { route_data } }) => {
        switch (element.route_data.type) {
          case routeTypesBySlug.dt.key: return this.loadPolys(route_data, 'dt');
          case routeTypesBySlug.odh.key: return this.loadPolys(route_data, 'odh');
          case routeTypesBySlug.points.key: return this.makePolysFromPoints(route_data);
          default: return;
        }
      })

      this.loadTrack();
    }
  }

  loadTrack() {
    console.log('load track');
  }

  async makePolysFromPoints(route_data) {
    const { missionReport } = this.state;

    this.setState({
      polys: {
        points: missionReport.reduce((newObj, data, index) => {
          newObj[`points/${index}`] = {
            ...data,
            ...route_data.object_list[index],
            frontIsSelected: false,
          };

          return newObj;
        }, {}),
      },
    })
  }

  loadPolys(route_data: RouteType, type: string) {
    const objectListIndex = keyBy(route_data.object_list, 'object_id');
    const { serverName } = GEOOBJECTS_OBJ[type];

    this.props.loadGeozones(serverName).then(({ payload: { [serverName]: polysObj } }) => {
      const { missionReport } = this.state;
      const missionReportObjectIdIndex = new Set();
      missionReport.forEach(({ object_id }) => {
        missionReportObjectIdIndex.add(object_id);
      });

      this.setState({
        polys: {
          [serverName]: Object.entries(polysObj).reduce((newObj, [geoId, geoData]: any) => {
            const { front_id } = geoData;

            if (missionReportObjectIdIndex.has(front_id)) {
              newObj[geoId] = {
                ...geoData,
                ...objectListIndex[front_id],
                frontIsSelected: false,
              };
            }

            return newObj;
          }, {}),
        },
      });
    });
  }

  handleSelectedElementChange = (id) => {
    const { polys } = this.state;
    const { slug } = routeTypesByKey[this.props.element.route_data.type];

    this.setState({
      polys: {
        [slug]: Object.entries(polys[slug]).reduce((newObj, [geoId, geoData]) => {
          newObj[geoId] = {...geoData};
          newObj[geoId].frontIsSelected = geoId === `${slug}/${id}`;

          return newObj;
        }, {}),
      },
    })
  }

  render() {
    const {
      onFormHide,
      element: {
        car_data,
        mission_data,
        route_data,
        report_data,
      },
    } = this.props;
    const {
      missionReport,
    } = this.state;

    const titleArr = [
      `Информация о задании №${mission_data.number}.`,
      `Рег. номер ТС: ${car_data.gov_number}`,
    ];
    if (mission_data.column_id) {
      titleArr.push('.');
      titleArr.push(`Колонна № ${mission_data.column_id}`);
    }

    const title = titleArr.join(' ');

    const withWorkSpeed = getDataTraveledYet([
      ...checkFixed([report_data.traveled_raw, report_data.check_unit], 'TWO_F'),
      report_data.time_work_speed,
    ]);

    const withHightSpeed = getDataTraveledYet([
      ...checkFixed([report_data.traveled_high_speed, report_data.check_unit], 'TWO_F'),
      report_data.time_high_speed,
    ]);

    const parkingCount = 0;

    const allRunWithWorkEquipment = (
      mission_data.sensor_traveled_working !== null ?
      getDataTraveledYet(
        checkFixed([mission_data.sensor_traveled_working / 1000, 'км'], 'THREE_F')
      )
      :
      'Нет данных'
    );

    return (

      <Modal id="modal-mission-info" show onHide={onFormHide} bsSize="large" className="mission-info-modal" backdrop="static">
        <form onSubmit={onFormHide}>
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <ModalBody>
            <FormContainer>
            <SideContainerDiv>
              <MapContainerDiv>
                <MapWrap
                  gov_number={car_data.gov_number}
                  geoobjects={this.state.polys}
                />
              </MapContainerDiv>
              <div>
              {
                !this.state.tooLongDates ?
                (
                  <>
                    <div>* - расстояние, учитываемое при прохождении задания</div>
                    <div>** - пройдено с рабочей скоростью / пройдено с превышением рабочей скорости</div>
                    <DivGreen>
                      <b>{'Пройдено с рабочей скоростью: '}</b>{withWorkSpeed}
                    </DivGreen>
                    <DivRed>
                      <b>{'Пройдено с превышением рабочей скорости: '}</b>{withHightSpeed}
                    </DivRed>
                    <div>
                      <b>{'Общее время стоянок: '}</b>{parkingCount ? secondsToTime(this.state.parkingCount) : 'Рассчитывается...'}}
                    </div>
                    <div>
                      <b>{'Общий пробег с работающим оборудованием: '}</b>{allRunWithWorkEquipment}
                    </div>
                    <div>
                      <b>{'Процент выполнения задания, %: '}</b>{mission_data.traveled_percentage || '-'}
                    </div>
                  </>
                )
                :
                (
                  <DivNone />
                )
              }
            </div>
            </SideContainerDiv>
            <SideContainerDiv>
            {
              this.state.tooLongDates ?
              (
                  <span>Слишком большой период действия задания</span>
              )
              :
              (
                !missionReport ?
                (
                  <h5>Нет данных о прохождении задания</h5>
                )
                :
                (
                  <>
                    {
                      route_data.type !== 'mixed' ?
                      (
                        <DivNone />
                      )
                      :
                      (
                        <MissionReportByODH renderOnly enumerated={false} selectedReportDataODHS={missionReport} onElementChange={this.handleSelectedElementChange} selectField={'object_id'} />
                      )
                    }
                    {
                      route_data.type !== 'simple_dt' ?
                      (
                        <DivNone />
                      )
                      :
                      (
                      <MissionReportByDT renderOnly enumerated={false} selectedReportDataDTS={missionReport} onElementChange={this.handleSelectedElementChange} selectField={'object_id'} />
                      )
                    }
                                        {
                      route_data.type !== 'points' ?
                      (
                        <DivNone />
                      )
                      :
                      (
                        <MissionReportByPoints renderOnly enumerated={false} selectedReportDataPoints={missionReport} onElementChange={this.handleSelectedElementChange} selectField={'frontIndex'}/>
                      )
                    }
                  </>
                )
              )
            }
            </SideContainerDiv>
            </FormContainer>
          </ModalBody>
          <Modal.Footer>
            <Button type="submit">Закрыть</Button>
          </Modal.Footer>
        </form>
      </Modal>
    )
  }
};

const mapDispatchToProps = (dispatch) => ({
  loadGeozones: (serverName) => (
    dispatch(
      loadGeozones('', serverName)
    )
  ),
  loadRouteDataById: (id) => (
    dispatch(
      loadRouteDataById('', id),
    )
  )
})

export default compose(
  withStateHandlers(
    (props: any) => {
      const {
        element: {
          report_data: {
            entries,
            check_unit,
          },
          mission_data,
        },
      } = props;

      return  ({
        tooLongDates: (
          diffDates(
            mission_data.date_end,
            mission_data.date_start,
            'days'
          ) > 10
        ),
        missionReport: (
          entries ?
            check_unit ?
            (
              entries.map((report) => {
                report.route_check_unit = check_unit;

                return report;
              })
            )
            :
            (
              entries
            )
          :
            null
        )
      });
    },
    {

    },
  ),
  connect(
    null,
    mapDispatchToProps,
  )
)(MissionInfoForm);
