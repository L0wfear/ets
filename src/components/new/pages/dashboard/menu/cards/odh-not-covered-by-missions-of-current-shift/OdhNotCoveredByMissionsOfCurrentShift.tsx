import * as React from 'react';

import withDefaultCard from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';
import { connect } from 'react-redux';

import CollapseButton from 'components/old/ui/collapse/button/CollapseButton';

import List from 'components/new/pages/dashboard/menu/cards/odh-not-covered-by-missions-of-current-shift/list/List';
import {
  dashboardLoadOdhNotCoveredByMissionsOfCurrentShift,
  dashboardSetInfoDataInOdhNotCoveredByMissionsOfCurrentShift,
 } from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';
import OdhNotCoveredByMissionsOfCurrentShiftInfo from 'components/new/pages/dashboard/menu/cards/odh-not-covered-by-missions-of-current-shift/info/OdhNotCoveredByMissionsOfCurrentShiftInfo';

import {
  PropsOdhNotCoveredByMissionsOfCurrentShift,
  StateOdhNotCoveredByMissionsOfCurrentShift,
} from 'components/new/pages/dashboard/menu/cards/odh-not-covered-by-missions-of-current-shift/OdhNotCoveredByMissionsOfCurrentShift.h';

import {
  DivNone,
} from 'global-styled/global-styled';
import { compose } from 'recompose';
import { getDashboardState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { PropsToDefaultCard } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard.h';

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
    const counttoFirstShow = 2;

    const firstTwoItem = items.slice(0, counttoFirstShow);
    const collapsetItems = items.slice(counttoFirstShow);

    return (
      <div>
        <List items={firstTwoItem} handleClick={this.handleClickMission} addIndex={0}  classNameContainer="line_data" />
        {
          collapsetItems.length ?
          (
            <CollapseButton>
              <List items={collapsetItems} handleClick={this.handleClickMission} addIndex={counttoFirstShow}  classNameContainer="line_data" />
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

export default compose<PropsOdhNotCoveredByMissionsOfCurrentShift, PropsToDefaultCard>(
  withDefaultCard({
    path: 'odh_not_covered_by_missions_of_current_shift',
    loadData: dashboardLoadOdhNotCoveredByMissionsOfCurrentShift,
    InfoComponent: OdhNotCoveredByMissionsOfCurrentShiftInfo,
  }),
  connect<any, any, any, ReduxState>(
    (state) => ({
      items: getDashboardState(state).odh_not_covered_by_missions_of_current_shift.data.items,
    }),
    (dispatch) => ({
      setInfoData: (infoData) => (
        dispatch(
          dashboardSetInfoDataInOdhNotCoveredByMissionsOfCurrentShift(infoData),
        )
      ),
    }),
  ),
)(OdhNotCoveredByMissionsOfCurrentShift);
