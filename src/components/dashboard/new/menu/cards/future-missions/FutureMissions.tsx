import * as React from 'react';

import withDefaultCard from 'components/dashboard/new/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';
import { connect } from 'react-redux';

import CollapseButton from 'components/ui/collapse/button/CollapseButton';

import List from 'components/dashboard/new/menu/cards/future-missions/list/List';
import { dashboardLoadFutureMissions } from 'components/dashboard/new/redux/modules/dashboard/actions-dashboard';
import { PermittedMissionFormWrap } from 'components/missions/mission/buttons/buttons';
import { loadMissionById } from 'redux/trash-actions/mission';

import {
  PropsFutureMissions,
  StateFutureMissions,
} from 'components/dashboard/new/menu/cards/future-missions/FutureMissions.h';

class FutureMissions extends React.Component<PropsFutureMissions, StateFutureMissions> {
  state = {
    showMissionFormWrap: false,
    elementMissionFormWrap: null,
  }

  handleClickMission: React.MouseEventHandler<HTMLLIElement> = ({ currentTarget: { dataset: { path } } }) => {
    const id = Number.parseInt((path as string).split('/').slice(-1)[0])

    this.props.getMissionById(id).then(({ mission }) => {
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
    const { items } = this.props;

    const firstTwoItem = items.slice(0, 2);
    const collapsetItems = items.slice(2);

    return (
      <div>
        <List items={firstTwoItem} handleClick={this.handleClickMission} classNameContainer="line_data" />
        { 
          collapsetItems.length ? 
          (
            <CollapseButton dependentData={collapsetItems}>
              <List items={collapsetItems} handleClick={this.handleClickMission} classNameContainer="line_data" />
            </CollapseButton>
          )
          :
          (
            <div className="none"></div>
          )
        }
        <PermittedMissionFormWrap
          onFormHide={this.handleFormHide}
          showForm={this.state.showMissionFormWrap}
          element={this.state.elementMissionFormWrap}
          fromDashboard
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  items: state.dashboard.future_missions.data.items,
});

const mapDispatchToProps = (dispatch) => ({
  getMissionById: (id) => (
    dispatch(
      loadMissionById(
        '',
        id,
        {
          promise: true,
          page: 'dashboard',
        },
      )
    ).payload
  ),
});

export default withDefaultCard({
  path: 'future_missions',
  loadData: dashboardLoadFutureMissions,
})(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(FutureMissions)
);