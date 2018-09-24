import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';

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

import Div from 'components/ui/Div';
import MapWrap from 'components/missions/mission/MissionInfoForm/new/map/MapWrap';
import MissionReportByODH from 'components/reports/operational/mission/MissionReportByODH.jsx';
import MissionReportByDT from 'components/reports/operational/mission/MissionReportByDT.jsx';
import MissionReportByPoints from 'components/reports/operational/mission/MissionReportByPoints.jsx';
import { GEOOBJECTS_OBJ } from 'constants/geoobjects-new';

import {
  loadGeozones,
} from 'redux-main/trash-actions/geometry/geometry';

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


class MissionInfoForm extends React.Component <any, { polys: object }> {
  state = {
    polys: {},
  };

  componentDidMount() {
    if (!this.props.tooLongDates) {
      this.loadTrack();
      switch (this.props.element.route_data.type) {
        case routeTypesBySlug.dt.key: return this.loadPolys('dt');
        case routeTypesBySlug.odh.key: return this.loadPolys('odh');
        default: return;
      }
    }
  }

  loadTrack() {
    console.log('load track');
  }

  loadPolys(type: string) {
    const { serverName } = GEOOBJECTS_OBJ[type];

    loadGeozones('', serverName).payload.then(({ [serverName]: polysObj }) => {
      const { missionReport } = this.props;
      const missionReportObjectIdIndex = new Set();
      missionReport.forEach(({ object_id }) => {
        missionReportObjectIdIndex.add(object_id);
      });
      console.log(missionReportObjectIdIndex);

      this.setState({
        polys: {
          [serverName]: Object.entries(polysObj).reduce((newObj, [geoId, geoData]: any) => {
            if (missionReportObjectIdIndex.has(geoData.front_id)) {
              newObj[geoId] = geoData;
              newObj[geoId].frontIsSelected = false;
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
    console.log(slug, id, this.state.polys);

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
      missionReport,
    } = this.props;

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

    console.log(this.state.polys);

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
                !this.props.tooLongDates ?
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
                      <b>{'Общее время стоянок: '}</b>{parkingCount ? secondsToTime(this.props.parkingCount) : 'Рассчитывается...'}}
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
              this.props.tooLongDates ?
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
                    <Div hidden={route_data. type !== 'mixed'}>
                      <MissionReportByODH renderOnly enumerated={false} selectedReportDataODHS={missionReport} onElementChange={this.handleSelectedElementChange} selectField={'object_id'} />
                    </Div>
                    <Div hidden={route_data. type !== 'simple_dt'}>
                      <MissionReportByDT renderOnly enumerated={false} selectedReportDataDTS={missionReport} onElementChange={this.handleSelectedElementChange} selectField={'object_id'} />
                    </Div>
                    <Div hidden={route_data. type !== 'points'}>
                      <MissionReportByPoints renderOnly enumerated={false} selectedReportDataPoints={missionReport} />
                    </Div>
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
    }
  ),
)(MissionInfoForm);
