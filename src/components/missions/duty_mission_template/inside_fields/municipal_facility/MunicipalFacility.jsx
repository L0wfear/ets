import MunicipalFacilityMission from 'components/missions/mission/inside_fields/municipal_facility/MunicipalFacility.jsx';

class MunicipalFacility extends MunicipalFacilityMission {

  /**
   * @override
   */
  componentWillReceiveProps(props) {
    const {
      technical_operation_id: old_toi,
      forseUpdateIsWas,
    } = this.state;
    let forseUpdate = false;
    const {
      technical_operation_id: new_toi,
      value: new_v,
      error: new_err,
      norm_id,
      date_create,
    } = this.getStateByProps(props);
    const {
      technicalOperationsList: newTechOperationsList = [],
      getNormIdFromState,
    } = props;

    const newState = {
      value: new_v,
      error: new_err,
    };
    if (!forseUpdateIsWas && newTechOperationsList.length > 0 && new_toi) {
      forseUpdate = true;
    }

    if ((!!new_toi && (old_toi !== new_toi) && forseUpdateIsWas) || forseUpdate) {
      const {
        norm_ids = [],
        is_new,
      } = (newTechOperationsList.find(({ id }) => id === new_toi) || {});

      if (is_new) {
        const outerPayload = {
          start_date: date_create,
          end_date: date_create,
        };

        if (getNormIdFromState) {
          outerPayload.norm_ids = norm_id;
        } else {
          outerPayload.norm_ids = norm_ids.join(',');
        }

        this.getCleaningMunicipalFacilityList(outerPayload, new_v);
      }

      newState.technical_operation_id = new_toi;
      newState.forseUpdateIsWas = true;
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
        norm_id,
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
      norm_id,
      date_create: new Date(),
    };
  }
}

export default MunicipalFacility;
