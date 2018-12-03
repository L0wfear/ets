import * as React from 'react';

import withDefaultCard from 'components/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';
import { connect } from 'react-redux';

import CollapseButton from 'components/ui/collapse/button/CollapseButton';
import List from 'components/dashboard/menu/cards/car-in-work-overall/list/List';

import {
  dashboardLoadCarInWorkOverall,
  dashboardSetInfoDataInCarInWorkOverall,
} from 'components/dashboard/redux-main/modules/dashboard/actions-dashboard';

import CarInWorkOverallInfo from 'components/dashboard/menu/cards/car-in-work-overall/info/CarInWorkOverallInfo';

import {
  PropsCarInWorkOverall,
  StateCarInWorkOverall,
  StatePropsCarInOveral,
  DispatchPropsCarInOveral,
  OwnPropsCarInOveral,
} from 'components/dashboard/menu/cards/car-in-work-overall/CarInWorkOverall.h';
import {
  DivNone,
} from 'global-styled/global-styled';
import { compose } from 'recompose';
import { getDashboardState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { PropsToDefaultCard } from 'components/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard.h';

class CarInWorkOverall extends React.Component<PropsCarInWorkOverall, StateCarInWorkOverall> {
  handleClickMission: React.MouseEventHandler<HTMLLIElement> = ({ currentTarget: { dataset: { path } } }) => {
    const index = Number.parseInt((path as string).split('/').slice(-1)[0], 0);
    this.props.setInfoData(this.props.items[index]);
  }

  render() {
    const { items, } = this.props;
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
          collapsetItems.length ?
          (
            <CollapseButton >
              <List
                items={collapsetItems}
                handleClick={this.handleClickMission}
                addIndex={counttoFirstShow}
                classNameContainer="line_data"
              />
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

export default compose<PropsCarInWorkOverall, PropsToDefaultCard>(
  withDefaultCard({
    path: 'car_in_work_overall',
    loadData: dashboardLoadCarInWorkOverall,
    InfoComponent: CarInWorkOverallInfo,
  }),
  connect<StatePropsCarInOveral, DispatchPropsCarInOveral, OwnPropsCarInOveral, ReduxState>(
    (state) => ({
      items: getDashboardState(state).car_in_work_overall.data.items,
    }),
    (dispatch) => ({
      setInfoData: (infoData) => (
        dispatch(
          dashboardSetInfoDataInCarInWorkOverall(infoData),
        )
      ),
    }),
  ),
)(CarInWorkOverall);
