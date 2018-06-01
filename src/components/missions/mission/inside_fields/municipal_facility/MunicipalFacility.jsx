import * as React from 'react';
import * as PropTypes from 'prop-types';

import { FluxContext } from 'utils/decorators';

import Field from 'components/ui/Field.jsx';

@FluxContext
class MunicipalFacility extends React.Component {

  static get propTypes() {
    return {
      id: PropTypes.string,
      label: PropTypes.string,
      state: PropTypes.object,
      errors: PropTypes.object,
      disabled: PropTypes.bool,
      getNormIdFromState: PropTypes.bool,
      handleChange: PropTypes.func,
      getDataByNormatives: PropTypes.func,
      technicalOperationsList: PropTypes.arrayOf(PropTypes.object),
      clearable: PropTypes.bool,
      fromWaybill: PropTypes.bool,
      type_id: PropTypes.number,
      kind_task_ids: PropTypes.any,
    };
  }

  constructor(props) {
    super(props);
    let MUNICIPAL_FACILITY_OPTIONS = [];
    if (props.label && props.state[props.label]) {
      MUNICIPAL_FACILITY_OPTIONS = [{ value: props.state[props.id], label: props.state[props.label] }];
    }
    this.state = {
      forseUpdateIsWas: false,
      MUNICIPAL_FACILITY_OPTIONS,
      myDisable: true,
      ...this.getStateByProps(props),
    };
  }

  componentWillReceiveProps(props) {
    const {
      technical_operation_id: old_toi,
      date_start: old_ds,
      forseUpdateIsWas,
    } = this.state;
    let forseUpdate = false;
    const {
      technical_operation_id: new_toi,
      date_start: new_ds,
      value: new_v,
      error: new_err,
      norm_id,
      error_date_start,
      kind_task_ids,
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

    if (!error_date_start && ((!!new_toi && new_ds && (old_toi !== new_toi || old_ds !== new_ds) && forseUpdateIsWas) || forseUpdate)) {
      const {
        normatives,
        is_new,
      } = (newTechOperationsList.find(({ id }) => id === new_toi) || {});

      if (is_new) {
        const outerPayload = {
          start_date: new_ds,
          end_date: new_ds,
          kind_task_ids,
        };

        if (getNormIdFromState) {
          outerPayload.norm_ids = norm_id;
        } else {
          outerPayload.norm_ids = normatives.map(({ id }) => id).join(',');
        }

        this.getCleaningMunicipalFacilityList(outerPayload, new_v);
      }

      newState.technical_operation_id = new_toi;
      newState.date_start = new_ds;
      newState.forseUpdateIsWas = true;
    } else if (!new_ds || !old_ds) {
      newState.myDisable = true;
    }

    this.setState({ ...newState });
  }

  getCleaningMunicipalFacilityList = (outerPayload, new_v) => {
    this.context.flux.getActions('missions').getCleaningMunicipalFacilityList(outerPayload).then(({ result: { rows = [] } = {} }) => {
      if (new_v) {
        this.props.getDataByNormatives(rows.find(({ municipal_facility_id }) => municipal_facility_id === new_v).normatives);
      }
      let MUNICIPAL_FACILITY_OPTIONS = rows.map(({ municipal_facility_id: value, municipal_facility_name: label, normatives }) => ({ value, label, normatives }));
      const { type_id } = this.props;

      if (this.props.fromWaybill && type_id) {
        MUNICIPAL_FACILITY_OPTIONS = rows.reduce((arr, element) => {
          if (element.car_func_types.find(({ id }) => id === type_id)) {
            const {
              municipal_facility_id,
              municipal_facility_name,
              norm_id,
            } = element;
            arr.push({ value: municipal_facility_id, label: municipal_facility_name, norm_id });
          }

          return arr;
        }, []);
      }
      this.setState({
        myDisable: false,
        MUNICIPAL_FACILITY_OPTIONS,
      });
    });
  }

  getStateByProps = (props) => {
    const {
      state: {
        [props.id]: value,
        technical_operation_id,
        date_start,
        norm_id,
      } = {},
      errors: {
        [props.id]: error,
        date_start: error_date_start,
      },
      kind_task_ids,
    } = props;

    return {
      technical_operation_id,
      date_start,
      value,
      error,
      norm_id,
      error_date_start,
      kind_task_ids,
    };
  };

  handleChange = (value, option) => {
    this.props.handleChange('municipal_facility_id', value);
    this.props.handleChange('municipal_facility_name', '');

    if (value) {
      this.props.getDataByNormatives(option.normatives);
    }
  }

  render() {
    const {
      disabled = false,
      clearable = true,
    } = this.props;
    const {
      value,
      error,
      MUNICIPAL_FACILITY_OPTIONS,
      myDisable,
    } = this.state;

    return (
      <Field
        id={this.props.id}
        type="select"
        label="Элемент"
        error={error}
        disabled={disabled || myDisable}
        options={MUNICIPAL_FACILITY_OPTIONS}
        value={value}
        onChange={this.handleChange}
        clearable={clearable}
      />
    );
  }
}

export default MunicipalFacility;
