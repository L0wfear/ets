import * as React from 'react';
import { connect } from 'react-redux';
import withDefaultCard, { PropsToDefaultCard } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';

import CollapseButton from 'components/old/ui/collapse/button/CollapseButton';

import List from 'components/new/pages/dashboard/menu/cards/odh-not-covered-by-routes/list/List';
import {
  dashboardLoadOdhNotCoveredByRoutes,
  dashboardSetInfoDataInOdhNotCoveredByRoutes,
 } from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';
import OdhNotCoveredByRoutesInfo from 'components/new/pages/dashboard/menu/cards/odh-not-covered-by-routes/info/OdhNotCoveredByRoutesInfo';

import {
  PropsOdhNotCoveredByRoutes,
  StateOdhNotCoveredByRoutes,
} from 'components/new/pages/dashboard/menu/cards/odh-not-covered-by-routes/OdhNotCoveredByRoutes.h';

import {
  DivNone,
} from 'global-styled/global-styled';
import { compose } from 'recompose';
import { getDashboardState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';

class OdhNotCoveredByRoutes extends React.Component<PropsOdhNotCoveredByRoutes, StateOdhNotCoveredByRoutes> {
  handleClickMission: any = ({ currentTarget: { dataset: { path } } }) => {
    const index = Number.parseInt((path as string).split('/').slice(-1)[0], 0);

    this.props.setInfoData(this.props.items[index]);
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

export default compose<PropsOdhNotCoveredByRoutes, PropsToDefaultCard>(
  withDefaultCard({
    path: 'odh_not_covered_by_routes',
    loadData: dashboardLoadOdhNotCoveredByRoutes,
    InfoComponent: OdhNotCoveredByRoutesInfo,
  }),
  connect<any, any, any, ReduxState>(
    (state) => ({
      items: getDashboardState(state).odh_not_covered_by_routes.data.items,
    }),
    (dispatch) => ({
      loadData: () => (
        dispatch(
          dashboardLoadOdhNotCoveredByRoutes(),
        )
      ),
      setInfoData: (infoData) => (
        dispatch(
          dashboardSetInfoDataInOdhNotCoveredByRoutes(infoData),
        )
      ),
    }),
  ),
)(OdhNotCoveredByRoutes);
