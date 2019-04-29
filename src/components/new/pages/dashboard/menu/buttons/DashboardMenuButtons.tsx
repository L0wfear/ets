import * as React from 'react';
import { connect } from 'react-redux';
import * as Button from 'react-bootstrap/lib/Button';

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
import {
  StatePropsDashboardMenuButtons,
  DispatchPropsDashboardMenuButtons,
  OwnerPropsDashboardMenuButtons,
  PropsDashboardMenuButtons,
  StateDashboardMenuButtons,
} from 'components/new/pages/dashboard/menu/buttons/DashboardMenuButtons.h';
import DutyMissionFormLazy from 'components/new/pages/missions/duty_mission/form/main';
import MissionFormLazy from 'components/new/pages/missions/mission/form/main';
import { ButtonCreateDutyMission } from 'components/new/pages/missions/duty_mission/buttons/buttons';

const WaybillFormWrap: any = WaybillFormWrapTSX;

class DashboardMenuButtons extends React.Component<PropsDashboardMenuButtons, StateDashboardMenuButtons> {
  state = {
    showWaybillForm: false,
    showMissionForm: false,
    showDutyMissionForm: false,
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

  showWaybillForm = () => {
    this.setState({ showWaybillForm: true });
  };

  handleFormHideWaybillForm = (newState) => {
    this.props.loadDataAfterCreateWaybill();
    this.setState({
      showWaybillForm: false,
      ...newState,
    });
  };

  showMissionForm = () => {
    this.setState({ showMissionForm: true });
  };

  handleFormHideMissionForm = (isSubmitted) => {
    if (isSubmitted) {
      this.props.loadDataAfterCreateMission();
    }
    this.setState({ showMissionForm: false });
  };

  showDutyMissionForm = () => {
    this.setState({ showDutyMissionForm: true });
  };

  handleFormHideDutyMissionForm = (isSubmitted) => {
    if (isSubmitted) {
      this.props.loadDataAfterCreateDutyMission();
    }
    this.setState({ showDutyMissionForm: false });
  };

  render() {
    return (
      <DashboardMenuButtonsContainer>
        <CardContainer>
          <CardTitleContainer>Управление</CardTitleContainer>
          <CardBodyContainer>
            <ButtonCreateWaybill onClick={this.showWaybillForm}>
              Создать путевой лист
            </ButtonCreateWaybill>
            <LinkToOrder to="/orders">
              <Button active>Исполнение централизованного задания</Button>
            </LinkToOrder>
            <ButtonCreateMission onClick={this.showMissionForm}>
              Создать децентрализованное задание
            </ButtonCreateMission>
            <ButtonCreateDutyMission onClick={this.showDutyMissionForm}>
              Создать наряд-задание
            </ButtonCreateDutyMission>
          </CardBodyContainer>
        </CardContainer>
        {
          this.state.showWaybillForm
            && (
              <WaybillFormWrap
                onFormHide={this.handleFormHideWaybillForm}
                onCallback={this.handleFormHideWaybillForm}
                element={null}
              />
            )
        }
        <MissionFormLazy
          onFormHide={this.handleFormHideMissionForm}
          showForm={this.state.showMissionForm}
          element={null}
          page={'dashboard'}
        />
        <DutyMissionFormLazy
          onFormHide={this.handleFormHideDutyMissionForm}
          showForm={this.state.showDutyMissionForm}
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
