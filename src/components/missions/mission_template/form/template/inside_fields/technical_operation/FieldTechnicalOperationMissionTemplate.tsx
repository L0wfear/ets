
import * as React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

import { ExtField } from 'components/ui/new/field/ExtField';
import { ReduxState } from 'redux-main/@types/state';
import {
  PropsFieldTechnicalOperationMissionTemplate,
  StatePropsFieldTechnicalOperationMissionTemplate,
  DispatchPropsFieldTechnicalOperationMissionTemplate,
  OwnPropsFieldTechnicalOperationMissionTemplate,
  StateFieldTechnicalOperationMissionTemplate,
} from 'components/missions/mission_template/form/template/inside_fields/technical_operation/FieldTechnicalOperationMissionTemplate.d';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { makeOptionsByTechnicalOperationRegistryForMissionList } from './makeOptions';

class FieldTechnicalOperationMissionTemplate extends React.PureComponent<PropsFieldTechnicalOperationMissionTemplate, StateFieldTechnicalOperationMissionTemplate> {
  state = {
    TECHNICAL_OPERATION_OPTIONS: [],
  };

  static getDerivedStateFromProps(nextProps: PropsFieldTechnicalOperationMissionTemplate) {
    const {
      value,
      name,
      technicalOperationRegistryForMissionList,
    } = nextProps;

    let TECHNICAL_OPERATION_OPTIONS = makeOptionsByTechnicalOperationRegistryForMissionList(
      technicalOperationRegistryForMissionList,
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
      this.props.actionResetTechnicalOperationRegistryForMission();
    }
  }
  getTechnicalOperations() {
    const { page, path } = this.props;

    this.props.actionGetAndSetInStoreTechnicalOperationRegistryForMission(
      {},
      { page, path },
    );
  }

  handleChange = (value, option) => {
    const { props } = this;

    if (value && value !== props.value) {
      props.onChange({
        technical_operation_id: value,
        technical_operation_name: get(option, 'label', null),
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

export default connect<StatePropsFieldTechnicalOperationMissionTemplate, DispatchPropsFieldTechnicalOperationMissionTemplate, OwnPropsFieldTechnicalOperationMissionTemplate, ReduxState>(
  (state) => ({
    technicalOperationRegistryForMissionList: getSomeUniqState(state).technicalOperationRegistryForMissionList,
  }),
  (dispatch: any) => ({
    actionGetAndSetInStoreTechnicalOperationRegistryForMission: (...arg) => (
      dispatch(
        someUniqActions.actionGetAndSetInStoreTechnicalOperationRegistryForMission(...arg),
      )
    ),
    actionResetTechnicalOperationRegistryForMission: (...arg) => (
      dispatch(
        someUniqActions.actionResetTechnicalOperationRegistryForMission(...arg),
      )
    ),
  }),
)(FieldTechnicalOperationMissionTemplate);
