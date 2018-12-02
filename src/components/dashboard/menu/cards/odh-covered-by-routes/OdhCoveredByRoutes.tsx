import * as React from 'react';
import { connect } from 'react-redux';
import withDefaultCard from 'components/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';

import CollapseButton from 'components/ui/collapse/button/CollapseButton';
import List from 'components/dashboard/menu/cards/odh-covered-by-routes/list/List';

import {
  dashboardLoadOdhCoveredByRoutes,
  dashboardSetInfoDataInOdhCoveredByRoutes,
 } from 'components/dashboard/redux-main/modules/dashboard/actions-dashboard';
import OdhCoveredByRoutesInfo from 'components/dashboard/menu/cards/odh-covered-by-routes/info/OdhCoveredByRoutesInfo';

import {
  PropsOdhCoveredByRoutes,
  StateOdhCoveredByRoutes,
} from 'components/dashboard/menu/cards/odh-covered-by-routes/OdhCoveredByRoutes.h';

import {
  DivNone,
} from 'global-styled/global-styled';
import { compose } from 'recompose';

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
            <CollapseButton >
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

const mapStateToProps = (state) => ({
  items: state.dashboard.odh_covered_by_routes.data.items,
});

const mapDispatchToProps = (dispatch) => ({
  setInfoData: (infoData) => (
    dispatch(
      dashboardSetInfoDataInOdhCoveredByRoutes(infoData),
    )
  ),
});

export default compose<any, any>(
  withDefaultCard({
    path: 'odh_covered_by_routes',
    loadData: dashboardLoadOdhCoveredByRoutes,
    InfoComponent: OdhCoveredByRoutesInfo,
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(OdhCoveredByRoutes);
