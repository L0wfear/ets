import * as React from 'react';
import { path } from 'components/new/pages/nsi/order/_config-data';

import EtsBootstrap from 'components/new/ui/@bootstrap';

import WaybillFormWrapTSX from 'components/old/waybill/WaybillFormWrap';

import {
  dashboardLoadDependentDataByWaybillDraft,
  dashboardLoadDependentDataByNewMission,
  dashboardLoadDependentDataByNewDutyMission,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';

import {
  DashboardMenuButtonsContainer,
  CardTitleContainer,
  CardBodyContainer,
} from 'components/new/pages/dashboard/menu/buttons/styled/styled';
import DutyMissionFormLazy from 'components/new/pages/missions/duty_mission/form/main';
import MissionFormLazy from 'components/new/pages/missions/mission/form/main';
import { LinkToOrder } from 'components/new/pages/nsi/order/_config-data/buttons';
import dutyMissionPermissions from 'components/new/pages/missions/duty_mission/_config-data/permissions';
import missionPermissions from 'components/new/pages/missions/mission/_config-data/permissions';
import waybillPermissions from 'components/new/pages/waybill/_config-data/permissions';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

const WaybillFormWrap: any = WaybillFormWrapTSX;

export type OwpProps = {
  page: string;
};

export type Props = OwpProps & {};

const DashboardMenuButtons: React.FC<Props> = React.memo(
  (props) => {
    const [showWaybillForm, setShowWaybillForm] = React.useState(false);
    const [showMissionForm, setShowMissionForm] = React.useState(false);
    const [showDutyMissionForm, setShowDutyMissionForm] = React.useState(false);

    const dispatch = etsUseDispatch();

    const handleFormHideWaybillForm = React.useCallback(
      () => {
        dispatch(
          dashboardLoadDependentDataByWaybillDraft(),
        );
        setShowWaybillForm(false);
      },
      [],
    );
    const handleFormHideMissionForm = React.useCallback(
      (isSubmitted) => {
        if (isSubmitted) {
          dispatch(
            dashboardLoadDependentDataByNewMission(),
          );
        }
        setShowMissionForm(false);
      },
      [],
    );
    const handleFormHideDutyMissionForm = React.useCallback(
      (isSubmitted) => {
        if (isSubmitted) {
          dispatch(
            dashboardLoadDependentDataByNewDutyMission(),
          );
        }
        setShowDutyMissionForm(false);
      },
      [],
    );

    return (
      <DashboardMenuButtonsContainer>
        <EtsBootstrap.DashboardCard block>
          <CardTitleContainer>Управление</CardTitleContainer>
          <CardBodyContainer>
            <EtsBootstrap.Button id="dashboard.create_waybill" whiteSpace="normal" onClick={setShowWaybillForm} permissions={waybillPermissions.create}>
              Создать путевой лист
            </EtsBootstrap.Button>
            <LinkToOrder to={path}>
              <EtsBootstrap.Button id="dashboard.link_to_order" whiteSpace="normal" active>Исполнение централизованного задания</EtsBootstrap.Button>
            </LinkToOrder>
            <EtsBootstrap.Button id="dashboard.create_mission" whiteSpace="normal" onClick={setShowMissionForm} permissions={missionPermissions.create}>
              Создать децентрализованное задание
            </EtsBootstrap.Button>
            <EtsBootstrap.Button id="dashboard.create_duty_mission" whiteSpace="normal" onClick={setShowDutyMissionForm} permissions={dutyMissionPermissions.create}>
              Создать наряд-задание
            </EtsBootstrap.Button>
          </CardBodyContainer>
        </EtsBootstrap.DashboardCard>
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
          handleHide={handleFormHideMissionForm}
          showForm={showMissionForm}
          element={null}
          registryKey="mainpage"
          page={props.page}
          path="mission"
          type={null}
        />
        <DutyMissionFormLazy
          handleHide={handleFormHideDutyMissionForm}
          showForm={showDutyMissionForm}
          element={null}
          page={props.page}

          type={null}
          registryKey={props.page}
          path="duty_mission_form"
        />
      </DashboardMenuButtonsContainer>
    );
  },
);

export default DashboardMenuButtons;
