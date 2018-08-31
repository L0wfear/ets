import * as React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import * as cx from 'classnames';
import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { connect } from 'react-redux';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

import CollapseButton from 'components/ui/collapse/button/CollapseButton';

import CollapseList from 'components/dashboard/new/menu/cards/current-duty-missions/collapse-list/CollapseList';
import { dashboardLoadCurrentDutyMissions, dashboardLoadRouteDataForCurrentDutyMissions } from 'components/dashboard/new/redux/modules/dashboard/actions-dashboard';
import CurrentMissionInfo from 'components/dashboard/new/menu/cards/current-duty-missions/info/CurrentDutyMissionsInfo';

type PropsCurrentDutyMissions = {
  title: string;
  items: any[];
  isLoading: boolean;
  loadData: Function;
  loadRouteDataById: (duty_mission_data: any, id: number) => any;
  timeDelay?: number;
}

type StateCurrentDutyMissions = {
  timerId: any,
};

class CurrentDutyMissions extends React.Component<PropsCurrentDutyMissions, StateCurrentDutyMissions> {
  state = {
    timerId: 0,
  }
  componentDidMount() {
    console.log(this.props.timeDelay)
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
    const [
      index,
      subItemIndex,
      duty_mission_route_id,
    ] = (path as string).split('/').slice(-3).map((d) => Number.parseInt(d));

    this.props.loadRouteDataById(
      this.props.items[index].subItems[subItemIndex].data,
      duty_mission_route_id,
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
          <CollapseList collapsetItems={firstTwoItem} handleClickMission={this.handleClickMission} classNameContainer="line_data" />
          { 
            collapsetItems.length ? 
            (
              <CollapseButton dependentData={collapsetItems}>
                <CollapseList collapsetItems={collapsetItems} handleClickMission={this.handleClickMission} classNameContainer="line_data" />
              </CollapseButton>
            )
            :
            (
              <div className="none"></div>
            )
          }
        </div>
        <CurrentMissionInfo />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.dashboard.current_duty_missions.isLoading,
  title: state.dashboard.current_duty_missions.data.title,
  items: state.dashboard.current_duty_missions.data.items,
});

const mapDispatchToProps = (dispatch) => ({
  loadData: () => (
    dispatch(
      dashboardLoadCurrentDutyMissions(),
    )
  ),
  loadRouteDataById: (duty_mission_data, id) => (
    dispatch(
      dashboardLoadRouteDataForCurrentDutyMissions(duty_mission_data, id),
    )
  )
});

export default hocAll(
  withRequirePermissionsNew({
    permissions: 'dashboard.current_duty_missions',
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(CurrentDutyMissions);