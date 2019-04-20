
import * as React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

import { ExtField } from 'components/ui/new/field/ExtField';
import { ReduxState } from 'redux-main/@types/state';
import {
  PropsFieldMunicipalFacilityIdDutyMission,
  StatePropsFieldMunicipalFacilityIdDutyMission,
  DispatchPropsFieldMunicipalFacilityIdDutyMission,
  OwnPropsFieldMunicipalFacilityIdDutyMission,
  StateFieldMunicipalFacilityIdDutyMission,
} from 'components/new/pages/missions/duty_mission/form/main/inside_fields/municipal_facility_id/FieldMunicipalFacilityIdDutyMission.d';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { TechnicalOperationRegistry } from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/@types';
import { makeOptionsByMunicipalFacilityIdRegistryForDutyMissionList } from './makeOptions';

/**
 * Поле "Элемент" для формы наряд-задания
 * зависит от выбранной технической операции ("normatives")
 * если !isPermitted, то не будет запроса за ТО
 */
class FieldMunicipalFacilityIdDutyMission extends React.PureComponent<PropsFieldMunicipalFacilityIdDutyMission, StateFieldMunicipalFacilityIdDutyMission> {
  state = {
    MUNICIPAL_FACILITY_OPTIONS: [],
  };

  static getDerivedStateFromProps(nextProps: PropsFieldMunicipalFacilityIdDutyMission) {
    const {
      value,
      name,
      municipalFacilityForDutyMissionList,
    } = nextProps;

    let MUNICIPAL_FACILITY_OPTIONS = makeOptionsByMunicipalFacilityIdRegistryForDutyMissionList(
      municipalFacilityForDutyMissionList,
    );

    const notElementInOptions = value && !MUNICIPAL_FACILITY_OPTIONS.some((toData) => (
      toData.value === value
    ));

    if (notElementInOptions) {
      MUNICIPAL_FACILITY_OPTIONS = [
        ...MUNICIPAL_FACILITY_OPTIONS,
        {
          value,
          label: name,
          rowData: {
            municipal_facility_id: value,
            municipal_facility_name: name,
          },
        },
      ];
    }

    return {
      MUNICIPAL_FACILITY_OPTIONS,
    };
  }

  componentDidMount() {
    const {
      isPermitted,
      technical_operation_id,
      technicalOperationRegistryForDutyMissionList,
    } = this.props;

    if (isPermitted && technical_operation_id && technicalOperationRegistryForDutyMissionList.length) {
      const selectedToData = technicalOperationRegistryForDutyMissionList.find(({ id }) => technical_operation_id === id);
      if (selectedToData) {
        this.getMunicipalFacilitys(selectedToData);
      }
    }
  }

  componentDidUpdate(prevProps: PropsFieldMunicipalFacilityIdDutyMission) {
    const {
      isPermitted,
      technical_operation_id,
      technicalOperationRegistryForDutyMissionList,
    } = this.props;

    if (isPermitted) {
      const isDiffTechnicalOperationId = (prevProps.technical_operation_id !== technical_operation_id);

      // если изменилась ТО и есть данные, откуда брать normatives
      const triggerOnUpdate = (
        technical_operation_id
        && (
          (
            isDiffTechnicalOperationId
            && technicalOperationRegistryForDutyMissionList.length
          )
          || !prevProps.technicalOperationRegistryForDutyMissionList.length
        )
      );

      if (triggerOnUpdate) {
        const selectedToData = technicalOperationRegistryForDutyMissionList.find(({ id }) => technical_operation_id === id);
        if (selectedToData) {
          this.getMunicipalFacilitys(selectedToData);
        }
      } else if (isDiffTechnicalOperationId && !technical_operation_id && this.props.value) {
        this.props.onChange({
          municipal_facility_id: null,
          municipal_facility_name: '',
        });
      }
    }
  }

  componentWillUnmount() {
    if (this.props.isPermitted) {
      this.props.actionResetMunicipalFacilityForDutyMission();
    }
  }

  async getMunicipalFacilitys(selectedToData: TechnicalOperationRegistry) {
    const { normatives } = selectedToData;
    const {
      IS_TEMPLATE,
      DUTY_MISSION_IS_ORDER_SOURCE,
      page, path,
    } = this.props;

    const payload: any = {
      start_date: new Date(),
      end_date: new Date(),
      norm_ids: normatives.map(({ id }) => id).join(','),
    };
    if (!DUTY_MISSION_IS_ORDER_SOURCE && !IS_TEMPLATE) {
      payload.kind_task_ids = 3;
    }

    const { municipalFacilityForDutyMissionList } = await this.props.actionGetAndSetInStoreMunicipalFacilityForDutyMission(
      payload,
      { page, path },
    );

    const { value } = this.props;

    const hasCurrentMunicipaFacilityInList = municipalFacilityForDutyMissionList.find((mfData) => mfData.municipal_facility_id === value);
    if (!hasCurrentMunicipaFacilityInList && value) {
      this.props.onChange({
        municipal_facility_id: null,
        municipal_facility_name: '',
      });
    }
  }

  handleChange = (value, option) => {
    const { props } = this;

    if (value !== props.value) {
      props.onChange({
        municipal_facility_id: value,
        municipal_facility_name: get(option, 'label', null),
      });
    }
  }

  render() {
    const {
      props,
    } = this;

    const {
      MUNICIPAL_FACILITY_OPTIONS,
    } = this.state;

    return (
      <ExtField
        id="municipal_facility_id"
        modalKey={props.page}
        type="select"
        label="Элемент"
        options={MUNICIPAL_FACILITY_OPTIONS}
        value={props.value}
        error={props.error}
        onChange={this.handleChange}
        disabled={props.disabled}
        clearable={false}
      />
    );
  }
}

export default connect<StatePropsFieldMunicipalFacilityIdDutyMission, DispatchPropsFieldMunicipalFacilityIdDutyMission, OwnPropsFieldMunicipalFacilityIdDutyMission, ReduxState>(
  (state) => ({
    municipalFacilityForDutyMissionList: getSomeUniqState(state).municipalFacilityForDutyMissionList,
    technicalOperationRegistryForDutyMissionList: getSomeUniqState(state).technicalOperationRegistryForDutyMissionList,
  }),
  (dispatch: any) => ({
    actionGetAndSetInStoreMunicipalFacilityForDutyMission: (...arg) => (
      dispatch(
        someUniqActions.actionGetAndSetInStoreMunicipalFacilityForDutyMission(...arg),
      )
    ),
    actionResetMunicipalFacilityForDutyMission: (...arg) => (
      dispatch(
        someUniqActions.actionResetMunicipalFacilityForDutyMission(...arg),
      )
    ),
  }),
)(FieldMunicipalFacilityIdDutyMission);
