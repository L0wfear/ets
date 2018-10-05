import * as React from 'react';
import { connect } from 'react-redux';
import withDefaultCard from 'components/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';

import CollapseButton from 'components/ui/collapse/button/CollapseButton';
import CollapseList from 'components/dashboard/menu/cards/current-missions/collapse-list/CollapseList';

import CurrentMissionInfo from 'components/dashboard/menu/cards/current-missions/info/CurrentMissionInfo';
import {
  dashboardLoadCurrentMissions,
  dashboardLoadMissionDataForCurrentMission,
} from 'components/dashboard/redux/modules/dashboard/actions-dashboard';

import {
  PropsCurrentMissions,
} from 'components/dashboard/menu/cards/current-missions/CurrentMissions.h';

class CurrentMissions extends React.Component<PropsCurrentMissions, {}> {
  handleClick: React.MouseEventHandler<HTMLLIElement> = ({ currentTarget: { dataset: { path } } }) => {
    const id = Number.parseInt((path as string).split('/').slice(-1)[0])

    this.props.loadMissionDataById(id);
  }

  render() {
    const { items } = this.props;

    const firstTwoItem = items.slice(0, 2);
    const collapsetItems = items.slice(2);

    return (
      <div>
        <CollapseList collapsetItems={firstTwoItem} handleClick={this.handleClick} classNameContainer="line_data" />
        { 
          collapsetItems.length ? 
          (
            <CollapseButton dependentData={collapsetItems}>
              <CollapseList collapsetItems={collapsetItems} handleClick={this.handleClick} classNameContainer="line_data" />
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
  items: state.dashboard.current_missions.data.items,
});

const mapDispatchToProps = (dispatch) => ({
  loadMissionDataById: (id) => (
    dispatch(
      dashboardLoadMissionDataForCurrentMission(id),
    )
  ),
});

export default withDefaultCard({
  path: 'current_missions',
  loadData: dashboardLoadCurrentMissions,
  InfoComponent: CurrentMissionInfo,
})(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(CurrentMissions)
);