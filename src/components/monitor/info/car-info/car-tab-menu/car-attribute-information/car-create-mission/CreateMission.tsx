import * as React from 'react';
import { ButtonCreateMission } from 'components/missions/mission/buttons/buttons';
import MissionFormWrap from 'components/missions/mission/MissionFormWrap';
import { connect } from 'react-redux';
import { getDefaultMission } from 'stores/MissionsStore';
import { FlexCenterButton } from 'components/monitor/info/car-info/car-tab-menu/car-attribute-information/car-create-mission/styled/index';

type PropsCarMissions = {
  gps_code: number;
  carActualGpsNumberIndex: any;
};

type defaultMissionI = {
  description: string;
  date_start: Date;
  date_end: Date;
  assign_to_waybill: string,
  mission_source_id: number,
  passes_count: number,
  is_new: boolean,
};

type StateCarMissions = {
  showMissionFormWrap: boolean;
  element: any;
  carActualGpsNumberArray: any[];
};

class CreateMission extends React.Component<PropsCarMissions, StateCarMissions> {
  state = {
    showMissionFormWrap: false,
    element: null,
    carActualGpsNumberArray: [],
  };

  showMissionFormWrap = () => {
    this.setState({ showMissionFormWrap: true });
  }
  componentDidMount() {
    const { gps_code, carActualGpsNumberIndex } = this.props;
    const carInfo = carActualGpsNumberIndex[gps_code];
    const carActualGpsNumberArray = Object.values(carActualGpsNumberIndex);
    const defaultMission: defaultMissionI = getDefaultMission();
    const element = {
      car_id: carInfo.asuods_id,
      type_id: carInfo.type_id,
      ...defaultMission,
    };
    this.setState({
      element,
      carActualGpsNumberArray,
    });
  }

  handleFormHideMissionFormWrap = () => {
    this.setState({ showMissionFormWrap: false });
  }

  render() {
    const { element, carActualGpsNumberArray } = this.state;

    return (
      <FlexCenterButton>
        <ButtonCreateMission onClick={this.showMissionFormWrap} >
          Создать децентрализованное задание
        </ButtonCreateMission>
        <MissionFormWrap
          onFormHide={this.handleFormHideMissionFormWrap}
          showForm={this.state.showMissionFormWrap}
          element={element}
          carsList={carActualGpsNumberArray}
          fromWaybill
        />
      </FlexCenterButton>
    );
  }
}

const mapStateToProps = (state) => ({
  carActualGpsNumberIndex: state.monitorPage.carActualGpsNumberIndex,
});

export default connect(
  mapStateToProps,
) (CreateMission);
