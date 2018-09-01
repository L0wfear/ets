import * as React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import * as cx from 'classnames';
import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { connect } from 'react-redux';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

import { dashboardLoadCurrentDutyMissions, dashboardLoadRouteDataForCurrentDutyMissions } from 'components/dashboard/new/redux/modules/dashboard/actions-dashboard';
import CurrentMissionInfo from 'components/dashboard/new/menu/cards/current-duty-missions/info/CurrentDutyMissionsInfo';

import ListByTypeMission from 'components/dashboard/new/menu/cards/current-duty-missions/collapse-list/ListByTypeMission';

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
      itemsKey,
      subItemsIndex,
      dataIndex,
    ] = path.split('/');

    const duty_mission_data = this.props[itemsKey][subItemsIndex].subItems[dataIndex].data;

    this.props.loadRouteDataById(
      duty_mission_data,
      duty_mission_data.duty_mission_route_id,
    );
  }

  render() {
    const { isLoading } = this.props;

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
          <ListByTypeMission titleKey="title_centralized" itemsKey="items_centralized" handleClickMission={this.handleClickMission} />
          <ListByTypeMission titleKey="title_decentralized" itemsKey="items_decentralized" handleClickMission={this.handleClickMission} />
        </div>
        <CurrentMissionInfo />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  ...state.dashboard.current_duty_missions.data,
  isLoading: state.dashboard.current_duty_missions.isLoading,
  title: state.dashboard.current_duty_missions.data.title,
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