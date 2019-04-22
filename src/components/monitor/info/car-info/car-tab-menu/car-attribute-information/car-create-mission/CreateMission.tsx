import * as React from 'react';
import { ButtonCreateMission } from 'components/new/pages/missions/mission/buttons/buttons';
import { connect } from 'react-redux';
import { FlexCenterButton } from 'components/monitor/info/car-info/car-tab-menu/car-attribute-information/car-create-mission/styled/index';
import memoizeOne from 'memoize-one';
import { fetchCarInfo } from 'components/monitor/info/car-info/redux-main/modules/actions-car-info';
import MissionFormLazy from 'components/new/pages/missions/mission/form/main';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

type PropsCarMissions = {
  gps_code: number;
  carActualGpsNumberIndex: any;
  fetchMissionsData: any;
};

type StateCarMissions = {
  showMissionForm: boolean;
  element: any;
};

class CreateMission extends React.Component<
  PropsCarMissions,
  StateCarMissions
> {
  state = {
    showMissionForm: false,
    element: null,
  };

  handleClickCreateMission = () => {
    const { gps_code, carActualGpsNumberIndex } = this.props;

    const carInfo: Car = carActualGpsNumberIndex[gps_code];

    const element: Partial<Mission> = {
      car_gov_number: carInfo.gov_number,
      car_gov_numbers: [carInfo.gov_number],
      car_id: carInfo.asuods_id,
      car_ids: [carInfo.asuods_id],
      car_model_name: carInfo.model_name,
      car_model_names: [carInfo.model_name],
      car_special_model_name: carInfo.special_model_name,
      car_special_model_names: [carInfo.special_model_name],
      car_type_id: carInfo.type_id,
      car_type_ids: [carInfo.type_id],
      car_type_name: carInfo.type_name,
      car_type_names: [carInfo.type_name],
    };

    this.setState({
      showMissionForm: true,
      element,
    });
  };

  handleHideMissionForm = () => {
    const { gps_code, carActualGpsNumberIndex } = this.props;

    this.props.fetchMissionsData({
      asuods_id: carActualGpsNumberIndex[gps_code].asuods_id,
      gps_code,
    });

    this.setState({
      showMissionForm: false,
      element: null,
    });
  };

  makeCarActualGpsNumberArray = memoizeOne((carActualGpsNumberIndex) =>
    Object.values(carActualGpsNumberIndex),
  );

  render() {
    const { element, showMissionForm } = this.state;

    return (
      <FlexCenterButton>
        <ButtonCreateMission onClick={this.handleClickCreateMission}>
          Создать децентрализованное задание
        </ButtonCreateMission>
        <MissionFormLazy
          onFormHide={this.handleHideMissionForm}
          showForm={showMissionForm}
          element={element}
          notChangeCar
        />
      </FlexCenterButton>
    );
  }
}

const mapStateToProps = (state) => ({
  carActualGpsNumberIndex: state.monitorPage.carActualGpsNumberIndex,
});
const mapDispatchToProps = (dispatch) => ({
  fetchMissionsData: (props) =>
    dispatch(
      fetchCarInfo({
        asuods_id: props.asuods_id,
        gps_code: props.gps_code,
      }),
    ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateMission);
