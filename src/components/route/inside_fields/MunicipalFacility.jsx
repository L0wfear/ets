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
          start_date: new Date(),
          end_date: new Date(),
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

  getCleaningMunicipalFacilityList = (outerPayload, new_v) => {
    this.context.flux.getActions('missions').getCleaningMunicipalFacilityList(outerPayload).then(({ result: { rows = [] } = {} }) => {
      if (new_v) {
        this.props.getDataByNormId(rows.find(({ municipal_facility_id }) => municipal_facility_id === new_v));
      }
      const MUNICIPAL_FACILITY_OPTIONS = rows.map(({ municipal_facility_id: value, municipal_facility_name: label, norm_id, route_types }) => ({ value, label, norm_id, route_types }));

      this.setState({
        myDisable: false,
        MUNICIPAL_FACILITY_OPTIONS,
      });
    });
  }

  handleChange = (value) => {
    const {
      MUNICIPAL_FACILITY_OPTIONS = [],
    } = this.state;
    this.props.handleChange('municipal_facility_id', value);
    if (value) {
      this.props.getDataByNormId(MUNICIPAL_FACILITY_OPTIONS.find(({ value: m_value }) => m_value === value));
    }
  }

  getStateByProps = (props) => {
    const {
      state: {
        [props.id]: value,
        technical_operation_id,
        norm_id,
      } = {},
      errors: {
        [props.id]: error,
      },
    } = props;

    return {
      technical_operation_id,
      value,
      error,
      norm_id,
    };
  };
}

export default MunicipalFacility;
