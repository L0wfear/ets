import * as React from 'react';
import { CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { BlockCarInfoProps } from '../../../../@types/BlockCarInfo';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { compose } from 'recompose';
import { ReduxState } from 'redux-main/@types/state';
import { autobaseGetSetCarFuncTypes } from 'redux-main/reducers/modules/autobase/car_func_types/actions';
import useCarFuncTypesOptionsByName from './useCarFuncTypesOptionsByName';

type FieldCarsConditionsCarTypeStateProps = {};
type FieldCarsConditionsCarTypeDispatchProps = {
  autobaseGetSetCarFuncTypes: HandleThunkActionCreator<typeof autobaseGetSetCarFuncTypes>;
};
type FieldCarsConditionsCarTypeOwnProps = {
  value: CarsConditionCars['type'];
  error: string;
  handleChange: BlockCarInfoProps['handleChange'];
  isPermitted: boolean;
  page: string;
  path?: string;
};
type FieldCarsConditionsCarTypeMergedProps = (
  FieldCarsConditionsCarTypeStateProps
  & FieldCarsConditionsCarTypeDispatchProps
  & FieldCarsConditionsCarTypeOwnProps
);

type FieldCarsConditionsCarTypeProps = FieldCarsConditionsCarTypeMergedProps;

const FieldCarsConditionsCarType: React.FC<FieldCarsConditionsCarTypeProps> = (props) => {
  const {
    carFuncTypeOptions,
  } = useCarFuncTypesOptionsByName(
    props.autobaseGetSetCarFuncTypes,
    props.page, props.path,
  );

  return (
    <ExtField
      type="select"
      label="Тип ТС:"
      value={props.value}
      onChange={props.handleChange}
      options={carFuncTypeOptions}
      error={props.error}
      boundKeys="type"
      clearable={false}
      disabled={!props.isPermitted}
    />
  );
};

export default compose<FieldCarsConditionsCarTypeProps, FieldCarsConditionsCarTypeOwnProps>(
  connect<FieldCarsConditionsCarTypeStateProps, FieldCarsConditionsCarTypeDispatchProps, FieldCarsConditionsCarTypeOwnProps, ReduxState>(
    null,
    (dispatch: any) => ({
      autobaseGetSetCarFuncTypes: (...arg) => (
        dispatch(
          autobaseGetSetCarFuncTypes(...arg),
        )
      ),
    }),
  ),
)(FieldCarsConditionsCarType);
