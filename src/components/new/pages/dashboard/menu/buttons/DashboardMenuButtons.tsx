import * as React from 'react';
import { connect, HandleThunkActionCreator } from 'react-redux';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import WaybillFormWrapTSX from 'components/waybill/WaybillFormWrap';

import {
  dashboardLoadDependentDataByWaybillDraft,
  dashboardLoadDependentDataByNewMission,
  dashboardLoadDependentDataByNewDutyMission,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';

import { LinkToOrder } from 'components/directories/order/buttons/buttons';
import { ButtonCreateMission } from 'components/new/pages/missions/mission/buttons/buttons';
import { ButtonCreateWaybill } from 'components/waybill/buttons/buttons';

import {
  DashboardMenuButtonsContainer,
  CardTitleContainer,
  CardBodyContainer,
} from 'components/new/pages/dashboard/menu/buttons/styled/styled';
import { CardContainer } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/styled/styled';
import { ReduxState } from 'redux-main/@types/state';
import DutyMissionFormLazy from 'components/new/pages/missions/duty_mission/form/main';
import MissionFormLazy from 'components/new/pages/missions/mission/form/main';
import { ButtonCreateDutyMission } from 'components/new/pages/missions/duty_mission/buttons/buttons';

const WaybillFormWrap: any = WaybillFormWrapTSX;

export type StatePropsDashboardMenuButtons = {};

export type DispatchPropsDashboardMenuButtons = {
  dashboardLoadDependentDataByWaybillDraft: HandleThunkActionCreator<typeof dashboardLoadDependentDataByWaybillDraft>;
  dashboardLoadDependentDataByNewMission: HandleThunkActionCreator<typeof dashboardLoadDependentDataByNewMission>;
  dashboardLoadDependentDataByNewDutyMission: HandleThunkActionCreator<typeof dashboardLoadDependentDataByNewDutyMission>;
};

export type OwnerPropsDashboardMenuButtons = {
  page: string;
};

export type PropsDashboardMenuButtons = (
  StatePropsDashboardMenuButtons
  & DispatchPropsDashboardMenuButtons
  & OwnerPropsDashboardMenuButtons
);

const DashboardMenuButtons: React.FC<PropsDashboardMenuButtons> = React.memo(
  (props) => {
    const [showWaybillForm, setShowWaybillForm] = React.useState(false);
    const [showMissionForm, setShowMissionForm] = React.useState(false);
    const [showDutyMissionForm, setShowDutyMissionForm] = React.useState(false);

    const handleFormHideWaybillForm = React.useCallback(
      (isSubmitted) => {
        props.dashboardLoadDependentDataByWaybillDraft();
        setShowWaybillForm(false);
      },
      [],
    );
    const handleFormHideMissionForm = React.useCallback(
      (isSubmitted) => {
        if (isSubmitted) {
          props.dashboardLoadDependentDataByNewMission();
        }
        setShowMissionForm(false);
      },
      [],
    );
    const handleFormHideDutyMissionForm = React.useCallback(
      (isSubmitted) => {
        if (isSubmitted) {
          props.dashboardLoadDependentDataByNewDutyMission();
        }
        setShowDutyMissionForm(false);
      },
      [],
    );

    return (
      <DashboardMenuButtonsContainer>
        <CardContainer>
          <CardTitleContainer>Управление</CardTitleContainer>
          <CardBodyContainer>
            <ButtonCreateWaybill onClick={setShowWaybillForm}>
              Создать путевой лист
            </ButtonCreateWaybill>
            <LinkToOrder to="/orders">
              <EtsBootstrap.Button active>Исполнение централизованного задания</EtsBootstrap.Button>
            </LinkToOrder>
            <ButtonCreateMission onClick={setShowMissionForm}>
              Создать децентрализованное задание
            </ButtonCreateMission>
            <ButtonCreateDutyMission onClick={setShowDutyMissionForm}>
              Создать наряд-задание
            </ButtonCreateDutyMission>
          </CardBodyContainer>
        </CardContainer>
        {
          showWaybillForm
            && (
              <WaybillFormWrap
                onFormHide={handleFormHideWaybillForm}
                onCallback={handleFormHideWaybillForm}
                element={null}
              />
            )
        }
        <MissionFormLazy
          onFormHide={handleFormHideMissionForm}
          showForm={showMissionForm}
          element={null}
          page={props.page}
        />
        <DutyMissionFormLazy
          onFormHide={handleFormHideDutyMissionForm}
          showForm={showDutyMissionForm}
          element={null}
          page={props.page}
        />
      </DashboardMenuButtonsContainer>
    );
  },
);

export default connect<StatePropsDashboardMenuButtons, DispatchPropsDashboardMenuButtons, OwnerPropsDashboardMenuButtons, ReduxState>(
  null,
  (dispatch) => ({
    dashboardLoadDependentDataByWaybillDraft: () =>
      dispatch(dashboardLoadDependentDataByWaybillDraft()),
    dashboardLoadDependentDataByNewMission: () =>
      dispatch(dashboardLoadDependentDataByNewMission()),
    dashboardLoadDependentDataByNewDutyMission: () =>
      dispatch(dashboardLoadDependentDataByNewDutyMission()),
  }),
)(DashboardMenuButtons);
