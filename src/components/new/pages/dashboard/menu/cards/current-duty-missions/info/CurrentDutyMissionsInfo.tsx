import * as React from 'react';

import { connect } from 'react-redux';
import { compose } from 'recompose';
import { get } from 'lodash';

import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';
import RouteInfoFormWrap from 'components/new/pages/routes_list/route-info/RouteInfoFormWrap';

import InfoCard from 'components/new/pages/dashboard/menu/cards/_default-card-component/info-card/InfoCard';
import { ExtField } from 'components/ui/new/field/ExtField';
import { listData } from 'components/new/pages/dashboard/menu/cards/current-duty-missions/info/listData';
import {
  dashboardLoadCurrentDutyMissions,
  dashboardLoadMissionDataForCurrentMission,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';

import {
  loadDutyMissionById,
  updateDutyMissionByPayload,
} from 'redux-main/trash-actions/mission';
import { ButtonUpdateDutyMission } from 'components/missions/duty_mission/buttons/buttons';
import { LinkToOpenRouteInfoForm } from 'components/new/pages/routes_list/buttons/buttons';

import {
  PropsCurrentMissionInfo,
  StateCurrentMissionInfo,
} from 'components/new/pages/dashboard/menu/cards/current-duty-missions/info/@types/CurrentDutyMissionsInfo.h';
import {
  RightButtonBlockContainer,
} from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/styled/styled';
import { getDashboardState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';

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
      .then(({ payload: { duty_mission } }) => {
        // надо уйти от этого
        // react 16 Portal
        return global.confirmDialog({
          title: <b>{`Введите причину для наряд-задания №${duty_mission.number}`}</b>,
          body: (self) => (
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
      }).catch((e) => {
        // tslint:disable-next-line
        console.log(e);
      });
  }

  updateDutyMission = (newProps) => (
    (
      newProps.number ?
      Promise.resolve({ payload: { duty_mission: newProps } })
      :
      this.props.getDutyMissionById(this.props.infoData.duty_mission_data.duty_mission_id)
    )
      .then(({ payload: { duty_mission } }) => {
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
          // tslint:disable-next-line
          console.warn('not found duty mission');
        }
      })
  )

  render() {
    const {
      infoData,
      infoData: {
        duty_mission_data,
        ...route
      },
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
        <RightButtonBlockContainer>
          <ButtonUpdateDutyMission onClick={this.completeDutyMission} >Выполнено</ButtonUpdateDutyMission>
          <ButtonUpdateDutyMission onClick={this.rejectDutyMission} >Не выполнено</ButtonUpdateDutyMission>
        </RightButtonBlockContainer>
        <RouteInfoFormWrap
          showForm={this.state.showRouteInfoForm}
          onHide={this.handleRouteInfoFormHide}
          title={`Бригадир ${duty_mission_data.foreman_fio}`}
          route={route}
          mapKey="mapCurrentMissionInfo"
        />
      </InfoCard>
    );
  }
}

export default compose<any, any>(
  withShowByProps({
    path: ['dashboard', 'current_duty_missions', 'infoData'],
    type: 'none',
  }),
  connect<any, any, any, ReduxState>(
    (state) => ({
      infoData: getDashboardState(state).current_duty_missions.infoData,
    }),
    (dispatch) => ({
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
            'none',
            id,
            {
              promise: true,
              page: 'dashboard',
            },
          ),
        )
      ),
      updateDutyMission: (payload) => (
        dispatch(
          updateDutyMissionByPayload(
            'none',
            payload,
            {
              promise: true,
              page: 'dashboard',
            },
          ),
        )
      ),
    }),
  ),
)(CurrentMissionInfo);
