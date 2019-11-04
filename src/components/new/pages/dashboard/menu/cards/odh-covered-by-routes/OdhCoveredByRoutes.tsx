import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import withDefaultCard, { PropsToDefaultCard } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';

import CollapseButton from 'components/old/ui/collapse/button/CollapseButton';
import List from 'components/new/pages/dashboard/menu/cards/odh-covered-by-routes/list/List';

import {
  dashboardLoadOdhCoveredByRoutes,
  dashboardSetInfoDataInOdhCoveredByRoutes,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';
import OdhCoveredByRoutesInfo from 'components/new/pages/dashboard/menu/cards/odh-covered-by-routes/info/OdhCoveredByRoutesInfo';

import {
  DivNone,
} from 'global-styled/global-styled';
import { getDashboardState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { OdhCoveredByRoutesItemsType } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/odh-covered-by-routes.h';

type StateProps = {
  items: Array<OdhCoveredByRoutesItemsType>;
};

type DispatchProps = {
  setInfoData: (infoData: OdhCoveredByRoutesItemsType) => any;
};

type OwnProps = {};

type Props = (
  StateProps
  & DispatchProps
  & OwnProps
);

class OdhCoveredByRoutes extends React.PureComponent<Props, {}> {
  handleClickMission: React.MouseEventHandler<HTMLLIElement> = ({ currentTarget: { dataset: { path } } }) => {
    this.props.setInfoData(
      this.props.items[
        path.split('/').slice(-1)[0]
      ],
    );
  };

  render() {
    const { items } = this.props;
    const counttoFirstShow = 2;

    const firstTwoItem = items.slice(0, counttoFirstShow);
    const collapsetItems = items.slice(counttoFirstShow);

    return (
      <div>
        <List items={firstTwoItem} handleClick={this.handleClickMission} addIndex={0}  classNameContainer="line_data" />
        {
          collapsetItems.length
            ? (
              <CollapseButton>
                <List items={collapsetItems} handleClick={this.handleClickMission} addIndex={counttoFirstShow}  classNameContainer="line_data" />
              </CollapseButton>
            )
            :          (
              <DivNone />
            )
        }
      </div>
    );
  }
}

export default compose<Props, PropsToDefaultCard>(
  withDefaultCard({
    path: 'odh_covered_by_routes',
    loadData: dashboardLoadOdhCoveredByRoutes,
    InfoComponent: OdhCoveredByRoutesInfo,
  }),
  connect<StateProps, DispatchProps, OwnProps, ReduxState>(
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
