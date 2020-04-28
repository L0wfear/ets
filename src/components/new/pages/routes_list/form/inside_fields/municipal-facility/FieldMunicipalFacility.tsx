import * as React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import { Flex } from 'global-styled/global-styled';
import { ReduxState } from 'redux-main/@types/state';
import {
  PropsMunicipalFacilityField,
  StateMunicipalFacilityField,
  StatePropsMunicipalFacilityField,
  DispatchPropsMunicipalFacilityField,
  OwnPropsMunicipalFacilityField,
} from 'components/new/pages/routes_list/form/inside_fields/municipal-facility/FieldMunicipalFacility.d';
import { isArray } from 'util';
import { actionGetMunicipalFacility } from 'redux-main/reducers/modules/some_uniq/municipal_facility/actions';

class MunicipalFacilityField extends React.PureComponent<PropsMunicipalFacilityField, StateMunicipalFacilityField> {
  constructor(props) {
    super(props);

    const MUNICIPAL_FACILITY_OPTIONS = [];
    const {
      value,
      name,
    } = props;

    if (value && name) {
      MUNICIPAL_FACILITY_OPTIONS.push({
        value, label: name,
      });
    }

    this.state = {
      MUNICIPAL_FACILITY_OPTIONS,
      myDisable: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { props } = this;
    const {
      normatives,
    } = props;

    const triggerOnUpdate = (
      normatives !== prevProps.normatives  // или изменилась ТО на форме
    );

    if (triggerOnUpdate) {
      const outerPayload = {
        start_date: new Date(),
        end_date: new Date(),
        norm_ids: normatives.map(({ id }) => id).join(','),
      };

      this.loadMunicipalFacility(outerPayload);
    }
  }

  loadMunicipalFacility(outerPayload) {
    this.props.dispatch(
      actionGetMunicipalFacility(outerPayload, { page: this.props.page, path: this.props.path }),
    ).then((municipal_facility_list) => {
      const { value } = this.props;

      const MUNICIPAL_FACILITY_OPTIONS = municipal_facility_list.map((mfData) => ({
        value: mfData.municipal_facility_id,
        label: mfData.municipal_facility_name,
        mfData,
      }));

      this.props.setMunicipalFacilityList(municipal_facility_list);

      if (value) {
        const mfOption = MUNICIPAL_FACILITY_OPTIONS.find((mfOptionData) => mfOptionData.value === value);
        if (mfOption) {
          let available_route_types = get(mfOption, ['mfData', 'route_types'], []);
          const { missionAvailableRouteTypes } = this.props;

          if (isArray(missionAvailableRouteTypes)) {
            available_route_types = available_route_types.filter((slug) => missionAvailableRouteTypes.includes(slug));
          }
          this.props.onChange({
            available_route_types,
          });
        } else {
          this.props.onChange({
            available_route_types: [],
            municipal_facility_id: null,
            municipal_facility_name: null,
          });
        }
      }

      this.setState({ MUNICIPAL_FACILITY_OPTIONS });
    });
  }

  handleChange = (value, option) => {
    if (value && value !== this.props.value) {
      this.props.onChange({
        municipal_facility_id: value,
        municipal_facility_name: value ? option.label : null,
        available_route_types: option.mfData.route_types,
        type: null,
        work_type_code: null,
      });
    }
  };

  render() {
    const {
      error,
      disabled,
      value,
      clearable,
      modalKey,
    } = this.props;

    return (
      <Flex grow={1} shrink={1} basis={200}>
        <ExtField
          id="municipal_facility_id"
          modalKey={modalKey}
          type="select"
          label="Элемент"
          error={error}
          disabled={disabled}
          options={this.state.MUNICIPAL_FACILITY_OPTIONS}
          value={value}
          onChange={this.handleChange}
          clearable={clearable}
        />
      </Flex>
    );
  }
}

export default connect<StatePropsMunicipalFacilityField, DispatchPropsMunicipalFacilityField, OwnPropsMunicipalFacilityField, ReduxState>(
  null,
  (dispatch: any) => ({
    dispatch,
  }),
)(MunicipalFacilityField);
