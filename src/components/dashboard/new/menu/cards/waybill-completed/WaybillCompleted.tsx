import * as React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import * as cx from 'classnames';
import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { connect } from 'react-redux';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

import List from 'components/dashboard/new/menu/cards/waybill-completed/list/List';
import {
  dashboardLoadWaybillCompleted,
  dashboardSetInfoDataInWaybillCompleted,
 } from 'components/dashboard/new/redux/modules/dashboard/actions-dashboard';
import WaybillCompletedInfo from 'components/dashboard/new/menu/cards/waybill-completed/info/WaybillCompletedInfo';
import CollapseButton from 'components/ui/collapse/button/CollapseButton';

type PropsWaybillCompleted = {
  title: string;
  items: any[];
  isLoading: boolean;
  loadData: Function;
  setInfoData: Function;
  timeDelay?: number;
};

type StateWaybillCompleted = {
  timerId: any;
}
class WaybillCompleted extends React.Component<PropsWaybillCompleted, StateWaybillCompleted> {
  state = {
    timerId: 0,
  }
  componentDidMount() {
    this.loadData();
    this.setState({
      timerId: setTimeout(() => (
        this.setState({
          timerId: setInterval(() => (
            this.loadData()
          ), 60 * 1000)
        })
      ), this.props.timeDelay || 0),
    })
  }

  componentWillUnMount() {
    clearTimeout(this.state.timerId);
    clearInterval(this.state.timerId);
  }
  loadData = () => (
    this.props.loadData()
  );

  handleClick: any = ({ currentTarget: { dataset: { path } } }) => {
    const index = Number.parseInt((path as string).split('/').slice(-1)[0])

    this.props.setInfoData(
      this.props.items[index].subItems,
      index,
    );
  }

  render() {
    const { items, isLoading } = this.props;
    const firstTwoItem = items.slice(0, 2);
    const collapsetItems = items.slice(2);

    return (
      <div className="card_container main">
        <div className="card_title">
          <div>
            <div>{this.props.title}</div>
            <div>
              <Button onClick={this.loadData}>
                <Glyphicon
                  className={cx({ 'glyphicon-spin': isLoading })}
                  glyph="refresh"
                />
              </Button>
            </div>
          </div>
        </div>
        <div className={cx('card_body', { is_loading: isLoading })}>
          <List items={firstTwoItem} handleClick={this.handleClick} classNameContainer="line_data" />
          { 
            collapsetItems.length ? 
            (
              <CollapseButton dependentData={collapsetItems}>
                <List items={collapsetItems} handleClick={this.handleClick} classNameContainer="line_data" />
              </CollapseButton>
            )
            :
            (
              <div className="none"></div>
            )
          }
        </div>
        <WaybillCompletedInfo />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.dashboard.waybill_completed.isLoading,
  title: state.dashboard.waybill_completed.data.title,
  items: state.dashboard.waybill_completed.data.items,
});

const mapDispatchToProps = (dispatch) => ({
  loadData: () => (
    dispatch(
      dashboardLoadWaybillCompleted(),
    )
  ),
  setInfoData: (infoData, index) => (
    dispatch(
      dashboardSetInfoDataInWaybillCompleted(infoData, index)
    )
  ),
});

export default hocAll(
  withRequirePermissionsNew({
    permissions: 'dashboard.waybill_completed',
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(WaybillCompleted);