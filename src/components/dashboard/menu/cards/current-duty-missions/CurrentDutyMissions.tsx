import * as React from 'react';

import withDefaultCard from 'components/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';
import { connect } from 'react-redux';

import CollapseButton from 'components/ui/collapse/button/CollapseButton';
import CollapseList from 'components/dashboard/menu/cards/current-duty-missions/collapse-list/CollapseList';

import {
  dashboardLoadCurrentDutyMissions,
  dashboardLoadRouteDataForCurrentDutyMissions,
} from 'components/dashboard/redux/modules/dashboard/actions-dashboard';

import CurrentDutyMissionInfo from 'components/dashboard/menu/cards/current-duty-missions/info/CurrentDutyMissionsInfo';

import {
  PropsCurrentDutyMissions,
  StateCurrentDutyMissions,
} from 'components/dashboard/menu/cards/current-duty-missions/CurrentDutyMissions.h';

class CurrentDutyMissions extends React.Component<PropsCurrentDutyMissions, StateCurrentDutyMissions> {
  handleClickMission: React.MouseEventHandler<HTMLLIElement> = ({ currentTarget: { dataset: { path } } }) => {
    const [
      index,
      subItemIndex,
      duty_mission_route_id,
    ] = (path as string).split('/').slice(-3).map((d) => Number.parseInt(d));

    this.props.loadRouteDataById(
      this.props.items[index].subItems[subItemIndex].data,
      duty_mission_route_id,
    );
  }

  render() {
    const { items } = this.props;

    const firstTwoItem = items.slice(0, 2);
    const collapsetItems = items.slice(2);

    return (
      <div>
        <CollapseList collapsetItems={firstTwoItem} handleClickMission={this.handleClickMission} classNameContainer="line_data" />
        { 
          collapsetItems.length ? 
          (
            <CollapseButton dependentData={collapsetItems}>
              <CollapseList collapsetItems={collapsetItems} handleClickMission={this.handleClickMission} classNameContainer="line_data" />
            </CollapseButton>
          )
          :
          (
            <div className="none"></div>
          )
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  items: state.dashboard.current_duty_missions.data.items,
});

const mapDispatchToProps = (dispatch) => ({
  loadRouteDataById: (duty_mission_data, id) => (
    dispatch(
      dashboardLoadRouteDataForCurrentDutyMissions(
        duty_mission_data,
        id,
      ),
    )
  )
});

export default withDefaultCard({
  path: 'current_duty_missions',
  loadData: dashboardLoadCurrentDutyMissions,
  InfoComponent: CurrentDutyMissionInfo,
})(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(CurrentDutyMissions)
);