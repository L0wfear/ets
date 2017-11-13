import * as React from 'react';

import { FluxContext } from 'utils/decorators';

import Field from 'components/ui/Field.jsx';

@FluxContext
class MunicipalFacility extends React.Component {

  static get propTypes() {
    return {
      state: React.PropTypes.object,
      errors: React.PropTypes.object,
      disabled: React.PropTypes.bool,
      fromOrder: React.PropTypes.bool,
      handleChange: React.PropTypes.func,
      getDataByNormId: React.PropTypes.func,
      technicalOperationsList: React.PropTypes.arrayOf(React.PropTypes.object),
      clearable: React.PropTypes.bool,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      forseUpdateIsWas: false,
      MUNICIPAL_FACILITY_OPTIONS: [],
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
    } = this.getStateByProps(props);
    const {
      technicalOperationsList: newTechOperationsList = [],
      fromOrder,
    } = props;

    const newState = {
      value: new_v,
      error: new_err,
    };
    if (!forseUpdateIsWas && newTechOperationsList.length > 0 && new_toi) {
      forseUpdate = true;
    }

    if ((!!new_toi && new_ds && (old_toi !== new_toi || old_ds !== new_ds) && forseUpdateIsWas) || forseUpdate) {
      const {
        norm_ids = [],
        is_new,
      } = (newTechOperationsList.find(({ id }) => id === new_toi) || {});

      if (is_new) {
        const outerPayload = {
          start_date: new_ds,
          end_date: new_ds,
        };

        if (fromOrder) {
          outerPayload.norm_ids = norm_id;
        } else {
          outerPayload.norm_ids = norm_ids.join(',');
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
        this.props.getDataByNormId(rows.find(({ municipal_facility_id }) => municipal_facility_id === new_v).norm_id);
      }
      this.setState({
        myDisable: false,
        MUNICIPAL_FACILITY_OPTIONS: rows.map(({ municipal_facility_id: value, municipal_facility_name: label, norm_id }) => ({ value, label, norm_id })),
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
      },
    } = props;

    return {
      technical_operation_id,
      date_start,
      value,
      error,
      norm_id,
    };
  };

  handleChange = (value) => {
    const {
      MUNICIPAL_FACILITY_OPTIONS = [],
    } = this.state;
    this.props.handleChange('municipal_facility_id', value);
    if (value) {
      this.props.getDataByNormId(MUNICIPAL_FACILITY_OPTIONS.find(({ value: m_value }) => m_value === value).norm_id);
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
