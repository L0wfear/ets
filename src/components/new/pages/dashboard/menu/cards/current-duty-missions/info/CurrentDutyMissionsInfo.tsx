import * as React from 'react';

import { connect } from 'react-redux';
import { compose } from 'recompose';
import { get } from 'lodash';

import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';
import RouteInfoFormWrap from 'components/new/pages/routes_list/route-info/RouteInfoFormWrap';

import InfoCard from 'components/new/pages/dashboard/menu/cards/_default-card-component/info-card/InfoCard';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { listData } from 'components/new/pages/dashboard/menu/cards/current-duty-missions/info/listData';
import {
  dashboardLoadCurrentDutyMissions,
  dashboardLoadMissionDataForCurrentMission,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';

import { LinkToOpenRouteInfoForm } from 'components/new/pages/routes_list/buttons/buttons';

import {
  RightButtonBlockContainer,
} from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/styled/styled';
import { getDashboardState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import dutyMissionPermissions from 'components/new/pages/missions/duty_mission/_config-data/permissions';

import {
  CurrentDutyMissionsInfoDataType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/current-duty-mission.h';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type StateProps = {
  infoData: CurrentDutyMissionsInfoDataType;
};
type DispatchProps = {
  dispatch: EtsDispatch;
};
type OwnProps = {};
type PropsCurrentMissionInfo = (
  StateProps
  & DispatchProps
  & OwnProps
);
type StateCurrentMissionInfo = {
  showRouteInfoForm: boolean;
  showMissionRejectForm: boolean;
};

class CurrentMissionInfo extends React.Component<PropsCurrentMissionInfo, StateCurrentMissionInfo> {
  state = {
    showRouteInfoForm: false,
    showMissionRejectForm: false,
  };

  refreshCard = () => (
    this.props.dispatch(dashboardLoadCurrentDutyMissions())
  );
  openRouteInfoForm = () => {
    this.setState({
      showRouteInfoForm: true,
    });
  };
  handleRouteInfoFormHide = () => {
    this.setState({
      showRouteInfoForm: false,
    });
  };

  handleClose = () => {
    this.props.dispatch(
      dashboardLoadMissionDataForCurrentMission(null),
    );
  };

  completeDutyMission = () => {
    this.updateDutyMission({ status: 'complete' });
  };

  rejectDutyMission = () => {
    this.props.dispatch(
      missionsActions.actionGetDutyMissionById(
        this.props.infoData.duty_mission_data.duty_mission_id,
        { page: 'dashboard' },
      ),
    ).then((duty_mission) => {
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
      console.info(e); // eslint-disable-line
    });
  };

  updateDutyMission = (newProps) => (
    (
      newProps.number
        ? Promise.resolve(newProps)
        : this.props.dispatch(
          missionsActions.actionGetDutyMissionById(
            this.props.infoData.duty_mission_data.duty_mission_id,
            { page: 'dashboard' },
          ),
        )
    ).then((duty_mission) => {
      if (duty_mission) {
        this.props.dispatch(
          missionsActions.actionUpdateDutyMission(
            {
              ...duty_mission,
              ...newProps,
            },
            { page: 'dashboard' },
          ),
        ).then(() => {
          this.refreshCard();
          this.handleClose();
        });
      } else {
        // tslint:disable-next-line
        console.warn('not found duty mission');
      }
    })
  );

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
              RenderComponent
                ? (
                  <RenderComponent key={line.path.join('/')} {...this.props} />
                )
                :              (
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
          <EtsBootstrap.Button onClick={this.completeDutyMission} permissions={dutyMissionPermissions.update}>Выполнено</EtsBootstrap.Button>
          <EtsBootstrap.Button onClick={this.rejectDutyMission} permissions={dutyMissionPermissions.update}>Не выполнено</EtsBootstrap.Button>
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
  connect<StateProps, DispatchProps, OwnProps, ReduxState>(
    (state) => ({
      infoData: getDashboardState(state).current_duty_missions.infoData,
    }),
  ),
)(CurrentMissionInfo);
