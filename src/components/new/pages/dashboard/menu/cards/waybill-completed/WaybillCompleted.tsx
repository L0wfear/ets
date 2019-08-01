import * as React from 'react';
import { connect } from 'react-redux';
import withDefaultCard from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';

import List from 'components/new/pages/dashboard/menu/cards/waybill-completed/list/List';
import {
  dashboardLoadWaybillCompleted,
  dashboardSetInfoDataInWaybillCompleted,
 } from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';
import WaybillCompletedInfo from 'components/new/pages/dashboard/menu/cards/waybill-completed/info/WaybillCompletedInfo';
import CollapseButton from 'components/old/ui/collapse/button/CollapseButton';

import {
  PropsWaybillCompleted,
  StateWaybillCompleted,
} from 'components/new/pages/dashboard/menu/cards/waybill-completed/WaybillCompleted.h';

import {
  DivNone,
} from 'global-styled/global-styled';
import { compose } from 'recompose';
import { getDashboardState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { PropsToDefaultCard } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard.h';

class WaybillCompleted extends React.Component<PropsWaybillCompleted, StateWaybillCompleted> {
  handleClick: any = ({ currentTarget: { dataset: { path } } }) => {
    const index = Number.parseInt((path as string).split('/').slice(-1)[0], 0);

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
            <CollapseButton>
              <List items={collapsetItems} handleClick={this.handleClick} classNameContainer="line_data" addIndex={2} />
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

export default compose<PropsWaybillCompleted, PropsToDefaultCard>(
  withDefaultCard({
    path: 'waybill_completed',
    loadData: dashboardLoadWaybillCompleted,
    InfoComponent: WaybillCompletedInfo,
  }),
  connect<any, any, any, ReduxState>(
    (state) => ({
      items: getDashboardState(state).waybill_completed.data.items,
    }),
    (dispatch) => ({
      setInfoData: (infoData) => (
        dispatch(
          dashboardSetInfoDataInWaybillCompleted(infoData),
        )
      ),
    }),
  ),
)(WaybillCompleted);
