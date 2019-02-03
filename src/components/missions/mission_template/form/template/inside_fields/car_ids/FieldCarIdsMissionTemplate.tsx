
import * as React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

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

  componentDidUpdate(prevProps: PropsFieldCarIdsMissionTemplate) {
    const {
      value,
      car_gov_numbers,
      car_type_ids,
      car_type_names,
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
        car_gov_numbers: [],
        car_gov_numbers_text: '',
        car_ids: [],
        car_type_ids: [],
        car_type_names: [],
        car_type_names_text: '',
      });
    } else if ((for_column !== prevProps.for_column) && value.length > 1) {
      const car_gov_numbers_new = car_gov_numbers.slice(0, 1);
      const car_type_ids_new = car_type_ids.slice(0, 1);
      const car_type_names_new = car_type_names.slice(0, 1);

      this.props.onChange({
        car_gov_numbers: car_gov_numbers_new,
        car_gov_numbers_text: car_gov_numbers_new.join(', '),
        car_ids: value.slice(0, 1),
        car_type_ids: car_type_ids_new,
        car_type_names: car_type_names_new,
        car_type_names_text: car_type_names_new.join(', '),
      });
    } else if (structure_id !== prevProps.structure_id) {
      if (structure_id) {
        let hasSomeChange = false;

        const permittedIndexObj = value.reduce((newObj, car_id, index) => {
          if (this.state.carIndex[car_id].is_common || this.state.carIndex[car_id].company_structure_id === structure_id) {
            newObj[index] = true;
          } else {
            hasSomeChange = true;
          }

          return newObj;
        }, {});

        if (hasSomeChange) {
          const car_ids = value.filter((_, index) => permittedIndexObj[index]);
          const car_gov_numbers_new = car_gov_numbers.filter((_, index) => permittedIndexObj[index]);
          const car_type_ids_new = car_type_ids.filter((_, index) => permittedIndexObj[index]);
          const car_type_names_new = car_type_names.filter((_, index) => permittedIndexObj[index]);

          this.props.onChange({
            car_gov_numbers: car_gov_numbers_new,
            car_gov_numbers_text: car_gov_numbers_new.join(', '),
            car_ids,
            car_type_ids: car_type_ids_new,
            car_type_names: car_type_names_new,
            car_type_names_text: car_type_names_new.join(', '),
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
      car_gov_numbers,
      car_type_ids,
      car_type_names,
    } = this.props;

    if (value.length) {
      let hasSomeChange = false;

      const permittedIndexObj = value.reduce((newObj, car_id, index) => {
        if (dataIndex[car_id]) {
          newObj[index] = true;
        } else {
          hasSomeChange = true;
        }

        return newObj;
      }, {});

      if (hasSomeChange) {
        const car_ids = value.filter((_, index) => permittedIndexObj[index]);
        const car_gov_numbers_new = car_gov_numbers.filter((_, index) => permittedIndexObj[index]);
        const car_type_ids_new = car_type_ids.filter((_, index) => permittedIndexObj[index]);
        const car_type_names_new = car_type_names.filter((_, index) => permittedIndexObj[index]);

        this.props.onChange({
          car_gov_numbers: car_gov_numbers_new,
          car_gov_numbers_text: car_gov_numbers_new.join(', '),
          car_ids,
          car_type_ids: car_type_ids_new,
          car_type_names: car_type_names_new,
          car_type_names_text: car_type_names_new.join(', '),
        });
      }
    }

    this.setState({
      carList: data,
      carIndex: dataIndex,
    });
  }

  handleChange = (value, option) => {
    const { props } = this;
    const { for_column } = props;

    if (value !== props.value) {
      if (for_column) {
        const car_gov_numbers = option.map(({ rowData }) => rowData.gov_number);
        const car_type_ids = option.map(({ rowData }) => rowData.type_id);
        const car_type_names = option.map(({ rowData }) => rowData.type_name);

        props.onChange({
          car_gov_numbers,
          car_gov_numbers_text: car_gov_numbers.join(', '),
          car_ids: value,
          car_type_ids,
          car_type_names,
          car_type_names_text: car_type_names.join(', '),
        });
      } else {
        if (!value) {
          props.onChange({
            car_gov_numbers: [],
            car_gov_numbers_text: '',
            car_ids: [],
            car_type_ids: [],
            car_type_names: [],
            car_type_names_text: '',
          });
        } else {
          let car_gov_numbers = get(option, ['rowData', 'gov_number'], '');
          car_gov_numbers = car_gov_numbers ? [car_gov_numbers] : [];

          let car_type_ids = get(option, ['rowData', 'type_id'], '');
          car_type_ids = car_type_ids ? [car_type_ids] : [];
          let car_type_names = get(option, ['rowData', 'type_name'], '');
          car_type_names = car_type_names ? [car_type_names] : [];

          props.onChange({
            car_gov_numbers,
            car_gov_numbers_text: car_gov_numbers.join(', '),
            car_ids: [value],
            car_type_ids,
            car_type_names,
            car_type_names_text: car_type_names.join(', '),
          });
        }
      }
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
              rowData: carData,
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
