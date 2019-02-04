import * as React from 'react';
import { ButtonCreateMission } from 'components/missions/mission/buttons/buttons';
import MissionFormWrap from 'components/missions/mission/MissionFormWrap';
import { connect } from 'react-redux';
import { getDefaultMission } from 'stores/MissionsStore';
import { FlexCenterButton } from 'components/monitor/info/car-info/car-tab-menu/car-attribute-information/car-create-mission/styled/index';
import memoizeOne from 'memoize-one';
import { fetchCarInfo } from 'components/monitor/info/car-info/redux-main/modules/actions-car-info';

type PropsCarMissions = {
  gps_code: number;
  carActualGpsNumberIndex: any;
  fetchMissionsData: any;
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
};

class CreateMission extends React.Component<PropsCarMissions, StateCarMissions> {
  state = {
    showMissionFormWrap: false,
    element: null,
  };

  handleClickCreateMission = () => {
    const {
      gps_code,
      carActualGpsNumberIndex,
    } = this.props;

    const carInfo = carActualGpsNumberIndex[gps_code];

    const defaultMission: defaultMissionI = getDefaultMission();

    const element = {
      car_id: carInfo.asuods_id,
      type_id: carInfo.type_id,
      ...defaultMission,
    };

    this.setState({
      showMissionFormWrap: true,
      element,
    });
  }

  handleHideMissionForm = () => {
    const {
      gps_code,
      carActualGpsNumberIndex,
    } = this.props;

    this.props.fetchMissionsData({
      asuods_id: carActualGpsNumberIndex[gps_code].asuods_id,
      gps_code,
    });

    this.setState({
      showMissionFormWrap: false,
      element: null,
    });
  }

  makeCarActualGpsNumberArray = (
    memoizeOne(
      (carActualGpsNumberIndex) => (
        Object.values(carActualGpsNumberIndex)
      ),
    )
  );

  render() {
    const {
      carActualGpsNumberIndex,
    } = this.props;

    const {
      element,
      showMissionFormWrap,
    } = this.state;

    const carActualGpsNumberArray = this.makeCarActualGpsNumberArray(
      carActualGpsNumberIndex,
    );

    return (
      <FlexCenterButton>
        <ButtonCreateMission onClick={this.handleClickCreateMission} >
          Создать децентрализованное задание
        </ButtonCreateMission>
        <MissionFormWrap
          onFormHide={this.handleHideMissionForm}
          showForm={showMissionFormWrap}
          element={element}
          carsList={carActualGpsNumberArray}
          withDefineTypeId
        />
      </FlexCenterButton>
    );
  }
}

const mapStateToProps = (state) => ({
  carActualGpsNumberIndex: state.monitorPage.carActualGpsNumberIndex,
});
const mapDispatchToProps = (dispatch) => ({
  fetchMissionsData: (props) => (
    dispatch(
      fetchCarInfo({
        asuods_id: props.asuods_id,
        gps_code: props.gps_code,
      }),
    )
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
) (CreateMission);
