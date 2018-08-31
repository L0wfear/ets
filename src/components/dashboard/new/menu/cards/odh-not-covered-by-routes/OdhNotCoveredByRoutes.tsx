import * as React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import * as cx from 'classnames';
import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { connect } from 'react-redux';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

import CollapseButton from 'components/ui/collapse/button/CollapseButton';

import List from 'components/dashboard/new/menu/cards/odh-not-covered-by-routes/list/List';
import {
  dashboardLoadOdhNotCoveredByRoutes,
  dashboardSetInfoDataInOdhNotCoveredByRoutes,
 } from 'components/dashboard/new/redux/modules/dashboard/actions-dashboard';
import OdhNotCoveredByRoutesInfo from 'components/dashboard/new/menu/cards/odh-not-covered-by-routes/info/OdhNotCoveredByRoutesInfo';

type PropsOdhNotCoveredByRoutes = {
  title: string;
  items: any[];
  isLoading: boolean;
  loadData: Function;
  setInfoData: Function;
  timeDelay?: number;
  history: any;
};

type StateOdhNotCoveredByRoutes = {
  timerId: any;
}
class OdhNotCoveredByRoutes extends React.Component<PropsOdhNotCoveredByRoutes, StateOdhNotCoveredByRoutes> {
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

  handleClickMission: any = ({ currentTarget: { dataset: { path } } }) => {
    const index = Number.parseInt((path as string).split('/').slice(-1)[0])

    this.props.setInfoData(this.props.items[index]);
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
              <div className="none"></div>
            )
          }
        </div>
        <OdhNotCoveredByRoutesInfo history={this.props.history} />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.dashboard.odh_not_covered_by_routes.isLoading,
  title: state.dashboard.odh_not_covered_by_routes.data.title,
  items: state.dashboard.odh_not_covered_by_routes.data.items,
});

const mapDispatchToProps = (dispatch) => ({
  loadData: () => (
    dispatch(
      dashboardLoadOdhNotCoveredByRoutes(),
    )
  ),
  setInfoData: (infoData) => (
    dispatch(
      dashboardSetInfoDataInOdhNotCoveredByRoutes(infoData)
    )
  )
});

export default hocAll(
  withRequirePermissionsNew({
    permissions: 'dashboard.odh_not_covered_by_routes',
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(OdhNotCoveredByRoutes);