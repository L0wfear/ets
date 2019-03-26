import * as React from 'react';
import { connect } from 'react-redux';
import * as Button from 'react-bootstrap/lib/Button';

import WaybillFormWrapTSX from 'components/waybill/WaybillFormWrap';
import MissionFormWrap from 'components/missions/mission/MissionFormWrap';

import {
  dashboardLoadDependentDataByWaybillDraft,
  dashboardLoadDependentDataByNewMission,
  dashboardLoadDependentDataByNewDutyMission,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';

import { LinkToOrder } from 'components/directories/order/buttons/buttons';
import { ButtonCreateMission } from 'components/missions/mission/buttons/buttons';
import { ButtonCreateDutyMission } from 'components/missions/duty_mission/buttons/buttons';
import { ButtonCreateWaybill } from 'components/waybill/buttons/buttons';

import {
  DashboardMenuButtonsContainer,
  CardTitleContainer,
  CardBodyContainer,
} from 'components/new/pages/dashboard/menu/buttons/styled/styled';
import { CardContainer } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/styled/styled';
import { ReduxState } from 'redux-main/@types/state';
import {
  StatePropsDashboardMenuButtons,
  DispatchPropsDashboardMenuButtons,
  OwnerPropsDashboardMenuButtons,
  PropsDashboardMenuButtons,
  StateDashboardMenuButtons,
} from 'components/new/pages/dashboard/menu/buttons/DashboardMenuButtons.h';
import DutyMissionFormLazy from 'components/missions/duty_mission/form/main';

const WaybillFormWrap: any = WaybillFormWrapTSX;

class DashboardMenuButtons extends React.Component<
  PropsDashboardMenuButtons,
  StateDashboardMenuButtons
> {
  state = {
    showWaybillFormWrap: false,
    showMissionFormWrap: false,
    showDutyMissionFormWrap: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      Object.entries(nextProps).some(
        ([key, value]) => this.props[key] !== value,
      ) ||
      Object.entries(nextState).some(
        ([key, value]) => this.state[key] !== value,
      )
    );
  }

  showWaybillFormWrap = () => {
    this.setState({ showWaybillFormWrap: true });
  };

  handleFormHideWaybillFormWrap = (newState) => {
    this.props.loadDataAfterCreateWaybill();
    this.setState({
      showWaybillFormWrap: false,
      ...newState,
    });
  };

  showMissionFormWrap = () => {
    this.setState({ showMissionFormWrap: true });
  };

  handleFormHideMissionFormWrap = () => {
    this.props.loadDataAfterCreateMission();
    this.setState({ showMissionFormWrap: false });
  };

  showDutyMissionFormWrap = () => {
    this.setState({ showDutyMissionFormWrap: true });
  };

  handleFormHideDutyMissionFormWrap = (isSubmitted) => {
    if (isSubmitted) {
      this.props.loadDataAfterCreateDutyMission();
    }
    this.setState({ showDutyMissionFormWrap: false });
  };

  render() {
    return (
      <DashboardMenuButtonsContainer>
        <CardContainer>
          <CardTitleContainer>Управление</CardTitleContainer>
          <CardBodyContainer>
            <ButtonCreateWaybill onClick={this.showWaybillFormWrap}>
              Создать путевой лист
            </ButtonCreateWaybill>
            <LinkToOrder to="/orders">
              <Button active>Исполнение централизованного задания</Button>
            </LinkToOrder>
            <ButtonCreateMission onClick={this.showMissionFormWrap}>
              Создать децентрализованное задание
            </ButtonCreateMission>
            <ButtonCreateDutyMission onClick={this.showDutyMissionFormWrap}>
              Создать наряд-задание
            </ButtonCreateDutyMission>
          </CardBodyContainer>
        </CardContainer>
        <WaybillFormWrap
          onFormHide={this.handleFormHideWaybillFormWrap}
          onCallback={this.handleFormHideWaybillFormWrap}
          showForm={this.state.showWaybillFormWrap}
          element={null}
          entity={'waybill'}
          fromDashboard
        />
        <MissionFormWrap
          onFormHide={this.handleFormHideMissionFormWrap}
          showForm={this.state.showMissionFormWrap}
          fromDashboard
          element={null}
          deepLvl={1}
        />
        <DutyMissionFormLazy
          onFormHide={this.handleFormHideDutyMissionFormWrap}
          showForm={this.state.showDutyMissionFormWrap}
          element={null}
          page="dashboarc"
        />
      </DashboardMenuButtonsContainer>
    );
  }
}

export default connect<
  StatePropsDashboardMenuButtons,
  DispatchPropsDashboardMenuButtons,
  OwnerPropsDashboardMenuButtons,
  ReduxState
>(
  null,
  (dispatch) => ({
    loadDataAfterCreateWaybill: () =>
      dispatch(dashboardLoadDependentDataByWaybillDraft()),
    loadDataAfterCreateMission: () =>
      dispatch(dashboardLoadDependentDataByNewMission()),
    loadDataAfterCreateDutyMission: () =>
      dispatch(dashboardLoadDependentDataByNewDutyMission()),
  }),
)(DashboardMenuButtons);
