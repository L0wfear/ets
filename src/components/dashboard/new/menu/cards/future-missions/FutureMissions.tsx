import * as React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import * as cx from 'classnames';
import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { connect } from 'react-redux';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

import ListByTypeMission from 'components/dashboard/new/menu/cards/future-missions/list/ListByTypeMission';

import { dashboardLoadFutureMissions } from 'components/dashboard/new/redux/modules/dashboard/actions-dashboard';
import { getMissionById }  from 'redux/trash-actions/mission/promise';
import MissionFormWrap from 'components/missions/mission/MissionFormWrap';

const PermittedMissionFormWrap = withRequirePermissionsNew({
  permissions: 'mission.read',
})(MissionFormWrap);

type PropsFutureMissions = {
  title: string;
  items: any[];
  isLoading: boolean;
  loadData: Function;
  timeDelay?: number;
};

type StateFutureMissions = {
  showMissionFormWrap: boolean;
  elementMissionFormWrap: any;
  timerId: any;
};

class FutureMissions extends React.Component<PropsFutureMissions, StateFutureMissions> {
  state = {
    showMissionFormWrap: false,
    elementMissionFormWrap: null,
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

    getMissionById(id).then(({ mission }) => {
      if (mission) {
        this.setState({
          showMissionFormWrap: true,
          elementMissionFormWrap: mission,
        })
      }
    });
  }

  handleFormHide = () => (
    this.setState({
      showMissionFormWrap: false,
      elementMissionFormWrap: null,
    })
  )

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
        <PermittedMissionFormWrap
          onFormHide={this.handleFormHide}
          showForm={this.state.showMissionFormWrap}
          element={this.state.elementMissionFormWrap}
          fromDashboard
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.dashboard.future_missions.isLoading,
  title: state.dashboard.future_missions.data.title,
});

const mapDispatchToProps = (dispatch) => ({
  loadData: () => (
    dispatch(
      dashboardLoadFutureMissions(),
    )
  ),
});

export default hocAll(
  withRequirePermissionsNew({
    permissions: 'dashboard.future_missions',
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(FutureMissions);