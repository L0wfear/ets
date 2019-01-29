
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
import { TechnicalOperationRegistry } from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/@types';
import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import memoize from 'memoize-one';

class FieldTechnicalOperationMissionTemplate extends React.PureComponent<PropsFieldTechnicalOperationMissionTemplate, StateFieldTechnicalOperationMissionTemplate> {
  componentDidMount() {
    this.getTechnicalOperations();
  }

  getTechnicalOperations() {
    this.props.actionGetAndSetInStoreTechnicalOperationRegistryForMission();
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

  makeOptionsByTechnicalOperationRegistryForMissionList = (
    memoize(
      (technicalOperationRegistryForMissionList: TechnicalOperationRegistry[]) => (
        technicalOperationRegistryForMissionList
          .map(defaultSelectListMapper)
      ),
    )
  );

  render() {
    const {
      props,
    } = this;

    const {
      technicalOperationRegistryForMissionList,
    } = props;

    const TECHNICAL_OPERATION_OPTIONS = this.makeOptionsByTechnicalOperationRegistryForMissionList(
      technicalOperationRegistryForMissionList,
    );

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
  (dispatch, { page, path }) => ({
    actionGetAndSetInStoreTechnicalOperationRegistryForMission: () => (
      dispatch(
        someUniqActions.actionGetAndSetInStoreTechnicalOperationRegistryForMission(
          {},
          {
            promise: true,
            page,
            path,
          },
        ),
      )
    ),
  }),
)(FieldTechnicalOperationMissionTemplate);
