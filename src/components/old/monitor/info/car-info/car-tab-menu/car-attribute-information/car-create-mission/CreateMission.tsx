import * as React from 'react';
import { connect } from 'react-redux';
import memoizeOne from 'memoize-one';
import { fetchCarInfo } from 'components/old/monitor/info/car-info/redux-main/modules/actions-car-info';
import MissionFormLazy from 'components/new/pages/missions/mission/form/main';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import missionPermissions from 'components/new/pages/missions/mission/_config-data/permissions';
import waybillPermissions from 'components/new/pages/waybill/_config-data/permissions';
import { CardBodyContainer } from 'components/new/pages/dashboard/menu/buttons/styled/styled';
import { compose } from 'redux';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

type PropsCarMissions = {
  gps_code: number;
  carActualGpsNumberIndex: any;
  fetchMissionsData: any;
} & WithSearchProps;

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

  handleClickCreateWaybill = () => {
    this.props.setParams({waybill_id: 'create'});
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
      <CardBodyContainer>
        <EtsBootstrap.Button id="monitor.create_mission" whiteSpace="normal" onClick={this.handleClickCreateMission} permissions={missionPermissions.create}>
          Создать децентрализованное задание
        </EtsBootstrap.Button>
        <EtsBootstrap.Button id="monitor.create_waybill" whiteSpace="normal" onClick={this.handleClickCreateWaybill} permissions={waybillPermissions.create}>
          Создать путевой лист
        </EtsBootstrap.Button>
        <MissionFormLazy
          handleHide={this.handleHideMissionForm}
          showForm={showMissionForm}
          element={element}
          notChangeCar

          type={null}

          registryKey="mainpage"
          page="mainpage"
          path="mission"
        />
      </CardBodyContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  carActualGpsNumberIndex: state.monitorPage.carActualGpsNumberIndex,
});
const mapDispatchToProps = (dispatch) => ({
  fetchMissionsData: (props) =>
    dispatch(
      fetchCarInfo(
        {
          asuods_id: props.asuods_id,
          gps_code: props.gps_code,
        },
        {
          page: 'mainpage',
        },
      ),
    ),
});

export default compose<any>(
  withSearch,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(CreateMission);
