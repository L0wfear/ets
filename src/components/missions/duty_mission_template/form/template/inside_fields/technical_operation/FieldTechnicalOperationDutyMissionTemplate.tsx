
import * as React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

import { ExtField } from 'components/ui/new/field/ExtField';
import { ReduxState } from 'redux-main/@types/state';
import {
  PropsFieldTechnicalOperationDutyMissionTemplate,
  StatePropsFieldTechnicalOperationDutyMissionTemplate,
  DispatchPropsFieldTechnicalOperationDutyMissionTemplate,
  OwnPropsFieldTechnicalOperationDutyMissionTemplate,
  StateFieldTechnicalOperationDutyMissionTemplate,
} from 'components/missions/duty_mission_template/form/template/inside_fields/technical_operation/FieldTechnicalOperationDutyMissionTemplate.d';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { makeOptionsByTechnicalOperationRegistryForMissionList } from './makeOptions';

class FieldTechnicalOperationDutyMissionTemplate extends React.PureComponent<PropsFieldTechnicalOperationDutyMissionTemplate, StateFieldTechnicalOperationDutyMissionTemplate> {
  state = {
    TECHNICAL_OPERATION_OPTIONS: [],
  };

  static getDerivedStateFromProps(nextProps: PropsFieldTechnicalOperationDutyMissionTemplate) {
    const {
      value,
      name,
      technicalOperationRegistryForDutyMissionList,
    } = nextProps;

    let TECHNICAL_OPERATION_OPTIONS = makeOptionsByTechnicalOperationRegistryForMissionList(
      technicalOperationRegistryForDutyMissionList,
    );

    const notAvtiveEmployee = value && !TECHNICAL_OPERATION_OPTIONS.some((toData) => (
      toData.value === value
    ));

    if (notAvtiveEmployee) {
      TECHNICAL_OPERATION_OPTIONS = [
        ...TECHNICAL_OPERATION_OPTIONS,
        {
          value,
          label: name,
          rowData: {
            id: value,
            name,
          },
        },
      ];
    }

    return {
      TECHNICAL_OPERATION_OPTIONS,
    };
  }

  componentDidMount() {
    if (this.props.isPermitted) {
      this.getTechnicalOperations();
    }
  }

  componentWillUnmount() {
    if (this.props.isPermitted) {
      this.props.actionResetTechnicalOperationRegistryForDutyMission();
    }
  }

  getTechnicalOperations() {
    const {
      page, path,
    } = this.props;

    this.props.actionGetAndSetInStoreTechnicalOperationRegistryForDutyMission(
      {},
      { page, path },
    );
  }

  handleChange = (value, option) => {
    const { props } = this;

    if (value && value !== props.value) {
      props.onChange({
        technical_operation_id: value,
        technical_operation_name: get(option, 'label', ''),
      });
    }
  }

  render() {
    const {
      props,
    } = this;

    const {
      TECHNICAL_OPERATION_OPTIONS,
    } = this.state;

    return (
      <ExtField
        id="technical_operation_id"
        modalKey={props.page}
        type="select"
        label="Технологическая операция"
        options={TECHNICAL_OPERATION_OPTIONS}
        value={props.value}
        error={props.error}
        onChange={this.handleChange}
        disabled={props.disabled}
        clearable={false}
      />
    );
  }
}

export default connect<StatePropsFieldTechnicalOperationDutyMissionTemplate, DispatchPropsFieldTechnicalOperationDutyMissionTemplate, OwnPropsFieldTechnicalOperationDutyMissionTemplate, ReduxState>(
  (state) => ({
    technicalOperationRegistryForDutyMissionList: getSomeUniqState(state).technicalOperationRegistryForDutyMissionList,
  }),
  (dispatch: any) => ({
    actionGetAndSetInStoreTechnicalOperationRegistryForDutyMission: (...arg) => (
      dispatch(
        someUniqActions.actionGetAndSetInStoreTechnicalOperationRegistryForDutyMission(...arg),
      )
    ),
    actionResetTechnicalOperationRegistryForDutyMission: (...arg) => (
      dispatch(
        someUniqActions.actionResetTechnicalOperationRegistryForDutyMission(...arg),
      )
    ),
  }),
)(FieldTechnicalOperationDutyMissionTemplate);
