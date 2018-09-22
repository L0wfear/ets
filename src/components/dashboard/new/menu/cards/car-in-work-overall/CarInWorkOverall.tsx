import * as React from 'react';

import withDefaultCard from 'components/dashboard/new/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';
import { connect } from 'react-redux';

import CollapseButton from 'components/ui/collapse/button/CollapseButton';
import List from 'components/dashboard/new/menu/cards/car-in-work-overall/list/List';

import {
  dashboardLoadCarInWorkOverall,
  dashboardSetInfoDataInCarInWorkOverall,
 } from 'components/dashboard/new/redux-main/modules/dashboard/actions-dashboard';
 
import CarInWorkOverallInfo from 'components/dashboard/new/menu/cards/car-in-work-overall/info/CarInWorkOverallInfo';

import {
  PropsCarInWorkOverall,
  StateCarInWorkOverall,
} from 'components/dashboard/new/menu/cards/car-in-work-overall/CarInWorkOverall.h';
import {
  DivNone,
} from 'global-styled/global-styled';

class CarInWorkOverall extends React.Component<PropsCarInWorkOverall, StateCarInWorkOverall> {
  handleClickMission: React.MouseEventHandler<HTMLLIElement> = ({ currentTarget: { dataset: { path } } }) => {
    const index = Number.parseInt((path as string).split('/').slice(-1)[0]);

    this.props.setInfoData(this.props.items[index]);
  }

  render() {
    const { items, } = this.props;

    const firstTwoItem = items.slice(0, 2);
    const collapsetItems = items.slice(2);

    return (
      <div>
        <List items={firstTwoItem} handleClick={this.handleClickMission} classNameContainer="line_data" />
        { 
          collapsetItems.length ? 
          (
            <CollapseButton dependentData={collapsetItems}>
              <List items={collapsetItems} handleClick={this.handleClickMission} classNameContainer="line_data" />
            </CollapseButton>
          )
          :
          (
            <DivNone />
          )
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  items: state.dashboard.car_in_work_overall.data.items,
});

const mapDispatchToProps = (dispatch) => ({
  setInfoData: (infoData) => (
    dispatch(
      dashboardSetInfoDataInCarInWorkOverall(infoData)
    )
  )
});

export default withDefaultCard({
  path: 'car_in_work_overall',
  loadData: dashboardLoadCarInWorkOverall,
  InfoComponent: CarInWorkOverallInfo,
})(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(CarInWorkOverall)
);