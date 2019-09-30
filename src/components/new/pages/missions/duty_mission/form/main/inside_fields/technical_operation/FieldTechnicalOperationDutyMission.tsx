
import * as React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import { ReduxState } from 'redux-main/@types/state';
import {
  PropsFieldTechnicalOperationDutyMission,
  StatePropsFieldTechnicalOperationDutyMission,
  DispatchPropsFieldTechnicalOperationDutyMission,
  OwnPropsFieldTechnicalOperationDutyMission,
  StateFieldTechnicalOperationDutyMission,
} from 'components/new/pages/missions/duty_mission/form/main/inside_fields/technical_operation/FieldTechnicalOperationDutyMission.d';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { makeOptionsByTechnicalOperationRegistryForMissionList } from './makeOptions';

/**
 * Поле "Техническая операция" для формы наряд-задания
 * не зависит от других полей
 * если !isPermitted, то не будет запроса за ТО
 */
class FieldTechnicalOperationDutyMission extends React.PureComponent<PropsFieldTechnicalOperationDutyMission, StateFieldTechnicalOperationDutyMission> {
  state = {
    TECHNICAL_OPERATION_OPTIONS: [],
  };

  static getDerivedStateFromProps(nextProps: PropsFieldTechnicalOperationDutyMission) {
    const {
      value,
      name,
      technicalOperationRegistryForDutyMissionList,
    } = nextProps;

    let TECHNICAL_OPERATION_OPTIONS = makeOptionsByTechnicalOperationRegistryForMissionList(
      technicalOperationRegistryForDutyMissionList,
    );

    const hasNotValueInOptions = value && !TECHNICAL_OPERATION_OPTIONS.some((toData) => (
      toData.value === value
    ));

    if (hasNotValueInOptions) {
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
      IS_TEMPLATE,
      DUTY_MISSION_IS_ORDER_SOURCE,
      page, path,
    } = this.props;

    const payload: any = {};
    if (!DUTY_MISSION_IS_ORDER_SOURCE && !IS_TEMPLATE) {
      payload.kind_task_ids = 3;
    }

    this.props.actionGetAndSetInStoreTechnicalOperationRegistryForDutyMission(
      payload,
      { page, path },
    );
  }

  handleChange = (value, option) => {
    const { props } = this;

    if (value !== props.value) {
      props.onChange({
        technical_operation_id: value,
        technical_operation_name: get(option, 'label', ''),
        municipal_facility_id: null,
        municipal_facility_name: '',
        route_id: null,
        route_name: '',
        route_type: '',
        object_type_id: null,
        object_type_name: '',
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

export default connect<StatePropsFieldTechnicalOperationDutyMission, DispatchPropsFieldTechnicalOperationDutyMission, OwnPropsFieldTechnicalOperationDutyMission, ReduxState>(
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
)(FieldTechnicalOperationDutyMission);
