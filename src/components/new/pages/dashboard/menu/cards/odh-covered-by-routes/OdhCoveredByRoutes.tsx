import * as React from 'react';
import { connect } from 'react-redux';
import withDefaultCard, { PropsToDefaultCard } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';

import CollapseButton from 'components/old/ui/collapse/button/CollapseButton';
import List from 'components/new/pages/dashboard/menu/cards/odh-covered-by-routes/list/List';

import {
  dashboardLoadOdhCoveredByRoutes,
  dashboardSetInfoDataInOdhCoveredByRoutes,
 } from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';
import OdhCoveredByRoutesInfo from 'components/new/pages/dashboard/menu/cards/odh-covered-by-routes/info/OdhCoveredByRoutesInfo';

import {
  PropsOdhCoveredByRoutes,
  StateOdhCoveredByRoutes,
  StatePropsOdhCoveredByRoutes,
  DispatchPropsOdhCoveredByRoutes,
  OwnPropsOdhCoveredByRoutes,
} from 'components/new/pages/dashboard/menu/cards/odh-covered-by-routes/OdhCoveredByRoutes.h';

import {
  DivNone,
} from 'global-styled/global-styled';
import { compose } from 'recompose';
import { getDashboardState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';

class OdhCoveredByRoutes extends React.Component<PropsOdhCoveredByRoutes, StateOdhCoveredByRoutes> {
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

export default compose<PropsOdhCoveredByRoutes, PropsToDefaultCard>(
  withDefaultCard({
    path: 'odh_covered_by_routes',
    loadData: dashboardLoadOdhCoveredByRoutes,
    InfoComponent: OdhCoveredByRoutesInfo,
  }),
  connect<StatePropsOdhCoveredByRoutes, DispatchPropsOdhCoveredByRoutes, OwnPropsOdhCoveredByRoutes, ReduxState>(
    (state) => ({
      items: getDashboardState(state).odh_covered_by_routes.data.items,
    }),
    (dispatch) => ({
      setInfoData: (infoData) => (
        dispatch(
          dashboardSetInfoDataInOdhCoveredByRoutes(infoData),
        )
      ),
    }),
  ),
)(OdhCoveredByRoutes);
