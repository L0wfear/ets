import * as React from 'react';
import { connect } from 'react-redux';
import withDefaultCard from 'components/dashboard/new/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';

import List from 'components/dashboard/new/menu/cards/waybill-completed/list/List';
import {
  dashboardLoadWaybillCompleted,
  dashboardSetInfoDataInWaybillCompleted,
 } from 'components/dashboard/new/redux/modules/dashboard/actions-dashboard';
import WaybillCompletedInfo from 'components/dashboard/new/menu/cards/waybill-completed/info/WaybillCompletedInfo';
import CollapseButton from 'components/ui/collapse/button/CollapseButton';

import {
  PropsWaybillCompleted,
  StateWaybillCompleted,
} from 'components/dashboard/new/menu/cards/waybill-completed/WaybillCompleted.h';

import {
  DivNone,
} from 'global-styled/global-styled';

class WaybillCompleted extends React.Component<PropsWaybillCompleted, StateWaybillCompleted> {
  handleClick: any = ({ currentTarget: { dataset: { path } } }) => {
    const index = Number.parseInt((path as string).split('/').slice(-1)[0])

    this.props.setInfoData(
      this.props.items[index],
    );
  }

  render() {
    const { items } = this.props;
    const counttoFirstShow = 2;

    const firstTwoItem = items.slice(0, counttoFirstShow);
    const collapsetItems = items.slice(counttoFirstShow);

    return (
      <div>
        <List items={firstTwoItem} handleClick={this.handleClick} addIndex={0} classNameContainer="line_data" />
        { 
          collapsetItems.length ?
          (
            <CollapseButton dependentData={collapsetItems}>
              <List items={collapsetItems} handleClick={this.handleClick} classNameContainer="line_data" addIndex={2} />
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
  items: state.dashboard.waybill_completed.data.items,
});

const mapDispatchToProps = (dispatch) => ({
  setInfoData: (infoData) => (
    dispatch(
      dashboardSetInfoDataInWaybillCompleted(infoData)
    )
  ),
});

export default withDefaultCard({
  path: 'waybill_completed',
  loadData: dashboardLoadWaybillCompleted,
  InfoComponent: WaybillCompletedInfo,
})(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(WaybillCompleted)
);
