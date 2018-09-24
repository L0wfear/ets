import * as React from 'react';

import { connect } from 'react-redux';
import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { get } from 'lodash';

import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';
import RouteInfoForm from 'components/route/route-info-form/RouteInfoForm';

import InfoCard from 'components/dashboard/new/menu/cards/_default-card-component/info-card/InfoCard';
import { ExtField } from 'components/ui/new/field/ExtField';
import { listData } from 'components/dashboard/new/menu/cards/current-duty-missions/info/listData';
import {
  dashboardLoadCurrentDutyMissions,
  dashboardLoadMissionDataForCurrentMission,
} from 'components/dashboard/new/redux-main/modules/dashboard/actions-dashboard';

import {
  loadDutyMissionById,
  updateDutyMissionByPayload,
} from 'redux-main/trash-actions/mission';
import { ButtonUpdateDutyMission } from 'components/missions/duty_mission/buttons/buttons';
import { LinkToOpenRouteInfoForm } from 'components/route/buttons/buttons';

import {
  PropsCurrentMissionInfo,
  StateCurrentMissionInfo,
} from 'components/dashboard/new/menu/cards/current-duty-missions/info/@types/CurrentDutyMissionsInfo.h';
import {
  RightButton_BlockContainer,
} from 'components/dashboard/new/menu/cards/_default-card-component/hoc/with-defaulr-card/styled/styled';

class CurrentMissionInfo extends React.Component<PropsCurrentMissionInfo, StateCurrentMissionInfo> {
  state = {
    showRouteInfoForm: false,
    showMissionRejectForm: false,
  };

  refreshCard = () => (
    this.props.loadData()
  )
  openRouteInfoForm = () => {
    this.setState({
      showRouteInfoForm: true,
    });
  }
  handleRouteInfoFormHide = () => {
    this.setState({
      showRouteInfoForm: false,
    });
  }

  handleClose: React.MouseEventHandler<HTMLDivElement> = () => {
    this.props.handleClose();
  }

  completeDutyMission = () => {
    this.updateDutyMission({ status: 'complete' });
  }

  rejectDutyMission = () => {
    this.props.getDutyMissionById(this.props.infoData.duty_mission_data.duty_mission_id)
    .then(({ duty_mission }) => {
      // надо уйти от этого
      // react 16 Portal
      return global.confirmDialog({
        title: <b>{`Введите причину для наряд-задания №${duty_mission.number}`}</b>,
        body: self => (
          <ExtField
            type="string"
            label="Причина"
            value={self.state.comment}
            onChange={({ target: { value: comment } }) => self.setState({ comment })}
          />
        ),
        defaultState: {
          comment: '',
        },
        checkOnOk: ({ state }) => {
          if (!state.comment) {
            global.NOTIFICATION_SYSTEM.notify('Введите причину отмены', 'warning', 'tr');
            return false;
          }
          return true;
        },
      })
      .then(({ comment }) => (
        this.updateDutyMission({
          ...duty_mission,
          status: 'fail',
          comment,
        })
      ))
      .catch(() => {
        //
      });
    }).catch(e => {
      // tslint:disable-next-line
      console.log(e);
    });
  }

  updateDutyMission = (newProps) => (
    (
      newProps.number ?
      Promise.resolve({ duty_mission: newProps })
      :
      this.props.getDutyMissionById(this.props.infoData.duty_mission_data.duty_mission_id)
    )
      .then(({ duty_mission }) => {
        if (duty_mission) {
          this.props.updateDutyMission(
            {
              ...duty_mission,
              ...newProps,
            },
          )
          .then(() => {
            this.refreshCard();
            this.props.handleClose();
          });
        } else {
          console.warn('not found duty mission')
        }
      })
  )

  render() {
    const {
      infoData,
      infoData: {
        duty_mission_data,
        ...route
      }
    } = this.props;

    return (
      <InfoCard title="Карточка наряд-задания" handleClose={this.handleClose}>
        <ul>
          {
            listData.map(({ RenderComponent, ...line}, index) => (
              RenderComponent ?
              (
                <RenderComponent key={line.path.join('/')} {...this.props} />
              )
              :
              (
                <li key={line.path.join('/')}>
                  <b>{`${line.title}: `}</b>
                  <span>{get(infoData, line.path, '---') || '---'}</span>
                </li>
              )
            ))
          }
        </ul>
        <LinkToOpenRouteInfoForm openRouteInfoForm={this.openRouteInfoForm}/>
        <RightButton_BlockContainer>
          <ButtonUpdateDutyMission onClick={this.completeDutyMission} >Выполнено</ButtonUpdateDutyMission>
          <ButtonUpdateDutyMission onClick={this.rejectDutyMission} >Не выполнено</ButtonUpdateDutyMission>
        </RightButton_BlockContainer>
        <RouteInfoForm
          show={this.state.showRouteInfoForm}
          onHide={this.handleRouteInfoFormHide}
          title={`Бригадир ${duty_mission_data.foreman_fio}`}
          route={route}
        />
      </InfoCard>
    )
  }
};

const mapStateToProps = (state) => ({
  infoData: state.dashboard.current_duty_missions.infoData,
});

const mapDispatchToProps = (dispatch) => ({
  handleClose: () => (
    dispatch(
      dashboardLoadMissionDataForCurrentMission(null),
    )
  ),
  loadData: () => (
    dispatch(
      dashboardLoadCurrentDutyMissions(),
    )
  ),
  getDutyMissionById: (id) => (
    dispatch(
      loadDutyMissionById(
        '',
        id,
        {
          promise: true,
          page: 'dashboard',
        },
      ),
    ).payload
  ),
  updateDutyMission: (payload) => (
    dispatch(
      updateDutyMissionByPayload(
        '',
        payload,
        {
          promise: true,
          page: 'dashboard',
        },
      ),
    ).payload
  ),
});

export default hocAll(
  withShowByProps({
    path: ['dashboard', 'current_duty_missions', 'infoData'],
    type: 'none',
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(CurrentMissionInfo);