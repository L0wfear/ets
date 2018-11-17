import * as React from 'react';

import withDefaultCard from 'components/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';
import { connect } from 'react-redux';

import CollapseButton from 'components/ui/collapse/button/CollapseButton';

import List from 'components/dashboard/menu/cards/odh-not-covered-by-missions-of-current-shift/list/List';
import {
  dashboardLoadOdhNotCoveredByMissionsOfCurrentShift,
  dashboardSetInfoDataInOdhNotCoveredByMissionsOfCurrentShift,
 } from 'components/dashboard/redux-main/modules/dashboard/actions-dashboard';
import OdhNotCoveredByMissionsOfCurrentShiftInfo from 'components/dashboard/menu/cards/odh-not-covered-by-missions-of-current-shift/info/OdhNotCoveredByMissionsOfCurrentShiftInfo';

import {
  PropsOdhNotCoveredByMissionsOfCurrentShift,
  StateOdhNotCoveredByMissionsOfCurrentShift,
} from 'components/dashboard/menu/cards/odh-not-covered-by-missions-of-current-shift/OdhNotCoveredByMissionsOfCurrentShift.h';

import {
  DivNone,
} from 'global-styled/global-styled';

class OdhNotCoveredByMissionsOfCurrentShift extends React.Component<PropsOdhNotCoveredByMissionsOfCurrentShift, StateOdhNotCoveredByMissionsOfCurrentShift> {
  handleClickMission: React.MouseEventHandler<HTMLLIElement> = ({ currentTarget: { dataset: { path } } }) => {
    this.props.setInfoData(
      this.props.items[
        path.split('/').slice(-1)[0]
      ],
    );
  }

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
            <CollapseButton >
              <List items={collapsetItems} handleClick={this.handleClickMission} classNameContainer="line_data" />
            </CollapseButton>
          )
          :
          (
            <DivNone />
          )
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  items: state.dashboard.odh_not_covered_by_missions_of_current_shift.data.items,
});

const mapDispatchToProps = (dispatch) => ({
  setInfoData: (infoData) => (
    dispatch(
      dashboardSetInfoDataInOdhNotCoveredByMissionsOfCurrentShift(infoData),
    )
  ),
});

export default withDefaultCard({
  path: 'odh_not_covered_by_missions_of_current_shift',
  loadData: dashboardLoadOdhNotCoveredByMissionsOfCurrentShift,
  InfoComponent: OdhNotCoveredByMissionsOfCurrentShiftInfo,
})(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(OdhNotCoveredByMissionsOfCurrentShift),
);
