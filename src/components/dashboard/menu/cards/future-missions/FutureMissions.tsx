import * as React from 'react';

import withDefaultCard from 'components/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';
import { connect } from 'react-redux';

import ListByTypeFutureMission from 'components/dashboard/menu/cards/future-missions/list/ListByTypeFutureMission';

import { dashboardLoadFutureMissions } from 'components/dashboard/redux-main/modules/dashboard/actions-dashboard';
import { PermittedMissionFormWrap } from 'components/missions/mission/buttons/buttons';
import { loadMissionById } from 'redux-main/trash-actions/mission';

import {
  PropsFutureMissions,
  StateFutureMissions,
  StatePropsFutureMissions,
  DispatchPropsFutureMissions,
  OwnPropsFutureMissions,
} from 'components/dashboard/menu/cards/future-missions/FutureMissions.h';
import { ReduxState } from 'redux-main/@types/state';
import { compose } from 'recompose';
import { PropsToDefaultCard } from 'components/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard.h';

class FutureMissions extends React.Component<PropsFutureMissions, StateFutureMissions> {
  state = {
    showMissionFormWrap: false,
    elementMissionFormWrap: null,
  };

  handleClick = (id: number) => {
    this.props.getMissionById(id).then(({ payload: { mission } }) => {
      if (mission) {
        this.setState({
          showMissionFormWrap: true,
          elementMissionFormWrap: mission,
        });
      }
    });
  }

  handleFormHide = () => (
    this.setState({
      showMissionFormWrap: false,
      elementMissionFormWrap: null,
    })
  )

  render() {
    return (
      <div>
        <ListByTypeFutureMission titleKey="title_centralized" itemsKey="items_centralized" handleClick={this.handleClick} />
        <ListByTypeFutureMission titleKey="title_decentralized" itemsKey="items_decentralized" handleClick={this.handleClick} />
        <PermittedMissionFormWrap
          onFormHide={this.handleFormHide}
          showForm={this.state.showMissionFormWrap}
          element={this.state.elementMissionFormWrap}
          fromDashboard
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
    (dispatch) => ({
      getMissionById: (id) => (
        dispatch(
          loadMissionById(
            'none',
            id,
            {
              promise: true,
              page: 'dashboard',
            },
          ),
        )
      ),
    }),
  ),
)(FutureMissions);
