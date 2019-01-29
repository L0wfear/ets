
import * as React from 'react';
import { connect } from 'react-redux';

import { ExtField } from 'components/ui/new/field/ExtField';
import { ReduxState } from 'redux-main/@types/state';
import {
  PropsFieldCarIdsMissionTemplate,
  StatePropsFieldCarIdsMissionTemplate,
  DispatchPropsFieldCarIdsMissionTemplate,
  OwnPropsFieldCarIdsMissionTemplate,
  StateFieldCarIdsMissionTemplate,
} from 'components/missions/mission_template/form/template/inside_fields/car_ids/FieldCarIdsMissionTemplate.d';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import memoize from 'memoize-one';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

class FieldCarIdsMissionTemplate extends React.PureComponent<PropsFieldCarIdsMissionTemplate, StateFieldCarIdsMissionTemplate> {
  state = {
    carList: [],
    carIndex: {},
  };

  componentDidMount() {
    const {
      municipal_facility_id,
      municipalFacilityForMissionList,
    } = this.props;

    if (municipal_facility_id && municipalFacilityForMissionList.length) {
      const selectedMfData = municipalFacilityForMissionList.find((mfData) => mfData.municipal_facility_id === municipal_facility_id);
      if (selectedMfData) {
        this.getCars(selectedMfData);
      }
    }
  }

  componentDidUpdate(prevProps) {
    const {
      value,
      for_column,
      municipal_facility_id,
      municipalFacilityForMissionList,
      structure_id,
    } = this.props;

    const isDiffMunicipalFacilityId = (prevProps.municipal_facility_id !== municipal_facility_id);

    const triggerOnUpdate = (
      municipal_facility_id
      && (
        (
          isDiffMunicipalFacilityId
          && municipalFacilityForMissionList.length
        )
        || !prevProps.municipalFacilityForMissionList.length
      )
    );

    if (triggerOnUpdate) {
      const selectedMfData = municipalFacilityForMissionList.find((mfData) => mfData.municipal_facility_id === municipal_facility_id);
      if (selectedMfData) {
        this.getCars(selectedMfData);
      }
    } else if (isDiffMunicipalFacilityId && !municipal_facility_id && value.length) {
      this.props.onChange({
        car_ids: [],
      });
    } else if (for_column !== prevProps.for_column) {
      this.props.onChange({
        car_ids: value ? value.slice(0, 1) : [],
      });
    } else if (structure_id !== prevProps.structure_id) {
      if (structure_id) {
        const newValue = value.filter((car_id) => (
          this.state.carIndex[car_id].is_common
          || this.state.carIndex[car_id].company_structure_id === structure_id
        ));

        if (newValue.length !== value.length) {
          this.props.onChange({
            car_ids: newValue,
          });
        }
      }
    }
  }

  async getCars(selectedMfData) {
    const { normatives } = selectedMfData;

    const {
      payload: {
        data,
        dataIndex,
      },
    } = await this.props.autobaseGetSetCar({
      norm_ids: normatives.map(({ id }) => id).join(','),
    });

    const {
      value,
    } = this.props;

    if (this.props.value) {
      this.props.onChange({
        car_ids: value.filter((car_id) => (
          dataIndex[car_id]
        )),
      });
    }

    this.setState({
      carList: data,
      carIndex: dataIndex,
    });
  }

  handleChange = (value) => {
    const { props } = this;
    const { for_column } = props;

    if (value !== props.value) {
      props.onChange({
        car_ids: for_column ? value : [value],
      });
    }
  }

  makeOptionsByCarIds = (
    memoize(
      (
        carList: StateFieldCarIdsMissionTemplate['carList'],
        structure_id: PropsFieldCarIdsMissionTemplate['structure_id'],
      ) => (
        carList.reduce((newArr, carData) => {
          if (!structure_id || carData.is_common || carData.company_structure_id === structure_id) {
            newArr.push({
              value: carData.asuods_id,
              label: `${carData.gov_number} [${carData.model_name || ''}${carData.model_name ? '/' : ''}${carData.special_model_name || ''}${carData.type_name ? '/' : ''}${carData.type_name || ''}]`,
              type_id: carData.type_id,
            });
          }

          return newArr;
        }, [])
      ),
    )
  );

  render() {
    const {
      props,
    } = this;

    const {
      value,
      for_column,
      structure_id,
    } = props;

    const {
      carList,
    } = this.state;

    const CARS = this.makeOptionsByCarIds(
      carList,
      structure_id,
    );

    return (
      <ExtField
        id="car_ids"
        modalKey={props.page}
        type="select"
        multi={for_column}
        label="Транспортное средство"
        error={props.error}
        className="white-space-pre-wrap"
        disabled={props.disabled}
        options={CARS}
        value={for_column ? value : value[0]}
        onChange={this.handleChange}
      />
    );
  }
}

export default connect<StatePropsFieldCarIdsMissionTemplate, DispatchPropsFieldCarIdsMissionTemplate, OwnPropsFieldCarIdsMissionTemplate, ReduxState>(
  (state) => ({
    municipalFacilityForMissionList: getSomeUniqState(state).municipalFacilityForMissionList,
  }),
  (dispatch, { page, path }) => ({
    autobaseGetSetCar: (payload) => (
      dispatch(
        autobaseActions.autobaseGetSetCar(
          payload,
          { page, path },
        ),
      )
    ),
  }),
)(FieldCarIdsMissionTemplate);
