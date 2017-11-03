import MunicipalFacilityMission from 'components/missions/mission/inside_fields/municipal_facility/MunicipalFacility.jsx';

class MunicipalFacility extends MunicipalFacilityMission {

  /**
   * @override
   */
  componentWillReceiveProps(props) {
    const {
      technical_operation_id: old_toi,
      plan_date_start: old_pds,
      forseUpdateIsWas,
    } = this.state;
    let forseUpdate = false;
    const {
      technical_operation_id: new_toi,
      plan_date_start: new_pds,
      value: new_v,
      error: new_err,
    } = this.getStateByProps(props);
    const {
      technicalOperationsList: newTechOperationsList = [],
    } = props;

    const newState = {
      value: new_v,
      error: new_err,
    };
    if (!forseUpdateIsWas && newTechOperationsList.length > 0 && new_toi) {
      forseUpdate = true;
    }

    if ((!!new_toi && !!new_pds && (old_toi !== new_toi || old_pds !== new_pds) && forseUpdateIsWas) || forseUpdate) {
      const {
        norm_ids = [],
      } = (newTechOperationsList.find(({ id }) => id === new_toi) || {});

      const outerPayload = {
        norm_ids: norm_ids.join(','),
        start_date: new_pds,
        end_date: new_pds,
      };
      this.getCleaningMunicipalFacilityList(outerPayload);

      newState.technical_operation_id = new_toi;
      newState.plan_date_start = new_pds;
      newState.forseUpdateIsWas = true;
    } else if (!new_pds || !old_pds) {
      newState.myDisable = true;
    }

    this.setState({ ...newState });
  }

  /**
   * @override
   */
  getStateByProps = (props) => {
    const {
      state: {
        [props.id]: value,
        technical_operation_id,
        plan_date_start,
      } = {},
      errors: {
        [props.id]: error,
      },
    } = props;

    return {
      technical_operation_id,
      plan_date_start,
      value,
      error,
    };
  }
}

export default MunicipalFacility;
