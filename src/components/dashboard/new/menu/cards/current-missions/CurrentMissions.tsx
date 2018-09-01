import * as React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import * as cx from 'classnames';
import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { connect } from 'react-redux';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

import { dashboardLoadCurrentMissions, dashboardLoadMissionDataForCurrentMission } from 'components/dashboard/new/redux/modules/dashboard/actions-dashboard';
import CurrentMissionInfo from 'components/dashboard/new/menu/cards/current-missions/info/CurrentMissionInfo';
import ListByTypeMission from 'components/dashboard/new/menu/cards/current-missions/collapse-list/ListByTypeMission';

type PropsCurrentMissions = {
  title: string;
  isLoading: boolean;
  loadData: Function;
  loadMissionDataById: (id?: number) => any;
  timeDelay?: number;
}

type StateCurrentMissions = {
  timerId: any,
};

class CurrentMissions extends React.Component<PropsCurrentMissions, StateCurrentMissions> {
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
    const id = Number.parseInt((path as string).split('/').slice(-1)[0])

    this.props.loadMissionDataById(id);
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
  isLoading: state.dashboard.current_missions.isLoading,
  title: state.dashboard.current_missions.data.title,
});

const mapDispatchToProps = (dispatch) => ({
  loadData: () => (
    dispatch(
      dashboardLoadCurrentMissions(),
    )
  ),
  loadMissionDataById: (id) => (
    dispatch(
      dashboardLoadMissionDataForCurrentMission(id),
    )
  )
});

export default hocAll(
  withRequirePermissionsNew({
    permissions: 'dashboard.current_missions',
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(CurrentMissions);