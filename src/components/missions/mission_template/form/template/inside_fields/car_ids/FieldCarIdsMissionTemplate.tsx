
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
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import { getMissionsState } from 'redux-main/reducers/selectors/index';
import { makeOptionsForMissiontemplate, makeLabelForMissionTemplateCarOption } from './makeOptions';
import { DefaultSelectOption } from 'components/ui/input/ReactSelect/utils';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

class FieldCarIdsMissionTemplate extends React.PureComponent<PropsFieldCarIdsMissionTemplate, StateFieldCarIdsMissionTemplate> {
  state = {
    CARS_OPTIONS: [],
  };

  static getDerivedStateFromProps(nextProps: PropsFieldCarIdsMissionTemplate) {
    const {
      value,
      car_gov_numbers,
      car_type_ids,
      car_type_names,
      carForMissionTemplateList,
      structure_id,
    } = nextProps;

    let CARS_OPTIONS = makeOptionsForMissiontemplate(
      carForMissionTemplateList,
      structure_id,
    );

    if (value.length) {
      const optionsNotInCarOptions = value.reduce((newArr, car_id, index) => {
        if (!CARS_OPTIONS.some((carOptions) => carOptions.value === car_id)) {
          const customOption: DefaultSelectOption<Car['asuods_id'], string, Partial<Car>> = {
            value: car_id,
            label: (
              makeLabelForMissionTemplateCarOption({
                gov_number: car_gov_numbers[index],
                type_name: car_type_names[index],
              })
            ),
            rowData: {
              asuods_id: car_id,
              gov_number: car_gov_numbers[index],
              type_id: car_type_ids[index],
              type_name: car_type_names[index],
            },
          };
          newArr.push(customOption);
        }

        return newArr;
      }, []);

      if (optionsNotInCarOptions.length) {
        CARS_OPTIONS = [
          ...CARS_OPTIONS,
          ...optionsNotInCarOptions,
        ];
      }
    }

    return {
      CARS_OPTIONS,
    };
  }

  componentDidMount() {
    const {
      isPermitted,
      municipal_facility_id,
      municipalFacilityForMissionList,
    } = this.props;

    if (isPermitted && municipal_facility_id && municipalFacilityForMissionList.length) {
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
      isPermitted,
      for_column,
      municipal_facility_id,
      municipalFacilityForMissionList,
      structure_id,
    } = this.props;

    if (isPermitted) {
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
            const car = get<PropsFieldCarIdsMissionTemplate['carForMissionTemplateIndex'], number, null>(this.props.carForMissionTemplateIndex, car_id, null);

            if (car && (car.is_common || car.company_structure_id === structure_id)) {
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
  }

  componentWillUnmount() {
    this.props.actionResetCarsMissionTemplate();
  }

  async getCars(selectedMfData) {
    const { normatives } = selectedMfData;
    const { page, path } = this.props;

    const {
      dataIndex,
    } = await this.props.actionGetAndSetInStoreCarForMission(
      {
        norm_ids: normatives.map(({ id }) => id).join(','),
      },
      { page, path },
    );

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

  render() {
    const {
      props,
    } = this;

    const {
      value,
      for_column,
    } = props;

    const {
      CARS_OPTIONS,
    } = this.state;

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
        options={CARS_OPTIONS}
        value={for_column ? value : value[0]}
        onChange={this.handleChange}
      />
    );
  }
}

export default connect<StatePropsFieldCarIdsMissionTemplate, DispatchPropsFieldCarIdsMissionTemplate, OwnPropsFieldCarIdsMissionTemplate, ReduxState>(
  (state) => ({
    municipalFacilityForMissionList: getSomeUniqState(state).municipalFacilityForMissionList,
    carForMissionTemplateList: getMissionsState(state).carForMissionTemplateList,
    carForMissionTemplateIndex: getMissionsState(state).carForMissionTemplateIndex,
  }),
  (dispatch: any) => ({
    actionGetAndSetInStoreCarForMission: (...arg) => (
      dispatch(
        missionsActions.actionGetAndSetInStoreCarForMission(...arg),
      )
    ),
    actionResetCarsMissionTemplate: (...arg) => (
      dispatch(
        missionsActions.actionResetCarsMissionTemplate(...arg),
      )
    ),
  }),
)(FieldCarIdsMissionTemplate);
