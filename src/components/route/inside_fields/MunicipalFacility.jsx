import MunicipalFacilityMission from 'components/missions/mission/inside_fields/municipal_facility/MunicipalFacility.jsx';

class MunicipalFacility extends MunicipalFacilityMission {
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
      created_at: date,
      norm_id,
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
        is_new = true,
      } = (newTechOperationsList.find(({ id }) => id === new_toi) || {});

      if (is_new) {
        const outerPayload = {
          start_date: date,
          end_date: date,
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

  getStateByProps = (props) => {
    const {
      state: {
        [props.id]: value,
        technical_operation_id,
        created_at,
        norm_id,
      } = {},
      errors: {
        [props.id]: error,
      },
    } = props;

    return {
      technical_operation_id,
      created_at,
      value,
      error,
      norm_id,
    };
  };
}

export default MunicipalFacility;
