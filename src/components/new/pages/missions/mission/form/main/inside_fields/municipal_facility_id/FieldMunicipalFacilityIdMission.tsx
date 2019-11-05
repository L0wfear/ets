
import * as React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

import { ExtField } from 'components/old/ui/new/field/ExtField';
import { ReduxState } from 'redux-main/@types/state';
import {
  PropsFieldMunicipalFacilityIdMission,
  StatePropsFieldMunicipalFacilityIdMission,
  DispatchPropsFieldMunicipalFacilityIdMission,
  OwnPropsFieldMunicipalFacilityIdMission,
  StateFieldMunicipalFacilityIdMission,
} from 'components/new/pages/missions/mission/form/main/inside_fields/municipal_facility_id/FieldMunicipalFacilityIdMission.d';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { TechnicalOperationRegistry } from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/@types';
import { makeOptionsByMunicipalFacilityIdRegistryForMissionList } from './makeOptions';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';

class FieldMunicipalFacilityIdMission extends React.PureComponent<PropsFieldMunicipalFacilityIdMission, StateFieldMunicipalFacilityIdMission> {
  state = {
    MUNICIPAL_FACILITY_OPTIONS: [],
  };

  static getDerivedStateFromProps(nextProps: PropsFieldMunicipalFacilityIdMission) {
    const {
      value,
      name,
      municipalFacilityForMissionList,
    } = nextProps;

    let MUNICIPAL_FACILITY_OPTIONS = makeOptionsByMunicipalFacilityIdRegistryForMissionList(
      municipalFacilityForMissionList,
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
      date_start,
      technical_operation_id,
      technicalOperationRegistryForMissionList,
    } = this.props;

    if (technical_operation_id && technicalOperationRegistryForMissionList.length) {
      const selectedToData = technicalOperationRegistryForMissionList.find(({ id }) => technical_operation_id === id);
      if (selectedToData && date_start) {
        this.getMunicipalFacilitys(selectedToData, date_start);
      }
    }
  }

  componentDidUpdate(prevProps: PropsFieldMunicipalFacilityIdMission) {
    const {
      date_start,
      technical_operation_id,
      technicalOperationRegistryForMissionList,
    } = this.props;

    const prev_normatives = (get(prevProps.technicalOperationRegistryForMissionList.find(({ id }) => technical_operation_id === id), 'normatives') || []).map(({ id }) => id).toString();
    const normatives = (get(technicalOperationRegistryForMissionList.find(({ id }) => technical_operation_id === id), 'normatives') || []).map(({ id }) => id).toString();

    const isDiffTechnicalOperationId = (
      prevProps.technical_operation_id !== technical_operation_id
      || prev_normatives !== normatives
    );

    const triggerOnUpdate = (
      technical_operation_id
      && (
        (
          isDiffTechnicalOperationId
          && technicalOperationRegistryForMissionList.length
        )
        || !prevProps.technicalOperationRegistryForMissionList.length
        || date_start !== prevProps.date_start
      )
    );

    if (triggerOnUpdate) {
      const selectedToData = technicalOperationRegistryForMissionList.find(({ id }) => technical_operation_id === id);
      if (selectedToData) {
        this.getMunicipalFacilitys(selectedToData, date_start);
      }
    } else if (isDiffTechnicalOperationId && !technical_operation_id && this.props.value) {
      this.handleChange(null);
    }
  }

  componentWillUnmount() {
    this.props.actionResetMunicipalFacilityForMission();
  }

  async getMunicipalFacilitys(selectedToData: TechnicalOperationRegistry, date_start: Mission['date_start']) {
    const { normatives } = selectedToData;
    const {
      IS_TEMPLATE,
      MISSION_IS_ORDER_SOURCE,
      page, path,
    } = this.props;

    const payload: any = {
      start_date: date_start,
      end_date: date_start,
      norm_ids: normatives.map(({ id }) => id).join(','),
    };
    if (!MISSION_IS_ORDER_SOURCE && !IS_TEMPLATE) {
      payload.kind_task_ids = 3;
    }

    const municipalFacilityForMissionList = await this.props.actionGetAndSetInStoreMunicipalFacilityForMission(
      payload,
      { page, path },
    );

    const { value } = this.props;

    const hasCurrentMunicipaFacilityInList = municipalFacilityForMissionList.find((mfData) => mfData.municipal_facility_id === value);
    if (!hasCurrentMunicipaFacilityInList && value) {
      this.handleChange(null);
    }
  }

  handleChange = (value, option?) => {
    const { props } = this;

    if (value !== props.value) {
      props.onChange({
        municipal_facility_id: value,
        municipal_facility_name: get(option, 'label', ''),
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

export default connect<StatePropsFieldMunicipalFacilityIdMission, DispatchPropsFieldMunicipalFacilityIdMission, OwnPropsFieldMunicipalFacilityIdMission, ReduxState>(
  (state) => ({
    municipalFacilityForMissionList: getSomeUniqState(state).municipalFacilityForMissionList,
    technicalOperationRegistryForMissionList: getSomeUniqState(state).technicalOperationRegistryForMissionList,
  }),
  (dispatch: any) => ({
    actionGetAndSetInStoreMunicipalFacilityForMission: (...arg) => (
      dispatch(
        someUniqActions.actionGetAndSetInStoreMunicipalFacilityForMission(...arg),
      )
    ),
    actionResetMunicipalFacilityForMission: (...arg) => (
      dispatch(
        someUniqActions.actionResetMunicipalFacilityForMission(...arg),
      )
    ),
  }),
)(FieldMunicipalFacilityIdMission);
