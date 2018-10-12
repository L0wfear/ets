import * as React from 'react';
import { connect } from 'react-redux';
import withDefaultCard from 'components/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';

import CollapseButton from 'components/ui/collapse/button/CollapseButton';

import List from 'components/dashboard/menu/cards/faxogramms/list/List';
import FaxogrammsInfo from 'components/dashboard/menu/cards/faxogramms/info/FaxogrammsInfo';

import {
  dashboardLoadOrders,
  dashboardSetInfoDataInFaxogramms,
 } from 'components/dashboard/redux-main/modules/dashboard/actions-dashboard';

import {
  PropsFaxogramms,
  StateFaxogramms,
} from 'components/dashboard/menu/cards/faxogramms/Faxogramms.h';
import {
  DivNone,
} from 'global-styled/global-styled';

class Faxogramms extends React.Component<PropsFaxogramms, StateFaxogramms> {
  handleClickMission: React.MouseEventHandler<HTMLLIElement> = ({ currentTarget: { dataset: { path } } }) => {
    this.props.setInfoData(
      this.props.items[
        path.split('/').slice(-1)[0]
      ],
    );
  }

  render() {
    const { items } = this.props;

    const firstTwoItem = items.slice(0, 2);
    const collapsetItems = items.slice(2);

    return (
      <div>
        <List items={firstTwoItem} handleClick={this.handleClickMission} classNameContainer="line_data" />
        { 
          collapsetItems.length ? 
          (
            <CollapseButton >
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
  items: state.dashboard.faxogramms.data.items,
});

const mapDispatchToProps = (dispatch) => ({
  setInfoData: (infoData) => (
    dispatch(
      dashboardSetInfoDataInFaxogramms(infoData)
    )
  )
});

export default withDefaultCard({
  path: 'faxogramms',
  loadData: dashboardLoadOrders,
  InfoComponent: FaxogrammsInfo,
})(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Faxogramms)
);