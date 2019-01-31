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
import { MunicipalFacility } from 'redux-main/reducers/modules/some_uniq/municipal_facility/@types';
import memoize from 'memoize-one';
import { TechnicalOperationRegistry } from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/@types/index';
import { DefaultSelectOption } from 'components/ui/input/ReactSelect/utils';

class FieldMunicipalFacilityMissionTemplate extends React.PureComponent<PropsFieldMunicipalFacilityMissionTemplate, StateFieldMunicipalFacilityMissionTemplate> {
  componentDidMount() {
    const {
      technical_operation_id,
      technicalOperationRegistryForMissionList,
    } = this.props;

    if (technical_operation_id && technicalOperationRegistryForMissionList.length) {
      const selectedToData = technicalOperationRegistryForMissionList.find(({ id }) => technical_operation_id === id);
      if (selectedToData) {
        this.getMunicipalFacilitys(selectedToData);
      }
    }
  }

  componentDidUpdate(prevProps: PropsFieldMunicipalFacilityMissionTemplate) {
    const {
      technical_operation_id,
      technicalOperationRegistryForMissionList,
    } = this.props;

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

  async getMunicipalFacilitys(selectedToData: TechnicalOperationRegistry) {
    const { normatives } = selectedToData;

    const { municipalFacilityForMissionList } = await this.props.actionGetAndSetInStoreMunicipalFacilityRegistryForMission({
      start_date: new Date(),
      end_date: new Date(),
      norm_ids: normatives.map(({ id }) => id).join(','),
    });

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

  makeOptionsByMunicipalFacility = (
    memoize(
      (
        municipalFacilityList: MunicipalFacility[],
      ) => (
        municipalFacilityList.map<DefaultSelectOption<MunicipalFacility['municipal_facility_id'], MunicipalFacility['municipal_facility_name'], MunicipalFacility>>((mfData) => ({
          value: mfData.municipal_facility_id,
          label: mfData.municipal_facility_name,
          rowData: mfData,
        }))
      ),
    )
  );

  render() {
    const {
      props,
    } = this;

    const {
      municipalFacilityForMissionList,
    } = props;

    const MUNICIPAL_FACILITY_OPTIONS = this.makeOptionsByMunicipalFacility(
      municipalFacilityForMissionList,
    );

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
  (dispatch, { page, path }) => ({
    actionGetAndSetInStoreMunicipalFacilityRegistryForMission: (payload) => (
      dispatch(
        someUniqActions.actionGetAndSetInStoreMunicipalFacilityForMission(
          payload,
          {
            promise: true,
            page,
            path,
          },
        ),
      )
    ),
  }),
)(FieldMunicipalFacilityMissionTemplate);
