import * as React from 'react';

import { FluxContext } from 'utils/decorators';

import Field from 'components/ui/Field.jsx';

const getStateByProps = (props) => {
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
};

@FluxContext
class MunicipalFacility extends React.Component {

  static get propTypes() {
    return {
      disabled: React.PropTypes.bool,
      handleChange: React.PropTypes.func,
      getDataByNormId: React.PropTypes.func,
      technicalOperationsList: React.PropTypes.arrayOf(React.PropTypes.object),
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      forseUpdateIsWas: false,
      MUNICIPAL_FACILITY_OPTIONS: [],
      myDisable: true,
      ...getStateByProps(props),
    };
  }

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
    } = getStateByProps(props);
    const {
      technicalOperationsList: newTechOperationsList = [],
    } = props;

    const newState = {
      value: new_v,
    };
    if (!forseUpdateIsWas && newTechOperationsList.length > 0 && new_toi) {
      forseUpdate = true;
    }

    if ((!!new_toi && new_pds && (old_toi !== new_toi || old_pds !== new_pds) && new_v) || forseUpdate) {
      const {
        norm_ids = [],
      } = (newTechOperationsList.find(({ id }) => id === new_toi) || {});

      const outerPyload = {
        norm_ids: norm_ids.join(','),
        start_date: new_pds,
        end_date: new_pds,
      };
      this.context.flux.getActions('missions').getCleaningMunicipalFacilityList(outerPyload).then(({ result: { rows = [] } = {} }) => {
        this.setState({
          myDisable: false,
          MUNICIPAL_FACILITY_OPTIONS: rows.map(({ municipal_facility_id: value, municipal_facility_name: label, norm_id }) => ({ value, label, norm_id })),
        });
      });
      newState.technical_operation_id = new_toi;
      newState.plan_date_start = new_pds;
      newState.forseUpdateIsWas = true;
    } else if (!new_pds || !old_pds) {
      newState.myDisable = true;
    }

    this.setState({ ...newState });
  }

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
      />
    );
  }
}

export default MunicipalFacility;
