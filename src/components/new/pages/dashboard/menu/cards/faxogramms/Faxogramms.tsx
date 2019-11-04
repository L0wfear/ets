import * as React from 'react';
import { connect } from 'react-redux';
import withDefaultCard, { PropsToDefaultCard } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';

import CollapseButton from 'components/old/ui/collapse/button/CollapseButton';

import List from 'components/new/pages/dashboard/menu/cards/faxogramms/list/List';
import FaxogrammsInfo from 'components/new/pages/dashboard/menu/cards/faxogramms/info/FaxogrammsInfo';

import {
  dashboardLoadOrders,
  dashboardSetInfoDataInFaxogramms,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';

import {
  PropsFaxogramms,
  StateFaxogramms,
} from 'components/new/pages/dashboard/menu/cards/faxogramms/Faxogramms.h';
import {
  DivNone,
} from 'global-styled/global-styled';
import { compose } from 'recompose';
import { getDashboardState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';

class Faxogramms extends React.Component<PropsFaxogramms, StateFaxogramms> {
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
        <List items={firstTwoItem} handleClick={this.handleClickMission} addIndex={0} classNameContainer="line_data" />
        {
          collapsetItems.length
            ? (
              <CollapseButton>
                <List items={collapsetItems} handleClick={this.handleClickMission} addIndex={counttoFirstShow} classNameContainer="line_data" />
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

export default compose<PropsFaxogramms, PropsToDefaultCard>(
  withDefaultCard({
    path: 'faxogramms',
    loadData: dashboardLoadOrders,
    InfoComponent: FaxogrammsInfo,
  }),
  connect<any, any, any, ReduxState>(
    (state) => ({
      items: getDashboardState(state).faxogramms.data.items,
    }),
    (dispatch) => ({
      setInfoData: (infoData) => (
        dispatch(
          dashboardSetInfoDataInFaxogramms(infoData),
        )
      ),
    }),
  ),
)(Faxogramms);
