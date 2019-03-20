import * as React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

import { ExtField } from 'components/ui/new/field/ExtField';
import { ReduxState } from 'redux-main/@types/state';
import {
  PropsFieldMunicipalFacilityMissionTemplate,
  StatePropsFieldMunicipalFacilityMissionTemplate,
  DispatchPropsFieldMunicipalFacilityMissionTemplate,
  OwnPropsFieldMunicipalFacilityMissionTemplate,
  StateFieldMunicipalFacilityMissionTemplate,
} from 'components/missions/mission_template/form/template/inside_fields/municipal_facility/FieldMunicipalFacilityMissionTemplate.d';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { TechnicalOperationRegistry } from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/@types/index';
import { makeOptionsByMunicipalFacilityIdRegistryForMissionList } from './makeOptions';

class FieldMunicipalFacilityMissionTemplate extends React.PureComponent<PropsFieldMunicipalFacilityMissionTemplate, StateFieldMunicipalFacilityMissionTemplate> {
  state = {
    MUNICIPAL_FACILITY_OPTIONS: [],
  };

  static getDerivedStateFromProps(nextProps: PropsFieldMunicipalFacilityMissionTemplate) {
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
      isPermitted,
      technical_operation_id,
      technicalOperationRegistryForMissionList,
    } = this.props;

    if (isPermitted && technical_operation_id && technicalOperationRegistryForMissionList.length) {
      const selectedToData = technicalOperationRegistryForMissionList.find(({ id }) => technical_operation_id === id);
      if (selectedToData) {
        this.getMunicipalFacilitys(selectedToData);
      }
    }
  }

  componentDidUpdate(prevProps: PropsFieldMunicipalFacilityMissionTemplate) {
    const {
      isPermitted,
      technical_operation_id,
      technicalOperationRegistryForMissionList,
    } = this.props;

    if (isPermitted) {
      const isDiffTechnicalOperationId = (prevProps.technical_operation_id !== technical_operation_id);

      const triggerOnUpdate = (
        technical_operation_id
        && (
          (
            isDiffTechnicalOperationId
            && technicalOperationRegistryForMissionList.length
          )
          || !prevProps.technicalOperationRegistryForMissionList.length
        )
      );

      if (triggerOnUpdate) {
        const selectedToData = technicalOperationRegistryForMissionList.find(({ id }) => technical_operation_id === id);
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
      this.props.actionResetMunicipalFacilityForMission();
    }
  }

  async getMunicipalFacilitys(selectedToData: TechnicalOperationRegistry) {
    const { normatives } = selectedToData;
    const { page, path } = this.props;

    const { municipalFacilityForMissionList } = await this.props.actionGetAndSetInStoreMunicipalFacilityRegistryForMission(
      {
        start_date: new Date(),
        end_date: new Date(),
        norm_ids: normatives.map(({ id }) => id).join(','),
      },
      { page, path },
    );

    const { value } = this.props;

    const hasCurrentMunicipaFacilityInList = municipalFacilityForMissionList.find((mfData) => mfData.municipal_facility_id === value);
    if (!hasCurrentMunicipaFacilityInList && value) {
      this.props.onChange({
        municipal_facility_id: null,
        municipal_facility_name: '',
      });
    }
  }

  handleChange = (value, option) => {
    const { props } = this;

    if (value && value !== props.value) {
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
        error={props.error}
        disabled={props.disabled}
        options={MUNICIPAL_FACILITY_OPTIONS}
        value={props.value}
        onChange={this.handleChange}
        clearable={false}
      />
    );
  }
}

export default connect<StatePropsFieldMunicipalFacilityMissionTemplate, DispatchPropsFieldMunicipalFacilityMissionTemplate, OwnPropsFieldMunicipalFacilityMissionTemplate, ReduxState>(
  (state) => ({
    technicalOperationRegistryForMissionList: getSomeUniqState(state).technicalOperationRegistryForMissionList,
    municipalFacilityForMissionList: getSomeUniqState(state).municipalFacilityForMissionList,
  }),
  (dispatch: any) => ({
    actionGetAndSetInStoreMunicipalFacilityRegistryForMission: (...arg) => (
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
)(FieldMunicipalFacilityMissionTemplate);
