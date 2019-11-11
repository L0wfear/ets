import * as React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { HandleThunkActionCreator } from 'react-redux';

import withDefaultCard, { PropsToDefaultCard } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';

import CollapseButton from 'components/old/ui/collapse/button/CollapseButton';
import List from 'components/new/pages/dashboard/menu/cards/car-in-work-overall/list/List';

import {
  dashboardLoadCarInWorkOverall,
  dashboardSetInfoDataInCarInWorkOverall,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';

import CarInWorkOverallInfo from 'components/new/pages/dashboard/menu/cards/car-in-work-overall/info/CarInWorkOverallInfo';

import {
  getDashboardState,
  getSessionState,
} from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { InitialStateDashboard } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/_dashboard.h';

type StateProps = {
  items: InitialStateDashboard['car_in_work_overall']['data']['items'];
};
type DispatchProps = {
  setInfoData: HandleThunkActionCreator<typeof dashboardSetInfoDataInCarInWorkOverall>;
};
type OwnProps = {};

type Props = StateProps &
  DispatchProps &
  OwnProps;

type State = {
};

class CarInWorkOverall extends React.Component<Props, State> {
  handleClickMission: React.MouseEventHandler<HTMLLIElement> = ({
    currentTarget: {
      dataset: { path },
    },
  }) => {
    const index = Number.parseInt((path as string).split('/').slice(-1)[0], 0);
    this.props.setInfoData(this.props.items[index]);
  };

  render() {
    const { items } = this.props;

    const counttoFirstShow = 2;
    const firstTwoItem = items.slice(0, counttoFirstShow);
    const collapsetItems = items.slice(counttoFirstShow);

    return (
      <div>
        <List
          items={firstTwoItem}
          handleClick={this.handleClickMission}
          classNameContainer="line_data"
          addIndex={0}
        />
        {
          Boolean(collapsetItems[0]) && (
            <CollapseButton>
              <List
                items={collapsetItems}
                handleClick={this.handleClickMission}
                addIndex={counttoFirstShow}
                classNameContainer="line_data"
              />
            </CollapseButton>
          )
        }
      </div>
    );
  }
}

export default compose<Props, PropsToDefaultCard>(
  withDefaultCard({
    path: 'car_in_work_overall',
    loadData: dashboardLoadCarInWorkOverall,
    InfoComponent: CarInWorkOverallInfo,
  }),
  connect<StateProps, DispatchProps, OwnProps, ReduxState>(
    (state) => ({
      items: getDashboardState(state).car_in_work_overall.data.items,
      token: getSessionState(state).token,
      points_ws: getSessionState(state).appConfig.points_ws,
      carActualGpsNumberIndex: state.monitorPage.carActualGpsNumberIndex,
    }),
    (dispatch: any) => ({
      setInfoData: (infoData) => (
        dispatch(
          dashboardSetInfoDataInCarInWorkOverall(infoData),
        )
      ),
    }),
  ),
)(CarInWorkOverall);
