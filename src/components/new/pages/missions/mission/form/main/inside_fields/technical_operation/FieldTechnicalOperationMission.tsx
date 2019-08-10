
import * as React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

import { ExtField } from 'components/old/ui/new/field/ExtField';
import { ReduxState } from 'redux-main/@types/state';
import {
  PropsFieldTechnicalOperationMission,
  StatePropsFieldTechnicalOperationMission,
  DispatchPropsFieldTechnicalOperationMission,
  OwnPropsFieldTechnicalOperationMission,
  StateFieldTechnicalOperationMission,
} from 'components/new/pages/missions/mission/form/main/inside_fields/technical_operation/FieldTechnicalOperationMission.d';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { makeOptionsByTechnicalOperationRegistryForMissionList } from './makeOptions';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';

class FieldTechnicalOperationMission extends React.PureComponent<PropsFieldTechnicalOperationMission, StateFieldTechnicalOperationMission> {
  state = {
    TECHNICAL_OPERATION_OPTIONS: [],
  };

  static getDerivedStateFromProps(nextProps: PropsFieldTechnicalOperationMission) {
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
    const {
      isPermitted,
      car_ids,
      for_column,
    } = this.props;

    if (isPermitted) {
      if (this.props.isPermitted && car_ids.length) {
        this.getTechnicalOperations(car_ids, for_column);
      }
    }
  }

  componentDidUpdate(prevProps) {
    const {
      isPermitted,
      car_ids,
      for_column,
    } = this.props;

    if (isPermitted) {
      if (car_ids !== prevProps.car_ids) {
        if (car_ids.length) {
          this.getTechnicalOperations(car_ids, for_column);
        } else {
          this.handleChange(null);
        }
      }
    }
  }

  componentWillUnmount() {
    if (this.props.isPermitted) {
      this.props.actionResetTechnicalOperationRegistryForMission();
    }
  }

  async getTechnicalOperations(car_ids: Mission['car_ids'], for_column: Mission['for_column']) {
    const {
      IS_TEMPLATE,
      MISSION_IS_ORDER_SOURCE,
      page, path,
    } = this.props;

    const payload: any = {
      car_ids: car_ids.toString(),
    };

    if (!MISSION_IS_ORDER_SOURCE && !IS_TEMPLATE) {
      payload.kind_task_ids = 3;
    }

    if (for_column) {
      payload.for_column = true; // ТО только по ОДХ
    }

    const { technicalOperationRegistryForMissionList } = await this.props.actionGetAndSetInStoreTechnicalOperationRegistryForMission(
      payload,
      { page, path },
    );

    if (!technicalOperationRegistryForMissionList.find(({ id }) => id === this.props.value)) {
      this.handleChange(null);
    }
  }

  handleChange = (value, option?) => {
    const { props } = this;

    if (value !== props.value) {
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

export default connect<StatePropsFieldTechnicalOperationMission, DispatchPropsFieldTechnicalOperationMission, OwnPropsFieldTechnicalOperationMission, ReduxState>(
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
)(FieldTechnicalOperationMission);
