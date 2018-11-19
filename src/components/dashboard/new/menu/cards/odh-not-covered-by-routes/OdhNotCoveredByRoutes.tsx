import * as React from 'react';
import { connect } from 'react-redux';
import withDefaultCard from 'components/dashboard/new/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';

import CollapseButton from 'components/ui/collapse/button/CollapseButton';

import List from 'components/dashboard/new/menu/cards/odh-not-covered-by-routes/list/List';
import {
  dashboardLoadOdhNotCoveredByRoutes,
  dashboardSetInfoDataInOdhNotCoveredByRoutes,
 } from 'components/dashboard/new/redux/modules/dashboard/actions-dashboard';
import OdhNotCoveredByRoutesInfo from 'components/dashboard/new/menu/cards/odh-not-covered-by-routes/info/OdhNotCoveredByRoutesInfo';

import {
  PropsOdhNotCoveredByRoutes,
  StateOdhNotCoveredByRoutes,
} from 'components/dashboard/new/menu/cards/odh-not-covered-by-routes/OdhNotCoveredByRoutes.h';

import {
  DivNone,
} from 'global-styled/global-styled';

class OdhNotCoveredByRoutes extends React.Component<PropsOdhNotCoveredByRoutes, StateOdhNotCoveredByRoutes> {
  handleClickMission: any = ({ currentTarget: { dataset: { path } } }) => {
    const index = Number.parseInt((path as string).split('/').slice(-1)[0])

    this.props.setInfoData(this.props.items[index]);
  }

  render() {
    const { items } = this.props;
    const counttoFirstShow = 2;

    const firstTwoItem = items.slice(0, counttoFirstShow);
    const collapsetItems = items.slice(counttoFirstShow);

    return (
      <div>
        <List items={firstTwoItem} handleClick={this.handleClickMission} addIndex={counttoFirstShow} classNameContainer="line_data" />
        { 
          collapsetItems.length ? 
          (
            <CollapseButton dependentData={collapsetItems}>
              <List items={collapsetItems} handleClick={this.handleClickMission} addIndex={counttoFirstShow} classNameContainer="line_data" />
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
  items: state.dashboard.odh_not_covered_by_routes.data.items,
});

const mapDispatchToProps = (dispatch) => ({
  loadData: () => (
    dispatch(
      dashboardLoadOdhNotCoveredByRoutes(),
    )
  ),
  setInfoData: (infoData) => (
    dispatch(
      dashboardSetInfoDataInOdhNotCoveredByRoutes(infoData)
    )
  )
});

export default withDefaultCard({
  path: 'odh_not_covered_by_routes',
  loadData: dashboardLoadOdhNotCoveredByRoutes,
  InfoComponent: OdhNotCoveredByRoutesInfo,
})(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(OdhNotCoveredByRoutes)
);