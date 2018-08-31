import * as React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import * as cx from 'classnames';
import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { connect } from 'react-redux';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

import List from 'components/dashboard/new/menu/cards/waybill-draft/list/List';
import {
  dashboardLoadWaybillInProgress,
  dashboardSetInfoDataInWaybillInProgress,
 } from 'components/dashboard/new/redux/modules/dashboard/actions-dashboard';
import WaybillInProgressInfo from 'components/dashboard/new/menu/cards/waybill-in-progress/info/WaybillInProgressInfo';

type PropsWaybillInProgress = {
  title: string;
  items: any[];
  isLoading: boolean;
  loadData: Function;
  setInfoData: Function;
  timeDelay?: number;
};

type StateWaybillInProgress = {
  timerId: any;
}
class WaybillInProgress extends React.Component<PropsWaybillInProgress, StateWaybillInProgress> {
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

    this.props.setInfoData(this.props.items[index].subItems);
  }

  render() {
    const { items, isLoading } = this.props;

    return (
      <div className="card_container main number">
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
          <List items={items} handleClick={this.handleClick} classNameContainer="line_data number" />
        </div>
        <WaybillInProgressInfo />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.dashboard.waybill_in_progress.isLoading,
  title: state.dashboard.waybill_in_progress.data.title,
  items: state.dashboard.waybill_in_progress.data.items,
});

const mapDispatchToProps = (dispatch) => ({
  loadData: () => (
    dispatch(
      dashboardLoadWaybillInProgress(),
    )
  ),
  setInfoData: (infoData) => (
    dispatch(
      dashboardSetInfoDataInWaybillInProgress(infoData)
    )
  ),
});

export default hocAll(
  withRequirePermissionsNew({
    permissions: 'dashboard.waybill_in_progress',
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(WaybillInProgress);