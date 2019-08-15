
import * as React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

import { ExtField } from 'components/ui/new/field/ExtField';
import { ReduxState } from 'redux-main/@types/state';
import {
  PropsFieldCarIdsMission,
  StatePropsFieldCarIdsMission,
  DispatchPropsFieldCarIdsMission,
  OwnPropsFieldCarIdsMission,
  StateFieldCarIdsMission,
} from 'components/new/pages/missions/mission/form/main/inside_fields/car_ids/FieldCarIdsMission.h';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import { getMissionsState } from 'redux-main/reducers/selectors/index';
import { makeOptionsForMission, makeLabelForMissionCarOption } from './makeOptions';
import { DefaultSelectOption } from 'components/ui/input/ReactSelect/utils';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import FieldCarIdsMissionSelectComponents from './components';

class FieldCarIdsMission extends React.PureComponent<PropsFieldCarIdsMission, StateFieldCarIdsMission> {
  state = {
    CARS_OPTIONS: [],
  };

  static getDerivedStateFromProps(nextProps: PropsFieldCarIdsMission) {
    const {
      value,
      car_gov_numbers,
      car_model_names,
      car_special_model_names,
      car_type_ids,
      car_type_names,
      carForMissionList,
      structure_id,
    } = nextProps;

    let CARS_OPTIONS = makeOptionsForMission(
      carForMissionList,
      structure_id,
      !nextProps.IS_TEMPLATE,
    );

    if (value.length) {
      const optionsNotInCarOptions = value.reduce((newArr, car_id, index) => {
        if (!CARS_OPTIONS.some((carOptions) => carOptions.value === car_id)) {
          const customOption: DefaultSelectOption<Car['asuods_id'], string, Partial<Car>> = {
            value: car_id,
            label: (
              makeLabelForMissionCarOption({
                gov_number: get(car_gov_numbers, index, ''),
                type_name: car_type_names[index],
                model_name: get(car_model_names, index, ''),
                special_model_name: get(car_special_model_names, index, ''),
              })
            ),
            rowData: {
              asuods_id: car_id,
              gov_number: get(car_gov_numbers, index, ''),
              type_id: get(car_type_ids, index, null),
              model_name: get(car_model_names, index, ''),
              special_model_name: get(car_special_model_names, index, ''),
              type_name: get(car_type_names, index, ''),
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
      MISSION_IS_ORDER_SOURCE,
      dependeceTechnicalOperation,
    } = this.props;

    if (isPermitted) {
      if (MISSION_IS_ORDER_SOURCE && dependeceTechnicalOperation || !MISSION_IS_ORDER_SOURCE) {
        this.getCars();
      }
    }
  }

  componentDidUpdate(prevProps: PropsFieldCarIdsMission) {
    const {
      value,
      car_gov_numbers,
      car_type_ids,
      car_model_names,
      isPermitted,
      for_column,
      structure_id,
      MISSION_IS_ORDER_SOURCE,
      dependeceTechnicalOperation,
    } = this.props;

    const car_type_names = get(this.props, 'car_type_names', []) || [];
    const car_special_model_names = get(this.props, 'car_special_model_names', []) || [];

    if (isPermitted) {
      if (MISSION_IS_ORDER_SOURCE && dependeceTechnicalOperation && !prevProps.dependeceTechnicalOperation) {
        this.getCars();
      }

      if ((for_column !== prevProps.for_column) && value.length > 1) {
        const car_gov_numbers_new = car_gov_numbers.slice(0, 1);
        const car_type_ids_new = car_type_ids.slice(0, 1);
        const car_model_names_new = car_model_names.slice(0, 1);
        const car_special_model_names_new = car_special_model_names.slice(0, 1);
        const car_type_names_new = car_type_names.slice(0, 1);

        this.props.onChange({
          car_gov_numbers: car_gov_numbers_new,
          car_gov_numbers_text: car_gov_numbers_new.join(', '),
          car_ids: value.slice(0, 1),
          car_type_ids: car_type_ids_new,
          car_model_names: car_model_names_new,
          car_special_model_names: car_special_model_names_new,
          car_type_names: car_type_names_new,
          car_type_names_text: car_type_names_new.join(', '),
        });
      }
      if (structure_id !== prevProps.structure_id && structure_id) {
        let hasSomeChange = false;

        const permittedIndexObj = value.reduce((newObj, car_id, index) => {
          const car = get<PropsFieldCarIdsMission['carForMissionIndex'], number, null>(this.props.carForMissionIndex, car_id, null);

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
          const car_model_names_new = car_model_names.filter((_, index) => permittedIndexObj[index]);
          const car_special_model_names_new = car_special_model_names.filter((_, index) => permittedIndexObj[index]);

          this.props.onChange({
            car_gov_numbers: car_gov_numbers_new,
            car_gov_numbers_text: car_gov_numbers_new.join(', '),
            car_ids,
            car_type_ids: car_type_ids_new,
            car_model_names: car_model_names_new,
            car_special_model_names: car_special_model_names_new,
            car_type_names: car_type_names_new,
            car_type_names_text: car_type_names_new.join(', '),
          });
        }
      }
    }
  }

  componentWillUnmount() {
    this.props.actionResetCarsMission();
  }

  async getCars() {
    const {
      MISSION_IS_ORDER_SOURCE,
      norm_ids,
      loadByNormId,
      dependeceTechnicalOperation,
      page, path,
    } = this.props;

    const payload: any = {};
    if (MISSION_IS_ORDER_SOURCE) {
      const norm_id = get(dependeceTechnicalOperation, 'norm_id', null);
      if (norm_id) {
        payload.norm_ids = norm_id.toString();
      }
    }
    if (loadByNormId && norm_ids.length) {
      payload.norm_ids = norm_ids.toString();
    }
    const {
      dataIndex,
    } = await this.props.actionGetAndSetInStoreCarForMission(
      payload,
      { page, path },
    );

    const {
      value,
      car_gov_numbers,
      car_type_ids,
      car_type_names,
      car_model_names,
      car_special_model_names,
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
        const car_model_names_new = car_model_names.filter((_, index) => permittedIndexObj[index]);
        const car_special_model_names_new = car_special_model_names.filter((_, index) => permittedIndexObj[index]);

        this.props.onChange({
          car_gov_numbers: car_gov_numbers_new,
          car_gov_numbers_text: car_gov_numbers_new.join(', '),
          car_ids,
          car_type_ids: car_type_ids_new,
          car_model_names: car_model_names_new,
          car_special_model_names: car_special_model_names_new,
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
        const car_model_names = option.map(({ rowData }) => rowData.model_name);
        const car_special_model_names = option.map(({ rowData }) => rowData.special_model_name);

        props.onChange({
          car_gov_numbers,
          car_gov_numbers_text: car_gov_numbers.join(', '),
          car_ids: value,
          car_type_ids,
          car_type_names,
          car_model_names,
          car_special_model_names,
          car_type_names_text: car_type_names.join(', '),
        });
      } else {
        if (!value) {
          props.onChange({
            car_gov_numbers: [],
            car_gov_numbers_text: '',
            car_ids: [],
            car_type_ids: [],
            car_model_names: [],
            car_special_model_names: [],
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
          let car_model_names = get(option, ['rowData', 'model_name'], '');
          car_model_names = car_model_names ? [car_model_names] : [];
          let car_special_model_names = get(option, ['rowData', 'special_model_name'], '');
          car_special_model_names = car_special_model_names ? [car_special_model_names] : [];

          props.onChange({
            car_gov_numbers,
            car_gov_numbers_text: car_gov_numbers.join(', '),
            car_ids: [value],
            car_type_ids,
            car_model_names,
            car_special_model_names,
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
      IS_TEMPLATE,
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
        components={!IS_TEMPLATE ? FieldCarIdsMissionSelectComponents : null}
        clearable={false}
      />
    );
  }
}

export default connect<StatePropsFieldCarIdsMission, DispatchPropsFieldCarIdsMission, OwnPropsFieldCarIdsMission, ReduxState>(
  (state) => ({
    carForMissionList: getMissionsState(state).missionData.carsList,
    carForMissionIndex: getMissionsState(state).missionData.carsIndex,
    dependeceTechnicalOperation: getMissionsState(state).missionData.dependeceTechnicalOperation,
  }),
  (dispatch: any) => ({
    actionGetAndSetInStoreCarForMission: (...arg) => (
      dispatch(
        missionsActions.actionGetAndSetInStoreCarForMission(...arg),
      )
    ),
    actionResetCarsMission: (...arg) => (
      dispatch(
        missionsActions.actionResetCarsMission(...arg),
      )
    ),
  }),
)(FieldCarIdsMission);
