import * as React from 'react';

import withDefaultCard from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';
import { connect } from 'react-redux';

import ListByTypeFutureMission from 'components/new/pages/dashboard/menu/cards/future-missions/list/ListByTypeFutureMission';

import { dashboardLoadFutureMissions } from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';
import { PermittedMissionFormLazy } from 'components/new/pages/missions/mission/buttons/buttons';

import {
  PropsFutureMissions,
  StateFutureMissions,
  StatePropsFutureMissions,
  DispatchPropsFutureMissions,
  OwnPropsFutureMissions,
} from 'components/new/pages/dashboard/menu/cards/future-missions/FutureMissions.h';
import { ReduxState } from 'redux-main/@types/state';
import { compose } from 'recompose';
import { PropsToDefaultCard } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard.h';
import missionsActions from 'redux-main/reducers/modules/missions/actions';

class FutureMissions extends React.Component<PropsFutureMissions, StateFutureMissions> {
  state = {
    showMissionForm: false,
    elementMissionForm: null,
  };

  handleClick = async (id: number) => {
    let mission = null;
    try {
      mission = await this.props.actionGetMissionById(
        id,
        {
          page: 'dashboard',
        },
      );
    } catch (error) {
      console.error(error); // tslint:disable-line
    }
    if (mission) {
      this.setState({
        showMissionForm: true,
        elementMissionForm: mission,
      });
    }
  }

  handleFormHide = () => (
    this.setState({
      showMissionForm: false,
      elementMissionForm: null,
    })
  )

  render() {
    return (
      <div>
        <ListByTypeFutureMission titleKey="title_centralized" itemsKey="items_centralized" handleClick={this.handleClick} />
        <ListByTypeFutureMission titleKey="title_decentralized" itemsKey="items_decentralized" handleClick={this.handleClick} />
        <PermittedMissionFormLazy
          onFormHide={this.handleFormHide}
          showForm={this.state.showMissionForm}
          element={this.state.elementMissionForm}
        />
      </div>
    );
  }
}

export default compose<PropsFutureMissions, PropsToDefaultCard>(
  withDefaultCard({
    path: 'future_missions',
    loadData: dashboardLoadFutureMissions,
  }),
  connect<StatePropsFutureMissions, DispatchPropsFutureMissions, OwnPropsFutureMissions, ReduxState>(
    null,
    (dispatch: any) => ({
      actionGetMissionById: (...arg) => (
        dispatch(
          missionsActions.actionGetMissionById(...arg),
        )
      ),
    }),
  ),
)(FutureMissions);
